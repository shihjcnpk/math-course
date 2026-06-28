import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentPath = path.join(root, 'src', 'components', 'lecture', 'GeometryExampleDiagram.tsx')
const source = fs.readFileSync(componentPath, 'utf8')

const checks = [
  {
    name: '支持 KaTeX 角度写法',
    ok: /\\\?circ/.test(source) && source.includes('extractDegreeValues'),
    detail: '角度解析必须同时支持 50°、50^\\circ、50^{\\circ}。',
  },
  {
    name: '同旁内角不用等角模板',
    ok: source.includes('sameSideInteriorScene') && source.includes('isSameSideInteriorProblem(problem)'),
    detail: '同旁内角应标互补角，不能复用同位角/内错角等角图。',
  },
  {
    name: '相交线角度标签按题干角名放置',
    ok: /intersectingScene\(firstAngle, problem\)/.test(source) && source.includes("problem.includes('∠AOD')"),
    detail: '∠AOD、∠AOC 等标签位置必须区分。',
  },
  {
    name: '第1讲不再固定成坐标直角三角形',
    ok: !source.includes("if (lectureId === 1) return { title: '坐标—三角形—勾股知识链'"),
    detail: '第1讲自动图应按函数、坐标三角形、数轴等题型分发。',
  },
  {
    name: '数轴题使用动态数轴',
    ok: source.includes('NumberLineFromProblem') && source.includes('isNumberLineProblem(problem)'),
    detail: '第2、3、16讲数轴题不能落入泛化几何三角形。',
  },
  {
    name: '反射题区分异侧和坐标题',
    ok: source.includes('OppositeSideShortestPath') && source.includes('CoordinateReflectionFromProblem') && !source.includes("reflectionLine(problem.includes('A(0,3)'))"),
    detail: '异侧题不作同侧反射；坐标题不能使用硬编码 km 模板。',
  },
  {
    name: '一般三角形求高不用直角模板',
    ok: source.includes('ScaleneTriangleHeight') && source.includes("problem.includes('AB=13')"),
    detail: '13、14、15 三角形求高题不能画成直角三角形。',
  },
  {
    name: '垂足等距证明图标出中点、垂线和等距',
    ok: source.includes('BD=DC') && source.includes('DE、DF分别垂直') && !source.includes("return sceneFor('26-1')\n    if (problem.includes('AB//CD')"),
    detail: '第43/47讲垂足等距题不能复用角平分线点到边距离图。',
  },
  {
    name: '统计图按题干数据绘制',
    ok: source.includes('StatisticsPlotFromProblem') && !source.includes("extra: <StatisticsPlot variant=\"bar\" /> }"),
    detail: '条形图、折线图、扇形图、直方图必须尽量读取题干数据。',
  },
]

const failures = checks.filter(check => !check.ok)
const report = [
  '# 配图语义回归检查',
  '',
  `生成方式：\`npm run audit:visual-semantics\``,
  '',
  `状态：**${failures.length ? '未通过' : '通过'}**`,
  '',
  '| 检查项 | 状态 | 说明 |',
  '| --- | --- | --- |',
  ...checks.map(check => `| ${check.name} | ${check.ok ? '通过' : '失败'} | ${check.detail} |`),
  '',
].join('\n')

const reportPath = path.join(root, 'reports', 'visual_semantics_check.md')
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, report, 'utf8')

console.log(`配图语义回归检查：${failures.length ? '未通过' : '通过'}；失败 ${failures.length}/${checks.length}`)
if (failures.length) {
  for (const failure of failures) console.error(`- ${failure.name}: ${failure.detail}`)
  process.exitCode = 1
}
