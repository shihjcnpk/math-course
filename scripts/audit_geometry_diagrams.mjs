import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'

const root = process.cwd()
const require = createRequire(import.meta.url)
const geometryLectureIds = [...Array.from({ length: 12 }, (_, index) => index + 19), 42, 43, 44]
const componentPath = path.join(root, 'src', 'components', 'lecture', 'GeometryExampleDiagram.tsx')
const componentSource = fs.readFileSync(componentPath, 'utf8')
const diagramKeys = new Set(
  [...componentSource.matchAll(/case '([0-9]+-[0-9]+)'/g)]
    .map(match => match[1])
    .filter(key => geometryLectureIds.includes(Number(key.split('-')[0]))),
)

function loadLecture(id) {
  const filename = path.join(root, 'src', 'data', 'lectures', `lecture-${String(id).padStart(2, '0')}.ts`)
  const javascript = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const module = { exports: {} }
  new Function('exports', 'require', 'module', javascript)(module.exports, require, module)
  return module.exports.default
}

const rows = []
const missingExplicit = []
const unmapped = []
const knownKeys = new Set()

for (const lectureId of geometryLectureIds) {
  const lecture = loadLecture(lectureId)
  let explicitCount = 0
  let diagramCount = 0
  lecture.typicalQuestions.forEach((question, index) => {
    const key = `${lectureId}-${index + 1}`
    knownKeys.add(key)
    const explicit = question.example.problem.includes('如图')
    const hasDiagram = diagramKeys.has(key)
    if (explicit) explicitCount += 1
    if (hasDiagram) diagramCount += 1
    if (explicit && !hasDiagram) missingExplicit.push({ key, problem: question.example.problem.replace(/\n/g, ' ') })
    if (!hasDiagram) unmapped.push({ key, problem: question.example.problem.replace(/\n/g, ' ') })
  })
  rows.push({ lectureId, title: lecture.meta.title, total: lecture.typicalQuestions.length, explicitCount, diagramCount })
}

const orphanKeys = [...diagramKeys].filter(key => !knownKeys.has(key))
const totalExamples = rows.reduce((sum, row) => sum + row.total, 0)
const totalExplicit = rows.reduce((sum, row) => sum + row.explicitCount, 0)
const totalDiagrams = rows.reduce((sum, row) => sum + row.diagramCount, 0)
const status = missingExplicit.length || orphanKeys.length ? '未通过' : '通过'

const report = `# 几何例题配图检查报告

生成方式：\`npm run audit:geometry\`

## 检查结论

* 状态：**${status}**
* 检查范围：第19—30讲、第42—44讲
* 主例题总数：${totalExamples}
* 已配置配图：${totalDiagrams}
* 明确写有“如图”的主例题：${totalExplicit}
* “如图”但缺少配图：${missingExplicit.length}
* 无对应例题的孤立配图键：${orphanKeys.length}

## 分讲覆盖

| 讲次 | 课程 | 主例题 | “如图”例题 | 已配图 | 状态 |
| --- | --- | ---: | ---: | ---: | --- |
${rows.map(row => `| ${row.lectureId} | ${row.title} | ${row.total} | ${row.explicitCount} | ${row.diagramCount} | ${row.explicitCount <= row.diagramCount ? '通过' : '缺图'} |`).join('\n')}

## 未配图的主例题

以下内容属于纯文字判断、代数求角或证明表达纠错，不依赖题图：

${unmapped.length ? unmapped.map(item => `* ${item.key}：${item.problem}`).join('\n') : '* 无'}

## 明确依赖图形但缺图

${missingExplicit.length ? missingExplicit.map(item => `* ${item.key}：${item.problem}`).join('\n') : '* 无'}

## 配图规范

* 深蓝粗线：主图形或已知结构；
* 红色/橙色：关键条件、等量线段或目标相关结构；
* 紫色虚线：辅助线、折痕、对称位置；
* 等长刻痕、直角标记、中点标记必须直接画在图上；
* 所有图均声明“按题意示意，不按比例”，避免凭视觉比例推理；
* SVG 使用响应式宽度，手机和平板不产生横向滚动。
`

const reportPath = path.join(root, 'reports', 'geometry_diagram_check.md')
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, report, 'utf8')
console.log(`几何例题配图检查：${status}；${totalDiagrams}/${totalExamples} 道主例题已配图；“如图”缺图 ${missingExplicit.length} 道。`)

if (status !== '通过') process.exitCode = 1
