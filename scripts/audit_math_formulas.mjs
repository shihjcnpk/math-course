import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import katex from 'katex'
import ts from 'typescript'

const defaultWarn = console.warn
console.warn = (message, ...rest) => {
  if (!String(message).startsWith('No character metrics for')) {
    defaultWarn(message, ...rest)
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const lectureDir = path.join(root, 'src', 'data', 'lectures')
const files = fs
  .readdirSync(lectureDir)
  .filter((name) => /^lecture-\d+\.ts$/.test(name))
  .sort()

const failures = []
let formulaCount = 0

const standaloneLatexPattern = /\\(begin|end|text|frac|sqrt|times|div|cdot|leq|geq|neq|quad|qquad|left|right|sum|bar|Delta|rightarrow|Rightarrow|boxed|underbrace|pm)\b/
const anyLatexCommandPattern = /\\[A-Za-z]+/

function renderFormula(raw, displayMode, context) {
  let formula = raw.trim()
  if (formula.startsWith('$$') && formula.endsWith('$$')) {
    formula = formula.slice(2, -2).trim()
  } else if (formula.startsWith('$') && formula.endsWith('$')) {
    formula = formula.slice(1, -1).trim()
  }
  if (!formula) return

  formulaCount += 1
  try {
    katex.renderToString(formula, {
      displayMode,
      throwOnError: true,
      strict: 'ignore',
      trust: false,
    })
  } catch (error) {
    failures.push(`${context}: ${formula.slice(0, 120)} → ${error.message}`)
  }
}

function scanMathText(text, context) {
  let cursor = 0
  let foundDelimitedMath = false

  while (cursor < text.length) {
    const blockStart = text.indexOf('$$', cursor)
    const inlineStart = text.indexOf('$', cursor)
    if (blockStart === -1 && inlineStart === -1) break

    const useBlock = blockStart !== -1 && (inlineStart === -1 || blockStart <= inlineStart)
    const start = useBlock ? blockStart : inlineStart
    const delimiter = useBlock ? '$$' : '$'
    const contentStart = start + delimiter.length
    const end = text.indexOf(delimiter, contentStart)
    if (end === -1) {
      failures.push(`${context}: 数学定界符 ${delimiter} 未闭合 → ${text.slice(start, start + 120)}`)
      return
    }

    renderFormula(text.slice(contentStart, end), useBlock, context)
    foundDelimitedMath = true
    cursor = end + delimiter.length
  }

  if (!foundDelimitedMath && anyLatexCommandPattern.test(text)) {
    if (standaloneLatexPattern.test(text)) {
      renderFormula(text, true, context)
    } else {
      failures.push(`${context}: 存在不会被页面识别的裸露 LaTeX 命令 → ${text.slice(0, 140)}`)
    }
  }
}

function visit(value, context) {
  if (typeof value === 'string') {
    scanMathText(value, context)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, `${context}[${index}]`))
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      visit(item, `${context}.${key}`)
    }
  }
}

for (const file of files) {
  const source = fs.readFileSync(path.join(lectureDir, file), 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: file,
  }).outputText
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(output).toString('base64')}`
  const lectureModule = await import(moduleUrl)
  visit(lectureModule.default, file)
}

console.log(`KaTeX audit: ${formulaCount} formulas in ${files.length} lecture files`)
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('KaTeX audit passed with 0 parse or delimiter errors')
}
