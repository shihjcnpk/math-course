import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const root = process.cwd()
const chromeCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
]
const chromePath = chromeCandidates.find(candidate => {
  try {
    return requireStat(candidate)
  } catch {
    return false
  }
})

function requireStat(filename) {
  return Boolean(process.getBuiltinModule('fs').statSync(filename).isFile())
}

if (!chromePath) throw new Error('未找到 Chrome 或 Edge，无法执行浏览器视觉验收。')

const port = 9333
const profileDir = await fs.mkdtemp(path.join(os.tmpdir(), 'math-course-visual-audit-'))
const screenshotDir = path.join(root, 'reports', 'visual-screenshots')
await fs.mkdir(screenshotDir, { recursive: true })

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=1440,1000',
  'about:blank',
], { stdio: 'ignore' })

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function waitForDebugger() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (response.ok) return
    } catch {
      // Chrome is still starting.
    }
    await sleep(100)
  }
  throw new Error('Chrome 调试端口启动超时。')
}

function createCdpClient(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl)
  let sequence = 0
  const pending = new Map()
  const listeners = new Map()
  const opened = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })

  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const request = pending.get(message.id)
      if (!request) return
      pending.delete(message.id)
      if (message.error) request.reject(new Error(message.error.message))
      else request.resolve(message.result)
      return
    }
    const handlers = listeners.get(message.method) ?? []
    handlers.forEach(handler => handler(message.params))
  })

  async function send(method, params = {}) {
    await opened
    const id = ++sequence
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject })
      socket.send(JSON.stringify({ id, method, params }))
    })
  }

  function once(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`${method} 等待超时`)), timeout)
      const handler = params => {
        clearTimeout(timer)
        listeners.set(method, (listeners.get(method) ?? []).filter(item => item !== handler))
        resolve(params)
      }
      listeners.set(method, [...(listeners.get(method) ?? []), handler])
    })
  }

  function on(method, handler) {
    listeners.set(method, [...(listeners.get(method) ?? []), handler])
  }

  return { send, once, on, close: () => socket.close() }
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}

async function navigate(client, url) {
  const loaded = client.once('Page.loadEventFired')
  await client.send('Page.navigate', { url })
  await loaded
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await evaluate(client, `(() => {
      const text = document.body?.innerText ?? ''
      return document.querySelector('h1') !== null && !text.includes('加载课程内容中')
    })()`)
    if (ready) return
    await sleep(75)
  }
  throw new Error(`${url} 课程内容加载超时`)
}

async function captureElement(client, selector, filename) {
  const rect = await evaluate(client, `(() => {
    const element = document.querySelector(${JSON.stringify(selector)})
    if (!element) return null
    const box = element.getBoundingClientRect()
    return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height }
  })()`)
  if (!rect) throw new Error(`截图元素不存在：${selector}`)
  const screenshot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { ...rect, scale: 1 },
  })
  await fs.writeFile(path.join(screenshotDir, filename), screenshot.data, 'base64')
}

async function captureFigureContaining(client, text, filename) {
  const rect = await evaluate(client, `(() => {
    const element = [...document.querySelectorAll('figure[data-problem-diagram]')]
      .find(figure => (figure.textContent ?? '').includes(${JSON.stringify(text)}) || (figure.querySelector('title')?.textContent ?? '').includes(${JSON.stringify(text)}))
    if (!element) return null
    const box = element.getBoundingClientRect()
    return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height }
  })()`)
  if (!rect) throw new Error(`未找到包含“${text}”的图形。`)
  const screenshot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { ...rect, scale: 1 },
  })
  await fs.writeFile(path.join(screenshotDir, filename), screenshot.data, 'base64')
}

const pageErrors = []
const rows = []
let promptDiagramTotal = 0
let answerDiagramTotal = 0
let variationDiagramTotal = 0
let missingPromptTotal = 0
let missingAnswerTotal = 0
let missingVariationTotal = 0

