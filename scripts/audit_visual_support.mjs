import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'

const root = process.cwd()
const require = createRequire(import.meta.url)
const figureReference = /如图|下图|图中所示|图示/
const answerVisualNeed = /画|作图|描点|补全|图像|数轴|统计图|直方图|箱线图|扇形图|折线图|条形图|坐标系中表示/
const oralVisualNeed = /如图|下图|画图|图像|拼图|统计图|知识地图/

function loadLecture(id) {
  const filename = path.join(root, 'src', 'data', 'lectures', `lecture-${String(id).padStart(2, '0')}.ts`)
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const module = { exports: {} }
  new Function('exports', 'require', 'module', output)(module.exports, require, module)
  return module.exports.default
}

const rows = []
const figureItems = []
const answerItems = []
const oralItems = []
const otherItems = []

for (let lectureId = 1; lectureId <= 48; lectureId += 1) {
  const lecture = loadLecture(lectureId)
  const lectureFigures = []
  const lectureAnswers = []
  const lectureOral = []
  const lectureOther = []

  lecture.typicalQuestions.forEach((question, questionIndex) => {
    if (figureReference.test(question.example.problem)) lectureFigures.push(`例题${questionIndex + 1}`)
    if (answerVisualNeed.test(question.example.problem)) lectureAnswers.push(`例题${questionIndex + 1}`)
    question.variations.forEach((variation, variationIndex) => {
      if (figureReference.test(variation.problem)) lectureFigures.push(`变式${questionIndex + 1}-${variationIndex + 1}`)
      if (answerVisualNeed.test(variation.problem)) lectureAnswers.push(`变式${questionIndex + 1}-${variationIndex + 1}`)
    })
  })

  for (const [tier, exercises] of Object.entries(lecture.exercises)) {
    for (const exercise of exercises) {
      if (figureReference.test(exercise.question)) lectureFigures.push(`${tier}:${exercise.id}`)
      if (answerVisualNeed.test(exercise.question)) lectureAnswers.push(`${tier}:${exercise.id}`)
    }
  }

  if (oralVisualNeed.test(lecture.oralTask.problem)) lectureOral.push('口头讲题')
  lecture.concepts.forEach((concept, conceptIndex) => {
    if (figureReference.test(concept.formalDefinition)) lectureOther.push(`概念${conceptIndex + 1}`)
  })
  if (figureReference.test(lecture.errorCard.fields.similarPractice)) lectureOther.push('错题卡同类再练')
  figureItems.push(...lectureFigures.map(item => `第${lectureId}讲 ${item}`))
  answerItems.push(...lectureAnswers.map(item => `第${lectureId}讲 ${item}`))
  oralItems.push(...lectureOral.map(item => `第${lectureId}讲 ${item}`))
  otherItems.push(...lectureOther.map(item => `第${lectureId}讲 ${item}`))
  rows.push({ lectureId, title: lecture.meta.title, figures: lectureFigures.length, answers: lectureAnswers.length, oral: lectureOral.length, other: lectureOther.length })
}

const componentSource = fs.readFileSync(path.join(root, 'src', 'components', 'lecture', 'GeometryExampleDiagram.tsx'), 'utf8')
const exerciseSource = fs.readFileSync(path.join(root, 'src', 'components', 'lecture', 'ExerciseSection.tsx'), 'utf8')
const exampleSource = fs.readFileSync(path.join(root, 'src', 'components', 'lecture', 'ExampleSection.tsx'), 'utf8')
const oralSource = fs.readFileSync(path.join(root, 'src', 'components', 'lecture', 'OralTaskSection.tsx'), 'utf8')
const conceptSource = fs.readFileSync(path.join(root, 'src', 'components', 'lecture', 'ConceptSection.tsx'), 'utf8')
const lecturePageSource = fs.readFileSync(path.join(root, 'src', 'pages', 'LecturePage.tsx'), 'utf8')

