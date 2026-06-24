import type { ModuleInfo } from '@/types'

export const modules: ModuleInfo[] = [
  {
    id: 1,
    title: '总知识地图',
    subtitle: '模块一',
    description: '七八年级数学知识全景：数与式、方程与不等式、函数、几何推理、数据统计——五条主线的脉络与联系。建立“数学是一张网”的整体认知。',
    lectureRange: [1, 1],
    color: 'slate',
    gradeLevel: 'both',
  },
  {
    id: 2,
    title: '数与式',
    subtitle: '模块二',
    description: '从有理数到实数再到二次根式——数的扩展之旅。代数式、整式、分式——运算能力的完整链条。第2-11讲。',
    lectureRange: [2, 11],
    color: 'blue',
    gradeLevel: 'both',
  },
  {
    id: 3,
    title: '方程与不等式',
    subtitle: '模块三',
    description: '等式→方程→方程组；不等式→不等式组；分式方程。方程、不等式、函数三者的统一视角。第12-18讲。',
    lectureRange: [12, 18],
    color: 'amber',
    gradeLevel: 'both',
  },
  {
    id: 4,
    title: '图形与几何推理',
    subtitle: '模块四',
    description: '从点线角到平行四边形——图形的性质、判定与证明。全等三角形是证明工具，勾股定理是计算工具。第19-30讲。',
    lectureRange: [19, 30],
    color: 'emerald',
    gradeLevel: 'both',
  },
  {
    id: 5,
    title: '坐标与函数',
    subtitle: '模块五',
    description: '坐标系——数形结合的桥梁。一次函数——线性变化的数学模型。待定系数法、交点、方案选择。第31-35讲。',
    lectureRange: [31, 35],
    color: 'purple',
    gradeLevel: 8,
  },
  {
    id: 6,
    title: '统计与数据',
    subtitle: '模块六',
    description: '数据的收集、整理、描述与分析。从统计图到平均数到方差——用数据做决策。第36-38讲。',
    lectureRange: [36, 38],
    color: 'pink',
    gradeLevel: 'both',
  },
  {
    id: 7,
    title: '综合专题复习',
    subtitle: '模块七',
    description: '知识串联与综合应用。数与式综合、代数变形、建模、几何证明、函数综合、数据决策。第39-46讲。',
    lectureRange: [39, 46],
    color: 'red',
    gradeLevel: 'both',
  },
  {
    id: 8,
    title: '测评与复盘',
    subtitle: '模块八',
    description: '七八年级综合测评与个性化错题诊断。找出知识断点，制定复习路线。第47-48讲。',
    lectureRange: [47, 48],
    color: 'gray',
    gradeLevel: 'both',
  },
]

export function getModuleById(id: number): ModuleInfo | undefined {
  return modules.find(m => m.id === id)
}

export function getModuleForLecture(lectureId: number): ModuleInfo | undefined {
  return modules.find(m => lectureId >= m.lectureRange[0] && lectureId <= m.lectureRange[1])
}