try {
  await waitForDebugger()
  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' })
  const target = await targetResponse.json()
  const client = createCdpClient(target.webSocketDebuggerUrl)
  await client.send('Page.enable')
  await client.send('Runtime.enable')
  await client.send('Log.enable')
  client.on('Runtime.exceptionThrown', event => pageErrors.push(event.exceptionDetails?.text ?? '未说明的脚本异常'))
  client.on('Log.entryAdded', event => {
    if (event.entry.level === 'error') pageErrors.push(event.entry.text)
  })

  for (let lectureId = 1; lectureId <= 48; lectureId += 1) {
    await navigate(client, `http://127.0.0.1:5173/lectures/${lectureId}`)
    const base = await evaluate(client, `(() => {
      const text = document.body.innerText
      const figures = [...document.querySelectorAll('figure[data-problem-diagram]')]
      return {
        title: document.querySelector('h1')?.innerText ?? '',
        blank: text.trim().length < 200,
        loadError: text.includes('课程内容加载失败'),
        replacementCharacter: text.includes('\uFFFD'),
        formalQuantifiers: /[∀∃]/.test(text),
        invalidFigures: figures.filter(figure => {
          const svg = figure.querySelector('svg')
          if (!svg) return true
          const rect = svg.getBoundingClientRect()
          return !svg.getAttribute('viewBox') || rect.width < 100 || rect.height < 50
        }).length,
      }
    })()`)

    const variationOpened = await evaluate(client, `(() => {
      const buttons = [...document.querySelectorAll('button')].filter(button => /查看 \\d+ 道变式题/.test(button.textContent ?? ''))
      buttons.forEach(button => button.click())
      return buttons.length
    })()`)
    if (variationOpened) await sleep(80)
    const variationState = await evaluate(client, `(() => {
      const cards = [...document.querySelectorAll('[data-variation-card]')]
      const explicit = /如图|下图/
      const answerVisual = /画|作图|描点|补全|图像|数轴|统计图|直方图|箱线图|扇形图|折线图|条形图|坐标系中表示/
      return {
        count: document.querySelectorAll('[data-example-section] figure[data-problem-diagram="exercise"], [data-example-section] figure[data-problem-diagram="answer"]').length,
        missingPrompt: cards.filter(card => explicit.test(card.querySelector('[data-variation-problem]')?.innerText ?? '') && !card.querySelector('figure[data-problem-diagram="exercise"]')).length,
        missingAnswer: cards.filter(card => answerVisual.test(card.querySelector('[data-variation-problem]')?.innerText ?? '') && !card.querySelector('figure[data-problem-diagram="answer"]')).length,
      }
    })()`)

    let lecturePromptCount = 0
    let lectureAnswerCount = 0
    let lectureMissingPrompt = 0
    let lectureMissingAnswer = 0
    const tierLabels = ['基础巩固', '能力提升', '挑战拓展', '知识迁移']
    for (const tierLabel of tierLabels) {
      const tierExists = await evaluate(client, `(() => {
        const button = [...document.querySelectorAll('button')].find(item => (item.textContent ?? '').includes(${JSON.stringify(tierLabel)}))
        if (!button) return false
        button.click()
        return true
      })()`)
      if (!tierExists) continue
      await sleep(50)
      const promptState = await evaluate(client, `(() => {
        const cards = [...document.querySelectorAll('[data-exercise-section] [data-exercise-card]')]
        const explicit = /如图|下图/
        return {
          count: document.querySelectorAll('[data-exercise-section] figure[data-problem-diagram="exercise"]').length,
          missing: cards.filter(card => explicit.test(card.querySelector('[data-exercise-question]')?.innerText ?? '') && !card.querySelector('figure[data-problem-diagram="exercise"]')).length,
        }
      })()`)
      lecturePromptCount += promptState.count
      lectureMissingPrompt += promptState.missing
      const answerButtons = await evaluate(client, `(() => {
        const buttons = [...document.querySelectorAll('button')].filter(button => button.textContent?.trim() === '查看答案')
        buttons.forEach(button => button.click())
        return buttons.length
      })()`)
      if (answerButtons) await sleep(50)
      const answerState = await evaluate(client, `(() => {
        const cards = [...document.querySelectorAll('[data-exercise-section] [data-exercise-card]')]
        const answerVisual = /画|作图|描点|补全|图像|数轴|统计图|直方图|箱线图|扇形图|折线图|条形图|坐标系中表示/
        return {
          count: document.querySelectorAll('[data-exercise-section] figure[data-problem-diagram="answer"]').length,
          missing: cards.filter(card => answerVisual.test(card.querySelector('[data-exercise-question]')?.innerText ?? '') && !card.querySelector('figure[data-problem-diagram="answer"]')).length,
        }
      })()`)
      lectureAnswerCount += answerState.count
      lectureMissingAnswer += answerState.missing
    }

    const finalState = await evaluate(client, `(() => {
      const figures = [...document.querySelectorAll('figure[data-problem-diagram]')]
      return {
        invalidFigures: figures.filter(figure => {
          const svg = figure.querySelector('svg')
          if (!svg) return true
          const rect = svg.getBoundingClientRect()
          return !svg.getAttribute('viewBox') || rect.width < 100 || rect.height < 50
        }).length,
        duplicateSvgIds: (() => {
          const ids = [...document.querySelectorAll('svg [id]')].map(node => node.id)
          return ids.length - new Set(ids).size
        })(),
      }
    })()`)

    promptDiagramTotal += lecturePromptCount
    answerDiagramTotal += lectureAnswerCount
    variationDiagramTotal += variationState.count
    missingPromptTotal += lectureMissingPrompt
    missingAnswerTotal += lectureMissingAnswer
    missingVariationTotal += variationState.missingPrompt + variationState.missingAnswer
    rows.push({ lectureId, ...base, ...finalState, prompt: lecturePromptCount, answer: lectureAnswerCount, variations: variationState.count, missingPrompt: lectureMissingPrompt, missingAnswer: lectureMissingAnswer, missingVariation: variationState.missingPrompt + variationState.missingAnswer })
  }

  await navigate(client, 'http://127.0.0.1:5173/lectures/33')
  const motionResult = await evaluate(client, `(async () => {
    const button = [...document.querySelectorAll('button')].find(item => (item.textContent ?? '').includes('演示'))
    if (!button) return { button: false, starts: false, stops: false }
    button.click()
    await new Promise(resolve => setTimeout(resolve, 50))
    const starts = document.querySelectorAll('animateMotion').length > 0 && button.textContent.includes('停止')
    button.click()
    await new Promise(resolve => setTimeout(resolve, 50))
    return { button: true, starts, stops: document.querySelectorAll('animateMotion').length === 0 }
  })()`)

  const mobileRows = []
  await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  for (const lectureId of [24, 33, 36, 44]) {
    await navigate(client, `http://127.0.0.1:5173/lectures/${lectureId}`)
    const mobile = await evaluate(client, `(() => {
      const figures = [...document.querySelectorAll('figure[data-problem-diagram]')]
      return {
        lectureId: ${lectureId},
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        invalidFigures: figures.filter(figure => figure.getBoundingClientRect().width > document.documentElement.clientWidth + 1).length,
      }
    })()`)
    mobileRows.push(mobile)
    if (lectureId === 33) {
      await captureElement(client, 'figure[data-problem-diagram]', 'lecture-33-mobile.png')
      await captureFigureContaining(client, '列表描点画y=x²', 'lecture-33-parabola-mobile.png')
    }
    if (lectureId === 36) {
      await captureElement(client, 'figure[data-problem-diagram]', 'lecture-36-statistics-mobile.png')
    }
    if (lectureId === 44) {
      await captureElement(client, 'figure[data-problem-diagram]', 'lecture-44-fold-mobile.png')
    }
  }

  await client.send('Emulation.clearDeviceMetricsOverride')
  await navigate(client, 'http://127.0.0.1:5173/lectures/24')
  await captureElement(client, 'figure[data-problem-diagram]', 'lecture-24-desktop.png')

  const failedRows = rows.filter(row => row.blank || row.loadError || row.replacementCharacter || row.formalQuantifiers || row.invalidFigures || row.duplicateSvgIds || row.missingPrompt || row.missingAnswer || row.missingVariation)
  const mobileFailures = mobileRows.filter(row => row.overflow > 1 || row.invalidFigures)
  const uniqueErrors = [...new Set(pageErrors.filter(error => !error.includes('favicon.ico')))]
  const passed = failedRows.length === 0 && mobileFailures.length === 0 && uniqueErrors.length === 0 && motionResult.button && motionResult.starts && motionResult.stops

  const report = `# 全课程视觉运行验收报告

生成方式：\`npm run audit:visual-runtime\`

## 结论

* 状态：**${passed ? '通过' : '未通过'}**
* 浏览器逐页检查：48/48 讲
* 分层训练题干图累计渲染：${promptDiagramTotal}
* 展开答案图累计渲染：${answerDiagramTotal}
* 主例题与变式区图累计渲染：${variationDiagramTotal}
* 明确引用图形但题干缺图：${missingPromptTotal}
* 要求作图/描点/图像但答案缺图：${missingAnswerTotal}
* 变式题题干或答案缺图：${missingVariationTotal}
* 空白页或课程加载失败：${rows.filter(row => row.blank || row.loadError).length}
* 替换字符乱码：${rows.filter(row => row.replacementCharacter).length}
* 不适合初中生的形式量词：${rows.filter(row => row.formalQuantifiers).length}
* SVG尺寸、viewBox或ID问题：${rows.filter(row => row.invalidFigures || row.duplicateSvgIds).length}
* 浏览器脚本错误：${uniqueErrors.length}
* 动点演示：${motionResult.button && motionResult.starts && motionResult.stops ? '可手动启动并停止' : '未通过'}

## 手机宽度检查

| 讲次 | 横向溢出像素 | 超宽图形 | 状态 |
| --- | ---: | ---: | --- |
${mobileRows.map(row => `| ${row.lectureId} | ${row.overflow} | ${row.invalidFigures} | ${row.overflow <= 1 && !row.invalidFigures ? '通过' : '未通过'} |`).join('\n')}

## 逐讲检查

| 讲次 | 课程标题 | 题干图 | 答案图 | 例题/变式图 | 状态 |
| --- | --- | ---: | ---: | ---: | --- |
${rows.map(row => `| ${row.lectureId} | ${row.title.replace(/\n/g, ' ')} | ${row.prompt} | ${row.answer} | ${row.variations} | ${row.blank || row.loadError || row.replacementCharacter || row.formalQuantifiers || row.invalidFigures || row.duplicateSvgIds || row.missingPrompt || row.missingAnswer || row.missingVariation ? '未通过' : '通过'} |`).join('\n')}

## 浏览器错误

${uniqueErrors.length ? uniqueErrors.map(error => `* ${error}`).join('\n') : '* 无'}

## 截图样本

* \`reports/visual-screenshots/lecture-24-desktop.png\`
* \`reports/visual-screenshots/lecture-33-mobile.png\`
* \`reports/visual-screenshots/lecture-33-parabola-mobile.png\`
* \`reports/visual-screenshots/lecture-36-statistics-mobile.png\`
* \`reports/visual-screenshots/lecture-44-fold-mobile.png\`
`

  await fs.writeFile(path.join(root, 'reports', 'visual_runtime_check.md'), report, 'utf8')
  client.close()
  console.log(`视觉运行验收：${passed ? '通过' : '未通过'}；48讲，题干图 ${promptDiagramTotal}，答案图 ${answerDiagramTotal}，浏览器错误 ${uniqueErrors.length}。`)
  if (!passed) process.exitCode = 1
} finally {
  chrome.kill()
  await fs.rm(profileDir, { recursive: true, force: true }).catch(() => {})
}