const architectureChecks = [
  ['主例题图示入口', exampleSource.includes('GeometryExampleDiagram') && exampleSource.includes('q.example.problem')],
  ['变式题题干图示入口', exampleSource.includes('context="exercise"') && exampleSource.includes('variation-')],
  ['变式题答案图示入口', exampleSource.includes('context="answer"') && exampleSource.includes('variation-answer-')],
  ['分层训练题干图示入口', exerciseSource.includes('context="exercise"')],
  ['分层训练答案图示入口', exerciseSource.includes('context="answer"')],
  ['口头讲题图示入口', oralSource.includes('context="oral"')],
  ['概念定义图示入口', conceptSource.includes('GeometryExampleDiagram') && conceptSource.includes('c.formalDefinition')],
  ['错题卡同类再练图示入口', lecturePageSource.includes('diagramId="error-card-similar"')],
  ['响应式SVG', componentSource.includes('viewBox="0 0 600 320"') && componentSource.includes('w-full')],
  ['题图与答案图分离', componentSource.includes("context === 'answer' ? '答案图示' : '题意示意图'")],
]

const badSymbols = []
for (const file of fs.readdirSync(path.join(root, 'src', 'data', 'lectures')).filter(file => file.endsWith('.ts'))) {
  const source = fs.readFileSync(path.join(root, 'src', 'data', 'lectures', file), 'utf8')
  if (/[∀∃]|\\forall|\\exists/.test(source)) badSymbols.push(file)
  if (/\uFFFD/.test(source)) badSymbols.push(`${file}（替换字符）`)
}

const passed = architectureChecks.every(([, ok]) => ok) && badSymbols.length === 0
const activeRows = rows.filter(row => row.figures || row.answers || row.oral || row.other)
const report = `# 全课程视觉支持检查报告

生成方式：\`npm run audit:visual\`

## 结论

* 状态：**${passed ? '通过' : '未通过'}**
* 检查课程：48 讲
* 题干明确引用图形的内容：${figureItems.length} 项
* 作图/图像类答案需要视觉结果的内容：${answerItems.length} 项
* 需要视觉支撑的口头讲题：${oralItems.length} 项
* 概念与错题卡中的明确图形引用：${otherItems.length} 项
* 不适合初中阶段的量词符号（∀/∃）：${badSymbols.length} 处

## 渲染入口检查

| 检查项 | 结果 |
| --- | --- |
${architectureChecks.map(([name, ok]) => `| ${name} | ${ok ? '通过' : '缺失'} |`).join('\n')}

## 分讲覆盖清单

| 讲次 | 课程 | 题干引用图 | 答案作图/图像 | 口头讲题图 | 概念/错题卡图 |
| --- | --- | ---: | ---: | ---: | ---: |
${activeRows.map(row => `| ${row.lectureId} | ${row.title} | ${row.figures} | ${row.answers} | ${row.oral} | ${row.other} |`).join('\n')}

## 设计原则

1. 题干写“如图/下图”的，图必须紧跟题干显示，不能依赖学生想象。
2. 要求学生作图、描点或补全统计图的，题干不提前泄露答案；点击“查看答案”后显示完成图。
3. 主例题、变式题、四层训练和口头讲题共用同一套响应式SVG规范。
4. 深蓝表示主结构，红色表示关键条件，紫色虚线表示辅助线、折痕或对称位置。
5. 动态图只用于平移、折叠、动点最值和函数变化，并应允许暂停，避免持续运动分散注意力。
6. 所有示意图声明“不按比例”，证明结论只能来自已知条件和定理。

## 不适合的符号或乱码

${badSymbols.length ? badSymbols.map(item => `* ${item}`).join('\n') : '* 未发现 ∀、∃ 或替换字符。'}
`

const reportPath = path.join(root, 'reports', 'visual_support_check.md')
fs.writeFileSync(reportPath, report, 'utf8')
console.log(`视觉支持审计：${passed ? '通过' : '未通过'}；题干图 ${figureItems.length}，答案图 ${answerItems.length}，口头图 ${oralItems.length}，概念/错题卡图 ${otherItems.length}。`)
if (!passed) process.exitCode = 1
