import { useState, type ReactNode } from 'react'

type Point = [number, number]
type Tone = 'base' | 'primary' | 'accent' | 'proof' | 'muted'

interface SegmentSpec {
  a: Point
  b: Point
  tone?: Tone
  dashed?: boolean
  width?: number
}

interface LabelSpec {
  at: Point
  text: string
  tone?: Tone
  size?: number
  weight?: number
  anchor?: 'start' | 'middle' | 'end'
}

interface PointSpec {
  at: Point
  label: string
  dx?: number
  dy?: number
  tone?: Tone
}

interface Scene {
  title: string
  description: string
  motionPath?: string
  motionLabel?: string
  segments?: SegmentSpec[]
  polygons?: { points: Point[]; tone?: Tone; fill?: string; dashed?: boolean }[]
  paths?: { d: string; tone?: Tone; dashed?: boolean; fill?: string; width?: number }[]
  circles?: { at: Point; r: number; tone?: Tone; fill?: string; dashed?: boolean }[]
  labels?: LabelSpec[]
  points?: PointSpec[]
  ticks?: { a: Point; b: Point; count?: number; tone?: Tone }[]
  rightAngles?: { at: Point; x: number; y: number; tone?: Tone }[]
  extra?: ReactNode
}

const COLORS: Record<Tone, string> = {
  base: '#334155',
  primary: '#2563eb',
  accent: '#e11d48',
  proof: '#7c3aed',
  muted: '#64748b',
}

const S = (a: Point, b: Point, tone: Tone = 'base', dashed = false, width = 3): SegmentSpec => ({ a, b, tone, dashed, width })
const L = (at: Point, text: string, tone: Tone = 'base', size = 18, anchor: LabelSpec['anchor'] = 'middle', weight = 700): LabelSpec => ({ at, text, tone, size, anchor, weight })
const P = (at: Point, label: string, dx = 0, dy = -13, tone: Tone = 'base'): PointSpec => ({ at, label, dx, dy, tone })

const parallelLines = (angle = '50°', marked = true): Scene => ({
  title: marked ? '平行线与截线' : '由角相等判定平行',
  description: marked ? '两条蓝色直线平行，橙色直线为截线。' : '先由标出的等角判断两条直线是否平行。',
  segments: [S([80, 80], [520, 80], 'primary'), S([80, 230], [520, 230], 'primary'), S([210, 25], [390, 285], 'accent')],
  points: [P([248, 80], 'E', -12, -13), P([352, 230], 'F', 13, 22)],
  labels: [L([105, 61], 'A'), L([498, 61], 'B'), L([105, 253], 'C'), L([498, 253], 'D'), L([285, 112], angle, 'accent', 18), L([318, 211], angle, 'accent', 18), ...(marked ? [L([450, 72], '∥', 'primary', 22), L([450, 222], '∥', 'primary', 22)] : [])],
})

const isoscelesMedian = (showTarget = false): Scene => ({
  title: '等腰三角形与中线',
  description: '红色刻痕表示已知等边，蓝色刻痕表示D为底边中点。',
  segments: [S([300, 35], [115, 245], 'primary'), S([300, 35], [485, 245], 'primary'), S([115, 245], [485, 245], 'base'), S([300, 35], [300, 245], 'proof', true)],
  points: [P([300, 35], 'A', 0, -14), P([115, 245], 'B', -15, 18), P([485, 245], 'C', 15, 18), P([300, 245], 'D', 0, 24)],
  ticks: [{ a: [300, 35], b: [115, 245], tone: 'accent' }, { a: [300, 35], b: [485, 245], tone: 'accent' }, { a: [115, 245], b: [300, 245], count: 2, tone: 'primary' }, { a: [300, 245], b: [485, 245], count: 2, tone: 'primary' }],
  rightAngles: showTarget ? [{ at: [300, 245], x: 1, y: -1, tone: 'proof' }] : [],
})

const twoTriangles = (mode: 'sss' | 'add-condition' | 'choice' = 'sss'): Scene => ({
  title: mode === 'add-condition' ? '补全全等条件' : mode === 'choice' ? '辨认全等条件' : 'SSS全等判定',
  description: '相同颜色和刻痕表示两三角形中的对应条件。',
  segments: [S([75, 235], [205, 45], 'primary'), S([205, 45], [260, 235], 'accent'), S([75, 235], [260, 235], 'proof'), S([350, 235], [430, 45], 'primary'), S([430, 45], [545, 235], 'accent'), S([350, 235], [545, 235], 'proof')],
  points: [P([205, 45], 'A'), P([75, 235], 'B', -12, 18), P([260, 235], 'C', 12, 18), P([430, 45], 'D'), P([350, 235], 'E', -12, 18), P([545, 235], 'F', 12, 18)],
  ticks: mode === 'sss' ? [
    { a: [75, 235], b: [205, 45], tone: 'primary' }, { a: [350, 235], b: [430, 45], tone: 'primary' },
    { a: [205, 45], b: [260, 235], count: 2, tone: 'accent' }, { a: [430, 45], b: [545, 235], count: 2, tone: 'accent' },
    { a: [75, 235], b: [260, 235], count: 3, tone: 'proof' }, { a: [350, 235], b: [545, 235], count: 3, tone: 'proof' },
  ] : [{ a: [75, 235], b: [205, 45], tone: 'primary' }, { a: [350, 235], b: [430, 45], tone: 'primary' }],
  labels: mode !== 'sss' ? [L([125, 185], '已知边', 'primary', 15), L([385, 184], '对应边', 'primary', 15), L([300, 292], mode === 'add-condition' ? '还需补哪一组条件？' : '先检查角是否为夹角', 'accent', 16)] : [],
})

const reflectionLine = (detailed = false): Scene => ({
  title: '反射法：把折线展成直线',
  description: '紫色虚线表示A关于河岸l的对称位置A′，橙色路线在P处取得最短值。',
  motionPath: 'M 110 75 L 270 200 L 495 55',
  motionLabel: '演示沿最短路线移动',
  segments: [S([55, 200], [550, 200], 'primary'), S([110, 75], [270, 200], 'accent'), S([270, 200], [495, 55], 'accent'), S([110, 75], [110, 275], 'proof', true), S([110, 275], [495, 55], 'proof', true)],
  points: [P([110, 75], 'A', -12, -14), P([495, 55], 'B', 12, -14), P([270, 200], 'P', 0, 23), P([110, 275], 'A′', -15, 20, 'proof')],
  labels: [L([525, 190], '河岸 l', 'primary', 16), ...(detailed ? [L([90, 137], '3 km', 'accent', 15), L([502, 128], '5 km', 'accent', 15), L([300, 45], '投影距离 8 km', 'muted', 15)] : [])],
})

const doubleReflection = (): Scene => ({
  title: '角内最短周长：两次对称',
  description: 'P分别关于OA、OB对称到P₁、P₂，紫色直线把三段周长展平。',
  motionPath: 'M 300 115 L 145 148 L 455 148 L 300 115',
  motionLabel: '演示周长路径',
  segments: [S([300, 260], [65, 90], 'primary'), S([300, 260], [535, 90], 'primary'), S([300, 260], [300, 115], 'muted'), S([300, 115], [145, 148], 'accent'), S([145, 148], [455, 148], 'accent'), S([455, 148], [300, 115], 'accent'), S([85, 225], [515, 225], 'proof', true)],
  points: [P([300, 260], 'O', 0, 23), P([300, 115], 'P', 0, -14), P([145, 148], 'M', -12, -12), P([455, 148], 'N', 12, -12), P([85, 225], 'P₁', -15, 20, 'proof'), P([515, 225], 'P₂', 15, 20, 'proof')],
  labels: [L([132, 84], 'OA', 'primary', 16), L([470, 84], 'OB', 'primary', 16), L([300, 285], '60°', 'accent', 17)],
})

const rectangleFold = (): Scene => ({
  title: '长方形折叠',
  description: '紫色虚线AE是折痕，D折到F；同色线段表示折叠前后的对应关系。',
  motionPath: 'M 120 255 Q 250 105 480 188',
  motionLabel: '演示D折到F',
  segments: [S([120, 55], [480, 55], 'base'), S([480, 55], [480, 255], 'base'), S([480, 255], [120, 255], 'base'), S([120, 255], [120, 55], 'base'), S([120, 55], [355, 255], 'proof', true), S([120, 55], [480, 188], 'accent'), S([355, 255], [480, 188], 'accent')],
  points: [P([120, 55], 'A', -14, -12), P([480, 55], 'B', 14, -12), P([480, 255], 'C', 14, 20), P([120, 255], 'D', -14, 20), P([355, 255], 'E', 0, 23), P([480, 188], 'F', 16, 5)],
  ticks: [{ a: [120, 55], b: [120, 255], tone: 'accent' }, { a: [120, 55], b: [480, 188], tone: 'accent' }, { a: [120, 255], b: [355, 255], count: 2, tone: 'primary' }, { a: [355, 255], b: [480, 188], count: 2, tone: 'primary' }],
  rightAngles: [{ at: [480, 55], x: -1, y: 1, tone: 'base' }, { at: [480, 255], x: -1, y: -1, tone: 'base' }],
})

function sceneFor(key: string): Scene | null {
  switch (key) {
    case '19-1': return {
      title: '正方体展开图', description: '六个正方形组成展开图；同色面折回后互为相对面。',
      polygons: [
        { points: [[210, 30], [290, 30], [290, 110], [210, 110]], fill: '#dbeafe', tone: 'primary' },
        { points: [[50, 110], [130, 110], [130, 190], [50, 190]], fill: '#f8fafc' },
        { points: [[130, 110], [210, 110], [210, 190], [130, 190]], fill: '#ffe4e6', tone: 'accent' },
        { points: [[210, 110], [290, 110], [290, 190], [210, 190]], fill: '#f8fafc' },
        { points: [[290, 110], [370, 110], [370, 190], [290, 190]], fill: '#ffe4e6', tone: 'accent' },
        { points: [[210, 190], [290, 190], [290, 270], [210, 270]], fill: '#dbeafe', tone: 'primary' },
      ], labels: [L([250, 72], '1', 'primary'), L([90, 152], '2'), L([170, 152], '3', 'accent'), L([250, 152], '4'), L([330, 152], '5', 'accent'), L([250, 232], '6', 'primary')],
    }
    case '19-2': return {
      title: '线段和中点关系', description: '橙色表示AC，蓝色表示CB；M是AC的中点。',
      segments: [S([70, 165], [350, 165], 'accent', false, 6), S([350, 165], [525, 165], 'primary', false, 6)],
      points: [P([70, 165], 'A', 0, 27), P([210, 165], 'M', 0, -18), P([350, 165], 'C', 0, 27), P([525, 165], 'B', 0, 27)],
      ticks: [{ a: [70, 165], b: [210, 165], tone: 'accent' }, { a: [210, 165], b: [350, 165], tone: 'accent' }], labels: [L([210, 130], 'AC = 6', 'accent', 16), L([438, 130], 'CB = 4', 'primary', 16)],
    }
    case '19-3': return {
      title: '钟面上的角', description: '3:00时分针指向12，时针指向3，形成直角。',
      circles: [{ at: [300, 155], r: 120, tone: 'primary', fill: '#eff6ff' }],
      segments: [S([300, 155], [300, 55], 'accent', false, 6), S([300, 155], [400, 155], 'primary', false, 6)],
      points: [P([300, 155], 'O', -14, 18)], rightAngles: [{ at: [300, 155], x: 1, y: -1, tone: 'proof' }], labels: [L([300, 48], '12'), L([420, 160], '3'), L([300, 287], '6'), L([180, 160], '9'), L([365, 105], '90°', 'accent')],
    }
    case '19-4': return {
      title: '角平分线的连续使用', description: '蓝色OC平分∠AOB，紫色OD再平分∠COB。',
      segments: [S([100, 250], [530, 250], 'base'), S([100, 250], [390, 45], 'base'), S([100, 250], [470, 105], 'primary', false, 5), S([100, 250], [510, 170], 'proof', false, 5)],
      points: [P([100, 250], 'O', -15, 20), P([390, 45], 'A'), P([530, 250], 'B', 15, 18), P([470, 105], 'C', 14, -8), P([510, 170], 'D', 15, 0)],
      labels: [L([255, 150], '40°', 'primary'), L([410, 185], '20°', 'proof'), L([280, 270], '∠AOB = 80°', 'accent', 16)],
    }
    case '19-6': return {
      title: '同角的余角', description: '左右两图都由同一个∠A补成90°，比较剩余的∠1与∠2。',
      segments: [S([70, 245], [265, 245], 'base'), S([70, 245], [70, 50], 'base'), S([70, 245], [205, 105], 'accent'), S([335, 245], [530, 245], 'base'), S([335, 245], [335, 50], 'base'), S([335, 245], [470, 105], 'accent')],
      rightAngles: [{ at: [70, 245], x: 1, y: -1 }, { at: [335, 245], x: 1, y: -1 }],
      labels: [L([115, 170], '∠1', 'primary'), L([180, 218], '∠A', 'accent'), L([380, 170], '∠2', 'primary'), L([445, 218], '∠A', 'accent')],
    }
    case '20-1': return {
      title: '相交线中的四个角', description: '蓝色与橙色直线交于O，对顶角成对相等，邻补角和为180°。',
      segments: [S([70, 245], [530, 65], 'primary', false, 5), S([75, 55], [525, 255], 'accent', false, 5)],
      points: [P([75, 55], 'A', -12, -10), P([525, 255], 'B', 13, 18), P([530, 65], 'C', 13, -10), P([70, 245], 'D', -13, 18), P([300, 155], 'O', 0, 23)],
      labels: [L([300, 95], '72°', 'accent'), L([300, 220], '对顶角', 'primary', 15)],
    }
    case '20-2': return parallelLines('58°', true)
    case '20-3': return {
      title: '垂线段最短', description: 'PO是点P到直线l的垂线段；PQ是任意斜线段。',
      segments: [S([70, 240], [535, 240], 'primary'), S([260, 55], [260, 240], 'accent', false, 6), S([260, 55], [455, 240], 'base')],
      points: [P([260, 55], 'P'), P([260, 240], 'O', 0, 24), P([455, 240], 'Q', 0, 24)], rightAngles: [{ at: [260, 240], x: 1, y: -1, tone: 'accent' }], labels: [L([505, 225], 'l', 'primary'), L([235, 145], '3 cm', 'accent', 16)],
    }
    case '20-4': return {
      title: '平行线、垂线与角平分线', description: 'AB∥CD；橙色EF同时垂直两条平行线，紫色EG为角平分线。',
      segments: [S([60, 70], [540, 70], 'primary'), S([60, 245], [540, 245], 'primary'), S([250, 25], [250, 285], 'accent', false, 5), S([250, 70], [390, 205], 'proof', false, 5)],
      points: [P([250, 70], 'E', -14, -12), P([250, 245], 'F', -14, 22), P([390, 205], 'G', 15, 4)], rightAngles: [{ at: [250, 70], x: 1, y: 1, tone: 'accent' }, { at: [250, 245], x: 1, y: -1, tone: 'accent' }], labels: [L([90, 55], 'A'), L([510, 55], 'B'), L([90, 268], 'C'), L([510, 268], 'D'), L([330, 120], '角平分线', 'proof', 15)],
    }
    case '21-1': return parallelLines('65°', false)
    case '21-2': return parallelLines('50°', true)
    case '21-3': return {
      title: '由平行传角，再判定平行', description: 'AB∥CD提供一组角关系；红色等角用于继续判定BE∥CF。',
      segments: [S([70, 65], [530, 65], 'primary'), S([70, 245], [530, 245], 'primary'), S([170, 65], [330, 245], 'accent'), S([310, 65], [470, 245], 'proof')],
      points: [P([170, 65], 'B'), P([330, 245], 'E', 0, 22), P([310, 65], 'C'), P([470, 245], 'F', 0, 22)], labels: [L([100, 50], 'A'), L([500, 260], 'D'), L([248, 120], '∠1', 'accent'), L([385, 188], '∠2', 'proof'), L([450, 57], '∥', 'primary', 22), L([450, 237], '∥', 'primary', 22)],
    }
    case '21-4': return {
      title: '等角传递与平行线判定', description: '先由∠1=∠2、∠2=∠3得到∠1=∠3，再看它们的位置关系。',
      segments: [S([65, 75], [535, 75], 'primary'), S([65, 235], [535, 235], 'primary'), S([180, 30], [400, 280], 'accent')],
      labels: [L([235, 102], '∠1', 'accent'), L([295, 155], '∠2', 'proof'), L([350, 216], '∠3', 'accent'), L([85, 58], 'a', 'primary'), L([85, 258], 'b', 'primary')],
    }
    case '22-2': return {
      title: '坐标网格中的平移', description: '蓝色是原三角形，橙色是向右4格、向上2格后的图形；箭头表示同一平移向量。', motionPath: 'M 160 210 L 340 160', motionLabel: '演示对应点平移',
      extra: <CoordinateTranslation />,
    }
    case '22-3': return {
      title: '线段平移形成平行四边形', description: 'AB平移到CD；橙色箭头AC与BD同向且等长。',
      segments: [S([110, 85], [340, 85], 'primary', false, 6), S([245, 230], [475, 230], 'primary', false, 6), S([110, 85], [245, 230], 'accent'), S([340, 85], [475, 230], 'accent')],
      points: [P([110, 85], 'A'), P([340, 85], 'B'), P([245, 230], 'C', 0, 23), P([475, 230], 'D', 0, 23)], labels: [L([175, 165], '8', 'accent'), L([405, 165], '8', 'accent'), L([225, 67], '6', 'primary'), L([360, 213], '6', 'primary')],
    }
    case '22-4': return {
      title: '用向量描述平移', description: 'A→A′与B→B′使用完全相同的水平、竖直位移。', extra: <TranslationVector />,
    }
    case '23-1': return {
      title: '三角形三边关系', description: '把较短两段首尾相接；只有两段之和大于第三段时才能围成三角形。',
      segments: [S([95, 230], [270, 55], 'primary', false, 6), S([270, 55], [500, 230], 'accent', false, 6), S([95, 230], [500, 230], 'proof', false, 6)], labels: [L([160, 135], '5'), L([385, 130], '6', 'accent'), L([300, 260], '10', 'proof')],
    }
    case '23-2': return {
      title: '三角形外角', description: 'BC延长到D，红色∠ACD是与内角C相邻的外角。',
      segments: [S([105, 235], [480, 235], 'base'), S([105, 235], [280, 50], 'primary'), S([280, 50], [360, 235], 'primary'), S([360, 235], [525, 235], 'accent', false, 6)],
      points: [P([280, 50], 'A'), P([105, 235], 'B', -12, 20), P([360, 235], 'C', 0, 22), P([525, 235], 'D', 12, 20)], labels: [L([215, 105], '50°', 'primary'), L([145, 218], '60°', 'primary'), L([415, 205], '外角', 'accent', 17)],
    }
    case '23-3': return {
      title: '正多边形的内角', description: '所有内角相等；由单个内角反推外角，再由360°÷外角求边数。', extra: <RegularPolygon />,
    }
    case '23-4': return {
      title: '中线与重心', description: 'AD、BE是中线，交点G为重心；同色刻痕表示对应边被平分。',
      segments: [S([300, 35], [90, 250], 'primary'), S([300, 35], [510, 250], 'primary'), S([90, 250], [510, 250], 'base'), S([300, 35], [300, 250], 'accent'), S([90, 250], [405, 142], 'proof')],
      points: [P([300, 35], 'A'), P([90, 250], 'B', -12, 18), P([510, 250], 'C', 12, 18), P([300, 250], 'D', 0, 22), P([405, 142], 'E', 14, 0), P([300, 178], 'G', -16, 4)], ticks: [{ a: [90, 250], b: [300, 250], tone: 'accent' }, { a: [300, 250], b: [510, 250], tone: 'accent' }, { a: [300, 35], b: [405, 142], count: 2, tone: 'proof' }, { a: [405, 142], b: [510, 250], count: 2, tone: 'proof' }],
    }
    case '24-1': return twoTriangles('sss')
    case '24-2': return isoscelesMedian(false)
    case '24-3': return twoTriangles('choice')
    case '24-4': return twoTriangles('add-condition')
    case '25-1': return {
      title: '中点与旋转式全等', description: 'C是AB中点；CD=CE且红色两角相等。',
      segments: [S([70, 165], [530, 165], 'base'), S([300, 165], [145, 55], 'primary'), S([300, 165], [455, 55], 'primary'), S([70, 165], [145, 55], 'accent'), S([530, 165], [455, 55], 'accent')],
      points: [P([70, 165], 'A', -10, 22), P([300, 165], 'C', 0, 23), P([530, 165], 'B', 10, 22), P([145, 55], 'D'), P([455, 55], 'E')], ticks: [{ a: [70, 165], b: [300, 165], tone: 'accent' }, { a: [300, 165], b: [530, 165], tone: 'accent' }, { a: [300, 165], b: [145, 55], count: 2, tone: 'primary' }, { a: [300, 165], b: [455, 55], count: 2, tone: 'primary' }], labels: [L([240, 126], '∠1', 'accent', 15), L([360, 126], '∠2', 'accent', 15)],
    }
    case '25-2': return {
      title: '两组等边构成的风筝形', description: 'AB=AC、BD=CD；连接AD后比较两侧三角形。',
      segments: [S([300, 35], [100, 155], 'primary'), S([300, 35], [500, 155], 'primary'), S([100, 155], [300, 275], 'accent'), S([500, 155], [300, 275], 'accent'), S([300, 35], [300, 275], 'proof')],
      points: [P([300, 35], 'A'), P([100, 155], 'B', -15, 4), P([500, 155], 'C', 15, 4), P([300, 275], 'D', 0, 22)], ticks: [{ a: [300, 35], b: [100, 155], tone: 'primary' }, { a: [300, 35], b: [500, 155], tone: 'primary' }, { a: [100, 155], b: [300, 275], count: 2, tone: 'accent' }, { a: [500, 155], b: [300, 275], count: 2, tone: 'accent' }],
    }
    case '25-3': return isoscelesMedian(false)
    case '25-4': return {
      title: '中点与平行线构造全等', description: 'AB∥CD，E是AD中点；橙色BE延长到F。',
      segments: [S([200, 55], [430, 55], 'primary'), S([70, 250], [520, 250], 'primary'), S([200, 55], [300, 250], 'base'), S([430, 55], [70, 250], 'accent', false, 5)],
      points: [P([200, 55], 'A'), P([430, 55], 'B'), P([520, 250], 'C', 12, 20), P([300, 250], 'D', 0, 22), P([250, 152], 'E', -15, 2), P([70, 250], 'F', -12, 20)], ticks: [{ a: [200, 55], b: [250, 152], tone: 'proof' }, { a: [250, 152], b: [300, 250], tone: 'proof' }], labels: [L([395, 47], '∥', 'primary', 22), L([475, 242], '∥', 'primary', 22)],
    }
    case '26-1': return {
      title: '角平分线上的点到两边等距', description: 'OC为角平分线；PD、PE是到角两边的垂线段。',
      segments: [S([300, 260], [70, 70], 'primary'), S([300, 260], [530, 70], 'primary'), S([300, 260], [300, 85], 'proof', false, 5), S([300, 115], [229, 201], 'accent'), S([300, 115], [371, 201], 'accent')],
      points: [P([300, 260], 'O', 0, 22), P([70, 70], 'A'), P([530, 70], 'B'), P([300, 85], 'C'), P([300, 115], 'P', 0, -15), P([229, 201], 'D', -15, 5), P([371, 201], 'E', 15, 5)], ticks: [{ a: [300, 115], b: [229, 201], tone: 'accent' }, { a: [300, 115], b: [371, 201], tone: 'accent' }], labels: [L([235, 177], '90°', 'accent', 13), L([365, 177], '90°', 'accent', 13)],
    }
    case '26-2': return isoscelesMedian(false)
    case '26-3': return {
      title: '尺规作角平分线', description: '蓝色圆弧截得C、D；以C、D为圆心的等半径弧交于P，连接OP。',
      segments: [S([90, 245], [500, 245], 'primary'), S([90, 245], [400, 45], 'primary'), S([90, 245], [355, 145], 'proof', true, 5)],
      paths: [{ d: 'M 210 245 A 120 120 0 0 0 191 180', tone: 'accent', dashed: true }, { d: 'M 230 210 A 135 135 0 0 1 355 145', tone: 'proof', dashed: true }, { d: 'M 280 125 A 135 135 0 0 0 355 145', tone: 'proof', dashed: true }],
      points: [P([90, 245], 'O', -14, 20), P([210, 245], 'C', 0, 22), P([191, 180], 'D', -15, -4), P([355, 145], 'P', 15, -5)],
    }
    case '26-4': return {
      title: '角平分线与垂直平分线', description: 'AD平分∠A；紫色DE垂直平分AB，E是AB中点。',
      segments: [S([300, 35], [85, 245], 'primary'), S([300, 35], [515, 245], 'primary'), S([85, 245], [515, 245], 'base'), S([300, 35], [295, 245], 'accent'), S([192, 140], [295, 245], 'proof', true)],
      points: [P([300, 35], 'A'), P([85, 245], 'B', -12, 19), P([515, 245], 'C', 12, 19), P([295, 245], 'D', 0, 22), P([192, 140], 'E', -15, 0)], ticks: [{ a: [300, 35], b: [192, 140], tone: 'proof' }, { a: [192, 140], b: [85, 245], tone: 'proof' }], labels: [L([215, 158], '⊥', 'proof', 18)],
    }
    case '27-1': return {
      title: '等腰三角形中的高', description: 'AB=AC；从B向AC作高BD，红色直角标记是关键。',
      segments: [S([300, 35], [100, 245], 'primary'), S([300, 35], [510, 245], 'primary'), S([100, 245], [510, 245], 'base'), S([100, 245], [310, 45], 'accent')],
      points: [P([300, 35], 'A', -14, -11), P([100, 245], 'B', -12, 20), P([510, 245], 'C', 12, 20), P([310, 45], 'D', 16, -3)], ticks: [{ a: [300, 35], b: [100, 245], tone: 'primary' }, { a: [300, 35], b: [510, 245], tone: 'primary' }], labels: [L([300, 82], '40°', 'accent', 17), L([337, 63], '90°', 'accent', 13)],
    }
    case '27-2': return isoscelesMedian(false)
    case '27-3': return {
      title: '两个底角的角平分线', description: 'BD、CE分别平分∠B、∠C，在小三角形DBC中比较底角。',
      segments: [S([300, 35], [80, 250], 'primary'), S([300, 35], [520, 250], 'primary'), S([80, 250], [520, 250], 'base'), S([80, 250], [405, 138], 'accent'), S([520, 250], [195, 138], 'proof')],
      points: [P([300, 35], 'A'), P([80, 250], 'B', -12, 20), P([520, 250], 'C', 12, 20), P([405, 138], 'D', 15, 0), P([195, 138], 'E', -15, 0)], labels: [L([135, 218], '½∠B', 'accent', 15), L([465, 218], '½∠C', 'proof', 15)],
    }
    case '27-4': return {
      title: '等边三角形的中位线', description: 'D、E是两边中点；DE连接两个中点。',
      segments: [S([300, 35], [85, 250], 'primary'), S([300, 35], [515, 250], 'primary'), S([85, 250], [515, 250], 'primary'), S([193, 143], [408, 143], 'accent', false, 5)],
      points: [P([300, 35], 'A'), P([85, 250], 'B', -12, 20), P([515, 250], 'C', 12, 20), P([193, 143], 'D', -12, -8), P([408, 143], 'E', 12, -8)], ticks: [{ a: [300, 35], b: [193, 143], tone: 'proof' }, { a: [193, 143], b: [85, 250], tone: 'proof' }, { a: [300, 35], b: [408, 143], count: 2, tone: 'accent' }, { a: [408, 143], b: [515, 250], count: 2, tone: 'accent' }], labels: [L([300, 270], '60°  ·  60°  ·  60°', 'primary', 16)],
    }
    case '28-1': return reflectionLine(false)
    case '28-2': return doubleReflection()
    case '28-3': return {
      title: '距离差最大：反向三角不等式', description: '把A、B与直线l上的P连接；紫色虚线帮助比较|PA-PB|与AB。',
      segments: [S([55, 245], [545, 245], 'primary'), S([155, 70], [410, 100], 'accent', false, 6), S([155, 70], [300, 245], 'base'), S([410, 100], [300, 245], 'proof')], points: [P([155, 70], 'A'), P([410, 100], 'B'), P([300, 245], 'P', 0, 22)], labels: [L([515, 230], 'l', 'primary'), L([285, 65], 'AB', 'accent', 15)],
    }
    case '28-4': return { title: '长方体表面最短路径', description: '紫色虚线表示把相邻表面展开后，蚂蚁路径变成平面直线。', motionPath: 'M 140 205 L 500 145', motionLabel: '演示蚂蚁最短路径', extra: <CuboidPath /> }
    case '29-1': return {
      title: '勾股定理基本图', description: '红色直角先确认适用条件；两条直角边为6和8，斜边AB待求。',
      segments: [S([105, 245], [105, 65], 'primary', false, 6), S([105, 245], [505, 245], 'accent', false, 6), S([105, 65], [505, 245], 'proof', false, 6)],
      points: [P([105, 65], 'A', -13, -10), P([505, 245], 'B', 13, 20), P([105, 245], 'C', -13, 20)], rightAngles: [{ at: [105, 245], x: 1, y: -1, tone: 'accent' }], labels: [L([78, 155], '6', 'primary'), L([300, 270], '8', 'accent'), L([325, 135], 'AB = ?', 'proof', 17)],
    }
    case '29-2': return {
      title: '勾股逆定理', description: '把最长边15放在对面，比较9²+12²与15²。',
      segments: [S([100, 245], [100, 75], 'primary', false, 6), S([100, 245], [505, 245], 'accent', false, 6), S([100, 75], [505, 245], 'proof', false, 6)], rightAngles: [{ at: [100, 245], x: 1, y: -1, tone: 'muted' }], labels: [L([72, 160], '9', 'primary'), L([300, 270], '12', 'accent'), L([330, 130], '15', 'proof')],
    }
    case '29-3': return { title: '网格中的勾股定理', description: '蓝色、橙色直角边分别跨3格、4格；紫色AC是斜边。', extra: <GridTriangle /> }
    case '29-4': return { title: '梯子滑动模型', description: '同一根梯子长度不变；实线为原位置，虚线为梯脚外移2米后的位置。', motionPath: 'M 365 275 L 455 275', motionLabel: '演示梯脚外移', extra: <Ladder /> }
    case '30-1': return {
      title: '对角线互相平分', description: 'OA=OC、OB=OD；两条对角线在O处互相平分。',
      segments: [S([160, 55], [500, 105], 'primary'), S([500, 105], [430, 260], 'primary'), S([430, 260], [90, 210], 'primary'), S([90, 210], [160, 55], 'primary'), S([160, 55], [430, 260], 'accent'), S([90, 210], [500, 105], 'proof')],
      points: [P([160, 55], 'A'), P([500, 105], 'B', 14, -5), P([430, 260], 'C', 12, 20), P([90, 210], 'D', -14, 10), P([295, 158], 'O', 0, 22)], ticks: [{ a: [160, 55], b: [295, 158], tone: 'accent' }, { a: [295, 158], b: [430, 260], tone: 'accent' }, { a: [90, 210], b: [295, 158], count: 2, tone: 'proof' }, { a: [295, 158], b: [500, 105], count: 2, tone: 'proof' }],
    }
    case '30-2': return {
      title: '平行四边形的等长对角线', description: '蓝色是平行四边形，红色AC与紫色BD相等是矩形判定的关键。',
      segments: [S([155, 55], [505, 55], 'primary'), S([505, 55], [430, 250], 'primary'), S([430, 250], [80, 250], 'primary'), S([80, 250], [155, 55], 'primary'), S([155, 55], [430, 250], 'accent', false, 5), S([505, 55], [80, 250], 'proof', false, 5)], points: [P([155, 55], 'A'), P([505, 55], 'B'), P([430, 250], 'C', 0, 22), P([80, 250], 'D', 0, 22)], ticks: [{ a: [155, 55], b: [430, 250], tone: 'accent' }, { a: [505, 55], b: [80, 250], tone: 'proof' }],
    }
    case '30-3': return {
      title: '正方形的对角线', description: '两条对角线相等、垂直且互相平分。',
      segments: [S([195, 45], [405, 45], 'primary'), S([405, 45], [405, 255], 'primary'), S([405, 255], [195, 255], 'primary'), S([195, 255], [195, 45], 'primary'), S([195, 45], [405, 255], 'accent'), S([405, 45], [195, 255], 'proof')], points: [P([195, 45], 'A'), P([405, 45], 'B'), P([405, 255], 'C', 0, 22), P([195, 255], 'D', 0, 22), P([300, 150], 'O', 0, 22)], labels: [L([300, 28], '4', 'primary'), L([326, 150], '⊥', 'accent', 20)],
    }
    case '30-4': return {
      title: '四边中点组成的四边形', description: 'E、F、G、H分别是四边中点；橙色四边形EFGH是研究目标。',
      segments: [S([165, 45], [500, 100], 'base'), S([500, 100], [405, 270], 'base'), S([405, 270], [75, 215], 'base'), S([75, 215], [165, 45], 'base'), S([333, 73], [453, 185], 'accent', false, 5), S([453, 185], [240, 243], 'accent', false, 5), S([240, 243], [120, 130], 'accent', false, 5), S([120, 130], [333, 73], 'accent', false, 5)], points: [P([165, 45], 'A'), P([500, 100], 'B', 13, -5), P([405, 270], 'C', 10, 20), P([75, 215], 'D', -13, 10), P([333, 73], 'E'), P([453, 185], 'F', 15, 4), P([240, 243], 'G', 0, 22), P([120, 130], 'H', -15, 0)],
    }
    case '31-1': return { title: '坐标平面中的点与象限', description: '先看横坐标决定左右，再看纵坐标决定上下；轴上的点不属于任何象限。', extra: <CoordinateLessonPlot variant="quadrants" /> }
    case '31-2': return { title: '点到坐标轴和原点的距离', description: '横、纵虚线分别表示到y轴和x轴的距离；到原点的距离构成直角三角形。', extra: <CoordinateLessonPlot variant="distances" /> }
    case '31-3': return { title: '坐标系中的三种对称', description: '同色虚线连接原点P与它关于x轴、y轴、原点的对称点。', extra: <CoordinateLessonPlot variant="symmetry" /> }
    case '32-1': return { title: '点的连续平移', description: '先水平移动，再竖直移动；坐标变化顺序与路径箭头一致。', motionPath: 'M 165 70 L 390 70 L 390 205', motionLabel: '演示先横后竖', extra: <CoordinateLessonPlot variant="point-translation" /> }
    case '32-2': return { title: '三角形整体平移', description: '每个顶点沿同一个方向移动相同距离，形状和面积保持不变。', motionPath: 'M 160 210 L 340 160', motionLabel: '演示对应点平移', extra: <CoordinateTranslation /> }
    case '32-3': return { title: '坐标三角形的割补法', description: '先用虚线包围成矩形，再减去周围三个直角三角形。', extra: <CoordinateLessonPlot variant="area" /> }
    case '33-1': return { title: '函数的“输入—唯一输出”', description: '每个输入x只能沿一条箭头到达一个输出y；同一个x连向两个y就不是函数。', extra: <FunctionMapping /> }
    case '33-2': return { title: '自变量取值范围', description: '分母不能为0、偶次根号内不能为负；数轴上排除不允许的点或区间。', extra: <DomainRestrictions /> }
    case '33-3': return { title: '列表描点画y=x²', description: '先列表得到成对坐标，再描点并用平滑曲线连接；图像关于y轴对称。', motionPath: 'M 120 20 Q 300 300 480 20', motionLabel: '演示点随x变化', extra: <FunctionPlot variant="parabola" /> }
    case '34-1': return { title: '两点法画一次函数', description: '取两个容易计算的点，描点后用直线连接并向两端延长。', motionPath: 'M 120 20 L 480 300', motionLabel: '演示点沿直线变化', extra: <FunctionPlot variant="decreasing" /> }
    case '34-2': return { title: '由图像经过的象限判断k、b', description: '直线从左上向右下降说明k<0，与y轴交在负半轴说明b<0。', extra: <FunctionPlot variant="negative-intercept" /> }
    case '34-3': return { title: '用图像比较函数值', description: 'k<0时直线从左上向右下；x越大，对应点越低，y越小。', extra: <FunctionPlot variant="compare" /> }
    case '34-4': return { title: '直线与坐标轴围成的三角形', description: '先求直线与x轴、y轴的截距，再把两段截距看作直角三角形的底和高。', extra: <FunctionPlot variant="intercept-triangle" /> }
    case '35-1': return { title: '两点确定一次函数', description: 'A、B两点确定唯一一条直线；把坐标代入y=kx+b求k、b。', extra: <FunctionPlot variant="through-points" /> }
    case '35-2': return { title: '两条直线的交点', description: '交点P同时在两条直线上，因此它的坐标就是对应方程组的解。', motionPath: 'M 120 300 L 480 20', motionLabel: '演示x变化时交会位置', extra: <FunctionPlot variant="intersection" /> }
    case '35-3': return { title: '套餐费用图像与分界点', description: '两条费用直线的交点表示费用相同；交点两侧比较哪条直线更低。', motionPath: 'M 120 260 L 480 50', motionLabel: '演示用量变化', extra: <FunctionPlot variant="plans" /> }
    case '42-1': return {
      title: '“之”字形中的平行线角关系', description: 'AB∥CD；过E作紫色辅助线，与两条已知平行线平行。',
      segments: [S([65, 60], [535, 60], 'primary'), S([65, 250], [535, 250], 'primary'), S([155, 60], [320, 155], 'accent', false, 5), S([320, 155], [455, 250], 'accent', false, 5), S([120, 155], [500, 155], 'proof', true)],
      points: [P([155, 60], 'B'), P([455, 250], 'D', 0, 22), P([320, 155], 'E', 15, 2)], labels: [L([95, 47], 'A'), L([505, 263], 'C'), L([205, 105], '50°', 'accent'), L([410, 205], '40°', 'accent'), L([470, 145], '辅助线', 'proof', 14), L([480, 52], '∥', 'primary', 22), L([480, 242], '∥', 'primary', 22)],
    }
    case '42-2': return { title: '五边形内角与角平分线', description: '先用五边形内角和分配各角，再把∠B平均分成两部分。', extra: <PentagonBisector /> }
    case '42-3': return {
      title: '长方形沿对角线折叠', description: 'AC是折痕，B折到E；橙色AE是AB的对应位置。',
      segments: [S([120, 55], [480, 55], 'base'), S([480, 55], [480, 250], 'base'), S([480, 250], [120, 250], 'base'), S([120, 250], [120, 55], 'base'), S([120, 55], [480, 250], 'proof', true, 5), S([120, 55], [345, 205], 'accent', false, 5), S([345, 205], [480, 250], 'accent')],
      points: [P([120, 55], 'A', -13, -10), P([480, 55], 'B', 13, -10), P([480, 250], 'C', 13, 20), P([120, 250], 'D', -13, 20), P([345, 205], 'E', -15, 2), P([405, 250], 'F', 0, 22)], labels: [L([270, 117], '折痕 AC', 'proof', 15)],
    }
    case '43-1': return {
      title: '共线点中的SSS全等', description: 'B、E、C、F依次共线；相同颜色和刻痕表示对应边相等。',
      segments: [S([55, 235], [545, 235], 'base'), S([80, 235], [175, 55], 'primary'), S([175, 55], [350, 235], 'accent'), S([255, 235], [420, 55], 'primary'), S([420, 55], [525, 235], 'accent')],
      points: [P([80, 235], 'B', 0, 22), P([255, 235], 'E', 0, 22), P([350, 235], 'C', 0, 22), P([525, 235], 'F', 0, 22), P([175, 55], 'A'), P([420, 55], 'D')], ticks: [{ a: [80, 235], b: [175, 55], tone: 'primary' }, { a: [255, 235], b: [420, 55], tone: 'primary' }, { a: [175, 55], b: [350, 235], count: 2, tone: 'accent' }, { a: [420, 55], b: [525, 235], count: 2, tone: 'accent' }, { a: [80, 235], b: [255, 235], count: 3, tone: 'proof' }, { a: [350, 235], b: [525, 235], count: 3, tone: 'proof' }],
    }
    case '43-2': return {
      title: '倍长中线构造', description: 'AD是中线；延长AD到E使DE=AD，连接BE，把不等式转为三角形三边关系。',
      segments: [S([295, 35], [80, 235], 'primary'), S([295, 35], [475, 235], 'primary'), S([80, 235], [475, 235], 'base'), S([295, 35], [300, 235], 'accent'), S([300, 235], [305, 300], 'accent', true), S([80, 235], [305, 300], 'proof')],
      points: [P([295, 35], 'A'), P([80, 235], 'B', -12, 20), P([475, 235], 'C', 12, 20), P([300, 235], 'D', 0, 22), P([305, 300], 'E', 14, 8)], ticks: [{ a: [80, 235], b: [300, 235], tone: 'primary' }, { a: [300, 235], b: [475, 235], tone: 'primary' }, { a: [295, 35], b: [300, 235], count: 2, tone: 'accent' }, { a: [300, 235], b: [305, 300], count: 2, tone: 'accent' }],
    }
    case '43-3': return {
      title: '由一组平行和一组对角相等证明平行四边形', description: 'AD∥BC为蓝色已知；红色标出的对角相等，用它推出另一组对边平行。',
      segments: [S([160, 55], [500, 105], 'base'), S([500, 105], [430, 260], 'primary'), S([430, 260], [90, 210], 'base'), S([90, 210], [160, 55], 'primary')],
      points: [P([160, 55], 'A'), P([500, 105], 'B', 13, -5), P([430, 260], 'C', 12, 20), P([90, 210], 'D', -13, 10)], labels: [L([138, 95], '∠A', 'accent'), L([450, 220], '∠C', 'accent'), L([120, 160], '∥', 'primary', 21), L([465, 180], '∥', 'primary', 21)],
    }
    case '44-1': return reflectionLine(true)
    case '44-2': return doubleReflection()
    case '44-3': return rectangleFold()
    case '44-4': return { title: '坐标系中的两次反射', description: 'A关于x轴反射到A′，B关于y=4反射到B′；紫色直线依次穿过P、Q。', extra: <CoordinateDoubleReflection /> }
    default: return null
  }
}

function supportingSceneFor(lectureId: number, problem: string, context: 'example' | 'exercise' | 'oral' | 'answer'): Scene | null {
  const explicitlyReferencesFigure = problem.includes('如图') || problem.includes('下图')
  const oralNeedsVisual = context === 'oral' && /(画图|图像|拼图|统计图|知识地图)/.test(problem)
  const answerNeedsVisual = context === 'answer' && /(画|作图|描点|补全|图像|数轴|统计图|直方图|箱线图|扇形图|折线图|条形图|坐标系中表示)/.test(problem)
  const exampleNeedsVisual = context === 'example' && /(画|作图|描点|补全|图像|数轴|统计图|直方图|箱线图|扇形图|折线图|条形图)/.test(problem)
  if (!explicitlyReferencesFigure && !oralNeedsVisual && !answerNeedsVisual && !exampleNeedsVisual) return null

  const degreeValues = [...problem.matchAll(/(\d+)\s*°/g)].map(match => match[1])
  const firstAngle = degreeValues[0] ? `${degreeValues[0]}°` : '已知角'

  if (lectureId === 1) return { title: '坐标—三角形—勾股知识链', description: '先从坐标读出两条互相垂直的边，再用勾股定理求斜边。', extra: <CoordinateRightTriangle /> }
  if (lectureId === 3) return { title: '数轴上的a、b', description: 'b位于-2与-1之间，a位于0与1之间；先据位置判断符号和绝对值。', extra: <NumberLineAB /> }
  if (lectureId === 8) return { title: '正方形割补与因式分解', description: '大正方形边长a，角上切去边长b的小正方形；剩余面积可用整体相减或分块相加表示。', extra: <SquareCutout /> }
  if (lectureId === 11) return rightTriangleScene('二次根式与勾股定理', '√2', '√6')
  if (lectureId === 18 || (lectureId >= 33 && lectureId <= 35) || lectureId === 45) return functionAnswerScene(problem)
  if (lectureId >= 36 && lectureId <= 38) return statisticsAnswerScene(problem)

  if (lectureId === 19) {
    if (problem.includes('直线AB与CD') || problem.includes('直线AB和CD')) return intersectingScene(firstAngle)
    if (problem.includes('平角')) return straightAngleBisectors(firstAngle)
    if (context === 'oral' && problem.includes('向下方')) return oppositeRayAngles(degreeValues)
    return angleBisectorScene(firstAngle)
  }

  if (lectureId === 20) {
    if (problem.includes('三条直线')) return { title: '三线交于一点', description: '三条不同颜色的直线形成6个角；先找对顶角，再用平角关系。', extra: <ThreeIntersectingLines values={degreeValues} /> }
    if (problem.includes('PO⊥') || problem.includes('垂线段')) return pointToLineScene()
    if (problem.includes('三角形ABC')) return triangleParallelScene()
    if ((problem.includes('∠B') && problem.includes('∠D')) || problem.includes('∠BED')) return zigzagParallelScene(degreeValues)
    if (problem.includes('c⊥a')) return parallelPerpendicularTriangleScene()
    if (problem.includes('直线AB和CD') || problem.includes('直线AB与CD')) return intersectingScene(firstAngle)
    return parallelLines(firstAngle, true)
  }

  if (lectureId === 21) {
    if (problem.includes('△ABC') && problem.includes('△DEF')) return twoTriangles('add-condition')
    return parallelLines(firstAngle, problem.includes('∥'))
  }

  if (lectureId === 22) {
    if (problem.includes('方格纸') && problem.includes('L')) return { title: '方格中的L形平移', description: '蓝色为原图形，红色为目标位置；每个顶点使用同一个平移向量。', extra: <LShapeTranslation /> }
    if (problem.includes('直角坐标系') || problem.includes('原点')) return { title: '坐标系中的整体平移', description: '所有顶点的横、纵坐标分别作相同改变。', extra: <CoordinateTranslation /> }
    return sceneFor('22-3')
  }

  if (lectureId === 23) {
    if (problem.includes('五边形') || problem.includes('n边形')) return { title: '多边形外角', description: '沿同一方向依次取外角，转完一周的总转角为360°。', extra: <PolygonExteriorAngles /> }
    if (problem.includes('中线')) return sceneFor('23-4')
    return triangleConditionScene(problem, degreeValues)
  }

  if (lectureId === 24) {
    if (problem.includes('Rt△')) return { title: '直角三角形HL判定', description: '红色直角、同色斜边和直角边是HL判定的三项关键信息。', extra: <RightTrianglePair /> }
    if (problem.includes('同一直线上')) return sceneFor('43-1')
    if (problem.includes('D是BC的中点') || problem.includes('D在△ABC内部')) return isoscelesMedian(false)
    if (problem.includes('CE∥AB')) return sceneFor('25-4')
    return twoTriangles(problem.includes('添加') ? 'add-condition' : 'sss')
  }

  if (lectureId === 25) {
    if (problem.includes('OP平分')) return sceneFor('26-1')
    if (problem.includes('C是AB的中点')) return sceneFor('25-1')
    if (problem.includes('四边形')) return quadrilateralConditionScene(problem)
    if (problem.includes('等边三角形ADE')) return triangleConditionScene(problem, degreeValues, true)
    if (problem.includes('E是AD的中点')) return sceneFor('25-4')
    if (problem.includes('AD平分')) return isoscelesMedian(false)
    return problem.includes('△DEF') ? twoTriangles('add-condition') : triangleConditionScene(problem, degreeValues)
  }

  if (lectureId === 26) {
    if (problem.includes('垂直平分线')) return { title: '垂直平分线上的点', description: '紫色直线垂直且平分AB；线上点P到A、B距离相等。', extra: <PerpendicularBisector /> }
    if (problem.includes('AC⊥BD')) return sceneFor('30-1')
    if (problem.includes('DE⊥AB') || problem.includes('DF⊥AC')) return sceneFor('26-1')
    if (problem.includes('AB=AC')) return isoscelesMedian(false)
    return triangleConditionScene(problem, degreeValues)
  }

  if (lectureId === 27) {
    if (problem.includes('等边△')) return sceneFor('27-4')
    if (problem.includes('内部') && problem.includes('DB=DC')) return sceneFor('25-2')
    if (problem.includes('周长最小')) return doubleReflection()
    return isoscelesMedian(false)
  }

  if (lectureId === 28) {
    if (problem.includes('∠AOB')) return doubleReflection()
    if (problem.includes('x=8')) return { title: '两条约束直线上的最短路径', description: '分别关于两条动点所在直线作对称，把三段折线展成直线。', extra: <CoordinateDoubleReflection /> }
    if (problem.includes('y=x')) return { title: '关于直线y=x的反射', description: '点(a,b)关于y=x对称为(b,a)，再连接定点确定最优位置。', extra: <DiagonalReflection /> }
    return reflectionLine(problem.includes('A(0,3)'))
  }

  if (lectureId === 29) {
    if (problem.includes('梯子')) return { title: '墙—地面—梯子直角模型', description: '墙与地面垂直，梯子是斜边；先确认斜边再代入勾股定理。', extra: <Ladder /> }
    if (problem.includes('网格')) return { title: '网格中的距离', description: '横向格数和纵向格数构成直角边，连接两点得到斜边。', extra: <GridTriangle /> }
    if (problem.includes('以AB为边向外作正方形')) return { title: '斜边上的正方形', description: '先求斜边AB，再用AB²直接得到正方形面积。', extra: <SquareOnHypotenuse /> }
    if (problem.includes('AB=AC')) return { title: '等腰三角形作高', description: '底边上的高同时平分底边，把问题分成两个直角三角形。', extra: <IsoscelesHeight /> }
    return rightTriangleScene('勾股定理与三角形的高', degreeValues[0] ?? 'a', degreeValues[1] ?? 'b')
  }

  if (lectureId === 30) return problem.includes('正方形')
    ? { title: '正方形中的新正方形', description: '蓝色为原正方形，红色为以AE为边构造的新正方形，紫色DG为证明目标相关线段。', extra: <NestedSquares /> }
    : quadrilateralConditionScene(problem)

  if (lectureId === 42) {
    if (problem.includes('折叠')) return rectangleFold()
    if (problem.includes('∠BED')) return zigzagParallelScene(degreeValues)
    return parallelLines(firstAngle, true)
  }

  if (lectureId === 43) {
    if (problem.includes('DE⊥AB') && problem.includes('DF⊥AC')) return sceneFor('26-1')
    if (problem.includes('AB//CD') && problem.includes('E是BC中点')) return sceneFor('25-4')
    if (problem.includes('平行四边形ABCD')) return sceneFor('30-1')
    if (problem.includes('Rt△')) return triangleConditionScene(problem, degreeValues)
    if (problem.includes('四边形')) return quadrilateralConditionScene(problem)
    return twoTriangles('add-condition')
  }

  if (lectureId === 44) return { title: '动点最短路径', description: '先把需要经过的折线路径用对称展开，再用两点之间线段最短。', extra: <TriangleShortestPath /> }
  if (lectureId === 47) return { title: '垂足等距证明等腰三角形', description: 'D是BC中点，DE、DF分别垂直两腰且相等；从全等或角平分线判定入手。', extra: <EqualPerpendiculars /> }

  if (context === 'oral' && lectureId === 23) return triangleParallelScene()
  if (context === 'oral' && lectureId === 24) return { title: 'SSA不能唯一确定三角形', description: '固定两边和一个非夹角时，第三个顶点可能有两个位置，得到两个不同三角形。', extra: <SsaAmbiguity /> }
  if (context === 'oral' && lectureId === 29) return { title: '勾股定理面积拼图', description: '边长(a+b)的大正方形由4个直角三角形和中间边长c的小正方形组成。', extra: <PythagoreanArea /> }
  if (context === 'oral' && (lectureId === 34 || lectureId === 45)) return { title: '一次函数的斜率、截距与交点', description: 'k决定直线升降，b决定起点；两图像交点表示两个方案相等。', extra: <FunctionLines /> }
  if (context === 'oral' && lectureId === 36) return { title: '同一数据的三种图表', description: '条形图比大小、折线图看变化、扇形图看占比。', extra: <ChartComparison /> }

  return { title: '题目条件结构图', description: '图中只标出题干给出的对象和关系；请结合文字逐项核对已知条件。', extra: <GenericGeometry /> }
}

function intersectingScene(angle: string): Scene {
  return { title: '相交线中的对顶角与邻补角', description: '两条不同颜色的直线交于O；先锁定已知角，再找对顶角和邻补角。', segments: [S([70, 245], [530, 65], 'primary', false, 5), S([75, 55], [525, 255], 'accent', false, 5)], points: [P([75, 55], 'A'), P([525, 255], 'B', 12, 18), P([530, 65], 'C'), P([70, 245], 'D', -12, 18), P([300, 155], 'O', 0, 23)], labels: [L([300, 95], angle, 'accent')] }
}

function angleBisectorScene(angle: string): Scene {
  return { title: '角平分线', description: 'OC把∠AOB分成两个相等的小角；红色刻痕表示“平分”。', segments: [S([90, 250], [520, 250], 'base'), S([90, 250], [390, 45], 'base'), S([90, 250], [465, 115], 'primary', false, 5)], points: [P([90, 250], 'O', -14, 20), P([390, 45], 'A'), P([520, 250], 'B', 13, 20), P([465, 115], 'C', 14, -5)], labels: [L([280, 150], angle, 'accent'), L([395, 190], '½', 'primary')] }
}

function straightAngleBisectors(angle: string): Scene {
  return { title: '平角内部的两条角平分线', description: 'A、O、B共线；OD、OE分别平分相邻的两个角。', segments: [S([55, 245], [545, 245], 'base', false, 5), S([300, 245], [185, 55], 'primary'), S([300, 245], [245, 75], 'proof'), S([300, 245], [425, 70], 'proof')], points: [P([55, 245], 'A', 0, 22), P([545, 245], 'B', 0, 22), P([300, 245], 'O', 0, 23), P([185, 55], 'C'), P([245, 75], 'D'), P([425, 70], 'E')], labels: [L([220, 170], angle, 'accent')] }
}

function oppositeRayAngles(values: string[]): Scene {
  return { title: '直线两侧的射线角', description: 'A、O、B共线；OC在上方、OD在下方，先用平角分割关系求∠COD。', segments: [S([55, 160], [545, 160], 'base', false, 5), S([300, 160], [180, 45], 'primary'), S([300, 160], [430, 275], 'accent')], points: [P([55, 160], 'A', 0, 22), P([545, 160], 'B', 0, 22), P([300, 160], 'O', -15, 20), P([180, 45], 'C'), P([430, 275], 'D', 14, 18)], labels: [L([215, 125], `${values[0] ?? 70}°`, 'primary'), L([390, 195], `${values[1] ?? 55}°`, 'accent')] }
}

function pointToLineScene(): Scene {
  return { title: '点到直线的垂线段', description: 'PO垂直于l，PQ、PR为斜线段；垂线段是所有连接线段中最短的。', segments: [S([60, 245], [545, 245], 'primary'), S([255, 50], [255, 245], 'accent', false, 6), S([255, 50], [455, 245], 'base')], points: [P([255, 50], 'P'), P([255, 245], 'O', 0, 22), P([455, 245], 'Q', 0, 22)], rightAngles: [{ at: [255, 245], x: 1, y: -1, tone: 'accent' }], labels: [L([515, 230], 'l', 'primary')] }
}

function zigzagParallelScene(values: string[]): Scene {
  return { title: '平行线之间的“之”字形', description: '过E作辅助平行线，把上下两个已知角传到点E后相加。', segments: [S([65, 60], [535, 60], 'primary'), S([65, 250], [535, 250], 'primary'), S([155, 60], [320, 155], 'accent'), S([320, 155], [455, 250], 'accent'), S([110, 155], [505, 155], 'proof', true)], points: [P([155, 60], 'B'), P([455, 250], 'D', 0, 22), P([320, 155], 'E', 15, 2)], labels: [L([210, 105], `${values[0] ?? '?'}°`, 'accent'), L([410, 205], `${values[1] ?? '?'}°`, 'accent'), L([465, 145], '辅助线', 'proof', 14)] }
}

function triangleParallelScene(): Scene {
  return { title: '用平行线说明三角形内角和', description: '过顶点A作DE∥BC，底角可传到A点两侧，三个角组成平角。', segments: [S([65, 65], [535, 65], 'proof', true), S([300, 65], [110, 245], 'primary'), S([300, 65], [500, 245], 'primary'), S([110, 245], [500, 245], 'base')], points: [P([65, 65], 'D'), P([535, 65], 'E'), P([300, 65], 'A', 0, -14), P([110, 245], 'B', -12, 20), P([500, 245], 'C', 12, 20)], labels: [L([455, 57], '∥', 'proof', 22), L([455, 237], '∥', 'proof', 22)] }
}

function parallelPerpendicularTriangleScene(): Scene {
  return { title: '平行线中的垂直与等腰条件', description: 'a∥b且c⊥a，因此c也垂直b；AC=BC形成等腰直角三角形。', segments: [S([70, 65], [530, 65], 'primary'), S([70, 245], [530, 245], 'primary'), S([250, 35], [250, 275], 'accent'), S([250, 65], [430, 245], 'proof')], points: [P([250, 65], 'A'), P([250, 245], 'B', -14, 22), P([430, 245], 'C', 0, 22)], rightAngles: [{ at: [250, 65], x: 1, y: 1, tone: 'accent' }, { at: [250, 245], x: 1, y: -1, tone: 'accent' }], ticks: [{ a: [250, 65], b: [430, 245], tone: 'proof' }, { a: [250, 245], b: [430, 245], tone: 'proof' }] }
}

function triangleConditionScene(problem: string, values: string[] = [], equilateral = false): Scene {
  const dInside = /D在.*内部/.test(problem)
  const d: Point = dInside ? [300, 160] : [300, 245]
  const hasD = /(?:点D|D是|D在|AD|BD|CD)/.test(problem)
  const hasE = /(?:点E|E是|AE|BE|CE|DE)/.test(problem)
  const hasF = /(?:点F|F是|AF|BF|CF|DF)/.test(problem)
  const segments = [S([300, 35], [90, 245], 'primary'), S([300, 35], [510, 245], 'primary'), S([90, 245], [510, 245], 'base')]
  if (hasD) segments.push(S([300, 35], d, 'accent'))
  if (hasE) segments.push(S([90, 245], [405, 140], 'proof'))
  if (hasF) segments.push(S([510, 245], [195, 140], 'proof', true))
  return { title: equilateral ? '等边三角形的构造' : '三角形条件结构图', description: '按题干标出顶点和辅助线；同色线段表示同一组条件，图形不按比例。', segments, points: [P([300, 35], 'A'), P([90, 245], 'B', -12, 20), P([510, 245], 'C', 12, 20), ...(hasD ? [P(d, 'D', dInside ? 15 : 0, dInside ? 0 : 22)] : []), ...(hasE ? [P([405, 140], 'E', 14, 0)] : []), ...(hasF ? [P([195, 140], 'F', -14, 0)] : [])], labels: values.slice(0, 3).map((value, index) => L([[210, 105], [390, 105], [300, 225]][index] as Point, `${value}°`, index === 0 ? 'accent' : 'proof', 15)) }
}

function quadrilateralConditionScene(problem: string): Scene {
  const diagonals = /对角线|连接AC|AC⊥BD/.test(problem)
  return { title: '四边形条件结构图', description: '先标出平行、等边或对角线条件，再选择平行四边形的判定路径。', segments: [S([155, 55], [500, 95], 'primary'), S([500, 95], [430, 260], 'primary'), S([430, 260], [85, 220], 'primary'), S([85, 220], [155, 55], 'primary'), ...(diagonals ? [S([155, 55], [430, 260], 'accent'), S([500, 95], [85, 220], 'proof')] : [])], points: [P([155, 55], 'A'), P([500, 95], 'B', 13, -5), P([430, 260], 'C', 12, 20), P([85, 220], 'D', -13, 10)], labels: problem.includes('∥') || problem.includes('//') ? [L([325, 67], '∥', 'primary', 22), L([255, 248], '∥', 'primary', 22)] : [] }
}

function rightTriangleScene(title: string, legA: string, legB: string): Scene {
  return { title, description: '红色直角是使用勾股定理的前提；先区分直角边和斜边。', segments: [S([105, 245], [105, 60], 'primary', false, 6), S([105, 245], [505, 245], 'accent', false, 6), S([105, 60], [505, 245], 'proof', false, 6)], points: [P([105, 60], 'A'), P([505, 245], 'B', 13, 20), P([105, 245], 'C', -13, 20)], rightAngles: [{ at: [105, 245], x: 1, y: -1, tone: 'accent' }], labels: [L([75, 150], legA, 'primary'), L([300, 270], legB, 'accent'), L([330, 135], 'c', 'proof')] }
}

interface Props {
  lectureId: number
  questionIndex?: number
  problem: string
  context?: 'example' | 'exercise' | 'oral' | 'answer'
  diagramId?: string
}

export default function GeometryExampleDiagram({ lectureId, questionIndex, problem, context = 'example', diagramId }: Props) {
  const [motionPlaying, setMotionPlaying] = useState(false)
  const configuredExampleScene = context === 'example' && questionIndex !== undefined
    ? sceneFor(`${lectureId}-${questionIndex + 1}`)
    : null
  const scene = configuredExampleScene ?? supportingSceneFor(lectureId, problem, context)
  if (!scene) return null

  const instanceId = `${lectureId}-${diagramId ?? `${context}-${questionIndex ?? 0}`}`.replace(/[^a-zA-Z0-9_-]/g, '-')
  const titleId = `geometry-diagram-${instanceId}`
  return (
    <figure className="my-4 mx-auto w-full max-w-[680px] overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-violet-50 shadow-sm" data-geometry-example-diagram={context === 'example' || undefined} data-problem-diagram={context}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 bg-white/80 px-4 py-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-700">{context === 'answer' ? '答案图示' : '题意示意图'}</p>
          <p className="text-sm font-bold text-slate-800">{scene.title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {scene.motionPath && (
            <button type="button" onClick={() => setMotionPlaying(value => !value)} aria-pressed={motionPlaying} className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100">
              {motionPlaying ? '停止演示' : (scene.motionLabel ?? '演示变化')}
            </button>
          )}
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">{context === 'answer' ? '对照步骤核查' : '先看图，再审题'}</span>
        </div>
      </div>
      <svg viewBox="0 0 640 380" className="block h-auto w-full" role="img" aria-labelledby={titleId} preserveAspectRatio="xMidYMid meet">
        <title id={titleId}>{`${scene.title}：${problem.replace(/[$\\]/g, '')}`}</title>
        <defs>
          <pattern id={`grid-${instanceId}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#dbeafe" strokeWidth="0.7" />
          </pattern>
          <filter id={`shadow-${instanceId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#0f172a" floodOpacity="0.18" />
          </filter>
        </defs>
        <rect width="640" height="380" fill="#ffffff" />
        <rect width="640" height="380" fill={`url(#grid-${instanceId})`} opacity="0.48" />
        <g filter={`url(#shadow-${instanceId})`} transform="translate(52 62) scale(0.86)">
          {scene.polygons?.map((polygon, index) => <polygon key={`polygon-${index}`} points={polygon.points.map(p => p.join(',')).join(' ')} fill={polygon.fill ?? 'none'} stroke={COLORS[polygon.tone ?? 'base']} strokeWidth="3" strokeDasharray={polygon.dashed ? '10 8' : undefined} strokeLinejoin="round" />)}
          {scene.circles?.map((circle, index) => <circle key={`circle-${index}`} cx={circle.at[0]} cy={circle.at[1]} r={circle.r} fill={circle.fill ?? 'none'} stroke={COLORS[circle.tone ?? 'base']} strokeWidth="3" strokeDasharray={circle.dashed ? '10 8' : undefined} />)}
          {scene.paths?.map((path, index) => <path key={`path-${index}`} d={path.d} fill={path.fill ?? 'none'} stroke={COLORS[path.tone ?? 'base']} strokeWidth={path.width ?? 3} strokeDasharray={path.dashed ? '10 8' : undefined} strokeLinecap="round" strokeLinejoin="round" />)}
          {scene.segments?.map((segment, index) => <line key={`segment-${index}`} x1={segment.a[0]} y1={segment.a[1]} x2={segment.b[0]} y2={segment.b[1]} stroke={COLORS[segment.tone ?? 'base']} strokeWidth={segment.width ?? 4} strokeDasharray={segment.dashed ? '11 8' : undefined} strokeLinecap="round" />)}
          {scene.ticks?.map((tick, index) => <Tick key={`tick-${index}`} {...tick} />)}
          {scene.rightAngles?.map((mark, index) => <RightAngle key={`right-${index}`} {...mark} />)}
          {scene.extra}
          {scene.motionPath && motionPlaying && (
            <circle r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="3">
              <animateMotion path={scene.motionPath} dur="3.2s" repeatCount="indefinite" />
            </circle>
          )}
          {scene.points?.map((point, index) => <DiagramPoint key={`point-${index}`} {...point} />)}
          {scene.labels?.map((label, index) => <DiagramLabel key={`label-${index}`} {...label} />)}
        </g>
      </svg>
      <figcaption className="border-t border-blue-100 bg-white/90 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <p className="font-medium text-slate-700">{scene.description}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <span><i className="mr-1 inline-block h-1 w-5 rounded bg-blue-600 align-middle" />主图形/已知</span>
          <span><i className="mr-1 inline-block h-1 w-5 rounded bg-rose-600 align-middle" />关键条件</span>
          <span><i className="mr-1 inline-block h-1 w-5 border-t-2 border-dashed border-violet-600 align-middle" />辅助线/对称</span>
          <span className="text-amber-700">图形按题意示意，不按比例</span>
        </div>
      </figcaption>
    </figure>
  )
}

function DiagramPoint({ at, label, dx = 0, dy = -13, tone = 'base' }: PointSpec) {
  return <g><circle cx={at[0]} cy={at[1]} r="5" fill="#fff" stroke={COLORS[tone]} strokeWidth="2.5" /><text x={at[0] + dx} y={at[1] + dy} textAnchor="middle" dominantBaseline="middle" fill={COLORS[tone]} fontSize="18" fontWeight="750" paintOrder="stroke" stroke="#fff" strokeWidth="3">{label}</text></g>
}

function DiagramLabel({ at, text, tone = 'base', size = 18, weight = 700, anchor = 'middle' }: LabelSpec) {
  return <text x={at[0]} y={at[1]} textAnchor={anchor} dominantBaseline="middle" fill={COLORS[tone]} fontSize={size} fontWeight={weight} paintOrder="stroke" stroke="#fff" strokeWidth="3">{text}</text>
}

function Tick({ a, b, count = 1, tone = 'accent' }: { a: Point; b: Point; count?: number; tone?: Tone }) {
  const mx = (a[0] + b[0]) / 2
  const my = (a[1] + b[1]) / 2
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const length = Math.hypot(dx, dy) || 1
  const nx = -dy / length
  const ny = dx / length
  const tx = dx / length
  const ty = dy / length
  return <g>{Array.from({ length: count }, (_, index) => {
    const offset = (index - (count - 1) / 2) * 8
    const cx = mx + tx * offset
    const cy = my + ty * offset
    return <line key={index} x1={cx - nx * 9} y1={cy - ny * 9} x2={cx + nx * 9} y2={cy + ny * 9} stroke={COLORS[tone]} strokeWidth="4" strokeLinecap="round" />
  })}</g>
}

function RightAngle({ at, x, y, tone = 'accent' }: { at: Point; x: number; y: number; tone?: Tone }) {
  const size = 18
  return <path d={`M ${at[0] + x * size} ${at[1]} L ${at[0] + x * size} ${at[1] + y * size} L ${at[0]} ${at[1] + y * size}`} fill="none" stroke={COLORS[tone]} strokeWidth="3.5" />
}

function CoordinateTranslation() {
  const grid: ReactNode[] = []
  for (let i = 0; i <= 10; i += 1) {
    grid.push(<line key={`v${i}`} x1={70 + i * 45} y1="35" x2={70 + i * 45} y2="285" stroke="#cbd5e1" strokeWidth="1" />)
    grid.push(<line key={`h${i}`} x1="70" y1={285 - i * 25} x2="520" y2={285 - i * 25} stroke="#cbd5e1" strokeWidth="1" />)
  }
  return <g>{grid}<polygon points="115,260 205,260 160,210" fill="#dbeafe" stroke="#2563eb" strokeWidth="4" /><polygon points="295,210 385,210 340,160" fill="#ffedd5" stroke="#e11d48" strokeWidth="4" /><line x1="160" y1="210" x2="340" y2="160" stroke="#7c3aed" strokeWidth="3.5" strokeDasharray="10 7" /><DiagramLabel at={[250, 170]} text="右4、上2" tone="proof" size={15} /><DiagramPoint at={[115, 260]} label="A" dx={-10} dy={18} tone="primary" /><DiagramPoint at={[295, 210]} label="A′" dx={-13} dy={18} tone="accent" /></g>
}

function TranslationVector() {
  return <g><line x1="80" y1="260" x2="540" y2="260" stroke="#334155" strokeWidth="3" /><line x1="150" y1="285" x2="150" y2="35" stroke="#334155" strokeWidth="3" /><line x1="250" y1="210" x2="430" y2="135" stroke="#e11d48" strokeWidth="3.5" /><line x1="100" y1="110" x2="280" y2="35" stroke="#2563eb" strokeWidth="3.5" /><DiagramPoint at={[250, 210]} label="A" dx={-12} dy={18} /><DiagramPoint at={[430, 135]} label="A′" dx={14} dy={-10} tone="accent" /><DiagramPoint at={[100, 110]} label="B" dx={-12} dy={-10} /><DiagramPoint at={[280, 35]} label="B′" dx={14} dy={-8} tone="primary" /><DiagramLabel at={[340, 190]} text="(+4,+3)" tone="accent" size={16} /><DiagramLabel at={[190, 85]} text="同一向量" tone="primary" size={15} /></g>
}

function RegularPolygon() {
  const points: Point[] = [[300, 35], [470, 115], [420, 275], [180, 275], [130, 115]]
  return <g><polygon points={points.map(p => p.join(',')).join(' ')} fill="#eff6ff" stroke="#2563eb" strokeWidth="3.5" strokeLinejoin="round" /><DiagramLabel at={[300, 85]} text="140°" tone="accent" size={20} /><path d="M 270 55 Q 300 105 330 55" fill="none" stroke="#e11d48" strokeWidth="4" /><DiagramLabel at={[300, 300]} text="外角 = 40° → 边数 = 360°÷40°" tone="proof" size={16} /></g>
}

function CuboidPath() {
  return <g><polygon points="140,85 420,85 500,145 220,145" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" /><polygon points="220,145 500,145 500,265 220,265" fill="#f8fafc" stroke="#334155" strokeWidth="4" /><line x1="140" y1="85" x2="140" y2="205" stroke="#334155" strokeWidth="4" /><line x1="140" y1="205" x2="220" y2="265" stroke="#334155" strokeWidth="4" /><line x1="420" y1="85" x2="420" y2="205" stroke="#64748b" strokeWidth="3" strokeDasharray="9 7" /><line x1="420" y1="205" x2="140" y2="205" stroke="#64748b" strokeWidth="3" strokeDasharray="9 7" /><line x1="140" y1="205" x2="500" y2="145" stroke="#e11d48" strokeWidth="3.5" /><DiagramPoint at={[140, 205]} label="起点" dx={-25} dy={20} tone="accent" /><DiagramPoint at={[500, 145]} label="终点" dx={25} dy={-15} tone="accent" /><DiagramLabel at={[320, 190]} text="展开后为直线" tone="proof" size={16} /></g>
}

function GridTriangle() {
  const grid: ReactNode[] = []
  for (let i = 0; i <= 4; i += 1) {
    grid.push(<line key={`v${i}`} x1={170 + i * 65} y1="25" x2={170 + i * 65} y2="285" stroke="#94a3b8" strokeWidth="1.5" />)
    grid.push(<line key={`h${i}`} x1="170" y1={25 + i * 65} x2="430" y2={25 + i * 65} stroke="#94a3b8" strokeWidth="1.5" />)
  }
  return <g>{grid}<line x1="170" y1="285" x2="365" y2="285" stroke="#2563eb" strokeWidth="4.5" /><line x1="365" y1="285" x2="365" y2="25" stroke="#e11d48" strokeWidth="4.5" /><line x1="170" y1="285" x2="365" y2="25" stroke="#7c3aed" strokeWidth="4.5" /><DiagramPoint at={[170, 285]} label="A" dx={-13} dy={19} /><DiagramPoint at={[365, 285]} label="B" dx={13} dy={19} /><DiagramPoint at={[365, 25]} label="C" dx={13} dy={-8} /><DiagramLabel at={[265, 303]} text="3格" tone="primary" size={15} /><DiagramLabel at={[390, 155]} text="4格" tone="accent" size={15} /></g>
}

function Ladder() {
  return <g><line x1="95" y1="35" x2="95" y2="275" stroke="#334155" strokeWidth="4.5" /><line x1="95" y1="275" x2="545" y2="275" stroke="#334155" strokeWidth="4.5" /><line x1="95" y1="75" x2="365" y2="275" stroke="#2563eb" strokeWidth="4.5" /><line x1="95" y1="135" x2="455" y2="275" stroke="#e11d48" strokeWidth="4.5" strokeDasharray="12 8" /><DiagramPoint at={[365, 275]} label="原梯脚" dx={0} dy={22} tone="primary" /><DiagramPoint at={[455, 275]} label="新梯脚" dx={0} dy={22} tone="accent" /><DiagramLabel at={[235, 150]} text="10 m" tone="primary" size={17} /><DiagramLabel at={[410, 255]} text="外移2 m" tone="accent" size={15} /></g>
}

function PentagonBisector() {
  const pts = '300,35 500,130 425,285 175,285 100,130'
  return <g><polygon points={pts} fill="#eff6ff" stroke="#2563eb" strokeWidth="3.5" strokeLinejoin="round" /><line x1="500" y1="130" x2="175" y2="285" stroke="#e11d48" strokeWidth="3.5" /><DiagramPoint at={[300, 35]} label="A" /><DiagramPoint at={[500, 130]} label="B" dx={15} dy={0} /><DiagramPoint at={[425, 285]} label="C" dx={10} dy={18} /><DiagramPoint at={[175, 285]} label="D" dx={-10} dy={18} /><DiagramPoint at={[100, 130]} label="E" dx={-15} dy={0} /><DiagramLabel at={[440, 155]} text="54°" tone="accent" size={17} /><DiagramLabel at={[465, 105]} text="54°" tone="accent" size={17} /></g>
}

function CoordinateDoubleReflection() {
  return <g><line x1="55" y1="250" x2="550" y2="250" stroke="#2563eb" strokeWidth="4" /><line x1="55" y1="105" x2="550" y2="105" stroke="#2563eb" strokeWidth="4" /><DiagramLabel at={[520, 92]} text="y=4" tone="primary" size={15} /><DiagramLabel at={[520, 238]} text="x轴" tone="primary" size={15} /><line x1="130" y1="70" x2="130" y2="300" stroke="#7c3aed" strokeWidth="3" strokeDasharray="10 7" /><line x1="465" y1="142" x2="465" y2="70" stroke="#7c3aed" strokeWidth="3" strokeDasharray="10 7" /><line x1="130" y1="300" x2="465" y2="70" stroke="#e11d48" strokeWidth="3.5" /><DiagramPoint at={[130, 70]} label="A" dx={-14} dy={-10} /><DiagramPoint at={[130, 300]} label="A′" dx={-16} dy={14} tone="proof" /><DiagramPoint at={[465, 142]} label="B" dx={15} dy={0} /><DiagramPoint at={[465, 70]} label="B′" dx={17} dy={-9} tone="proof" /><DiagramPoint at={[203, 250]} label="P" dx={0} dy={21} tone="accent" /><DiagramPoint at={[414, 105]} label="Q" dx={0} dy={-15} tone="accent" /></g>
}

function CoordinateAxes({ children }: { children?: ReactNode }) {
  const grid: ReactNode[] = []
  for (let x = 75; x <= 525; x += 45) grid.push(<line key={`gx-${x}`} x1={x} y1="25" x2={x} y2="295" stroke="#dbeafe" strokeWidth="1" />)
  for (let y = 25; y <= 295; y += 45) grid.push(<line key={`gy-${y}`} x1="75" y1={y} x2="525" y2={y} stroke="#dbeafe" strokeWidth="1" />)
  return <g>{grid}<line x1="60" y1="160" x2="545" y2="160" stroke="#334155" strokeWidth="3" /><line x1="300" y1="300" x2="300" y2="20" stroke="#334155" strokeWidth="3" /><path d="M545 160 l-13 -7 v14z" fill="#334155" /><path d="M300 20 l-7 13 h14z" fill="#334155" /><DiagramLabel at={[535, 145]} text="x" size={16} /><DiagramLabel at={[316, 30]} text="y" size={16} /><DiagramLabel at={[285, 177]} text="O" size={14} />{children}</g>
}

function CoordinateLessonPlot({ variant }: { variant: 'quadrants' | 'distances' | 'symmetry' | 'point-translation' | 'area' }) {
  if (variant === 'quadrants') return <CoordinateAxes><DiagramPoint at={[390, 230]} label="A(π,-2)" dx={35} dy={20} tone="accent" /><DiagramPoint at={[165, 90]} label="B(-3,√5)" dx={-40} dy={-13} tone="primary" /><DiagramPoint at={[300, 265]} label="C(0,-4)" dx={45} dy={6} tone="proof" /><DiagramPoint at={[255, 205]} label="D(-1,-1)" dx={-40} dy={18} /></CoordinateAxes>
  if (variant === 'distances') return <CoordinateAxes><line x1="165" y1="25" x2="165" y2="160" stroke="#e11d48" strokeWidth="4" strokeDasharray="9 7" /><line x1="165" y1="25" x2="300" y2="25" stroke="#2563eb" strokeWidth="4" strokeDasharray="9 7" /><line x1="165" y1="25" x2="300" y2="160" stroke="#7c3aed" strokeWidth="3.5" /><DiagramPoint at={[165, 25]} label="P(-3,4)" dx={0} dy={18} tone="accent" /><DiagramLabel at={[146, 92]} text="4" tone="accent" /><DiagramLabel at={[232, 12]} text="3" tone="primary" /><DiagramLabel at={[245, 85]} text="5" tone="proof" /></CoordinateAxes>
  if (variant === 'symmetry') return <CoordinateAxes><DiagramPoint at={[390, 250]} label="P(2,-3)" dx={35} dy={18} tone="base" /><DiagramPoint at={[390, 70]} label="关于x轴" dx={52} dy={-12} tone="primary" /><DiagramPoint at={[210, 250]} label="关于y轴" dx={-48} dy={18} tone="accent" /><DiagramPoint at={[210, 70]} label="关于原点" dx={-52} dy={-12} tone="proof" /><line x1="390" y1="70" x2="390" y2="250" stroke="#2563eb" strokeWidth="3" strokeDasharray="8 6" /><line x1="210" y1="250" x2="390" y2="250" stroke="#e11d48" strokeWidth="3" strokeDasharray="8 6" /></CoordinateAxes>
  if (variant === 'point-translation') return <CoordinateAxes><polyline points="165,70 390,70 390,205" fill="none" stroke="#e11d48" strokeWidth="4" strokeLinejoin="round" /><DiagramPoint at={[165, 70]} label="P(-3,2)" dx={-38} dy={-12} tone="primary" /><DiagramPoint at={[390, 70]} label="右移5" dx={0} dy={-16} tone="accent" /><DiagramPoint at={[390, 205]} label="下移3" dx={40} dy={10} tone="proof" /></CoordinateAxes>
  return <CoordinateAxes><polygon points="345,115 480,70 390,25" fill="#dbeafe" fillOpacity="0.55" stroke="#2563eb" strokeWidth="3.5" /><rect x="345" y="25" width="135" height="90" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="9 6" /><line x1="345" y1="115" x2="480" y2="115" stroke="#e11d48" strokeWidth="3" strokeDasharray="8 6" /><DiagramPoint at={[345, 115]} label="A" dx={-12} dy={18} /><DiagramPoint at={[480, 70]} label="B" dx={14} dy={2} /><DiagramPoint at={[390, 25]} label="C" dx={0} dy={18} /><DiagramLabel at={[425, 135]} text="包围矩形−三个角" tone="proof" size={14} /></CoordinateAxes>
}

function FunctionMapping() {
  return <g><rect x="70" y="45" width="180" height="230" rx="18" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" /><rect x="350" y="45" width="180" height="230" rx="18" fill="#fff1f2" stroke="#e11d48" strokeWidth="4" /><DiagramLabel at={[160, 70]} text="输入 x" tone="primary" /><DiagramLabel at={[440, 70]} text="输出 y" tone="accent" /><DiagramPoint at={[145, 120]} label="x₁" tone="primary" /><DiagramPoint at={[145, 190]} label="x₂" tone="primary" /><DiagramPoint at={[425, 120]} label="y₁" tone="accent" /><DiagramPoint at={[425, 190]} label="y₂" tone="accent" /><line x1="165" y1="120" x2="405" y2="120" stroke="#7c3aed" strokeWidth="3.5" /><line x1="165" y1="190" x2="405" y2="190" stroke="#7c3aed" strokeWidth="3.5" /><path d="M405 120 l-14 -8 v16z M405 190 l-14 -8 v16z" fill="#7c3aed" /><DiagramLabel at={[300, 245]} text="一个输入 → 一个确定输出" tone="proof" size={16} /></g>
}

function DomainRestrictions() {
  return <g><DiagramLabel at={[70, 60]} text="① 分母≠0" tone="primary" anchor="start" /><line x1="80" y1="105" x2="520" y2="105" stroke="#334155" strokeWidth="4" /><circle cx="330" cy="105" r="9" fill="#fff" stroke="#e11d48" strokeWidth="4" /><DiagramLabel at={[330, 132]} text="x=1排除" tone="accent" size={15} /><DiagramLabel at={[70, 180]} text="② 根号内≥0" tone="primary" anchor="start" /><line x1="80" y1="225" x2="520" y2="225" stroke="#334155" strokeWidth="4" /><line x1="300" y1="225" x2="520" y2="225" stroke="#7c3aed" strokeWidth="9" /><circle cx="300" cy="225" r="8" fill="#7c3aed" /><DiagramLabel at={[300, 255]} text="从允许点向右" tone="proof" size={15} /></g>
}

function FunctionPlot({ variant = 'intersection' }: { variant?: 'parabola' | 'absolute' | 'inverse' | 'parallel-lines' | 'decreasing' | 'negative-intercept' | 'compare' | 'intercept-triangle' | 'through-points' | 'intersection' | 'plans' }) {
  const line = (x1: number, y1: number, x2: number, y2: number, color: string, dashed = false) => <line x1={300 + x1 * 45} y1={160 - y1 * 35} x2={300 + x2 * 45} y2={160 - y2 * 35} stroke={color} strokeWidth="3.5" strokeDasharray={dashed ? '9 7' : undefined} strokeLinecap="round" />
  if (variant === 'parabola') return <CoordinateAxes><path d="M 120 20 Q 300 300 480 20" fill="none" stroke="#2563eb" strokeWidth="4" /><circle cx="165" cy="20" r="4.5" fill="#e11d48" /><circle cx="210" cy="90" r="4.5" fill="#e11d48" /><circle cx="255" cy="140" r="4.5" fill="#e11d48" /><circle cx="300" cy="160" r="4.5" fill="#e11d48" /><circle cx="345" cy="140" r="4.5" fill="#e11d48" /><circle cx="390" cy="90" r="4.5" fill="#e11d48" /><circle cx="435" cy="20" r="4.5" fill="#e11d48" /><DiagramLabel at={[450, 45]} text="y=x²" tone="primary" size={16} /></CoordinateAxes>
  if (variant === 'absolute') return <CoordinateAxes><polyline points="120,20 300,160 480,20" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinejoin="round" /><DiagramPoint at={[300,160]} label="O" dx={18} dy={18} tone="accent" /><DiagramLabel at={[450,50]} text="y=|x|" tone="primary" /></CoordinateAxes>
  if (variant === 'inverse') return <CoordinateAxes><path d="M315 295 C325 230 360 190 520 170 M285 25 C275 90 240 130 80 150" fill="none" stroke="#2563eb" strokeWidth="4" /><DiagramLabel at={[445,205]} text="y=k/x" tone="primary" /><circle cx="390" cy="195" r="5" fill="#e11d48" /></CoordinateAxes>
  if (variant === 'parallel-lines') return <CoordinateAxes>{line(-4,-6,4,6,'#2563eb')}{line(-4,-4,4,8,'#e11d48')}{line(-4,-8,4,4,'#7c3aed')}<DiagramLabel at={[465,55]} text="同斜率→平行" tone="proof" size={15} /></CoordinateAxes>
  if (variant === 'decreasing') return <CoordinateAxes>{line(-4, 5, 4, 1, '#2563eb')}<DiagramPoint at={[300, 55]} label="(0,3)" dx={38} dy={-10} tone="accent" /><DiagramPoint at={[525, 143]} label="(5,0.5)" dx={-35} dy={20} tone="proof" /><DiagramLabel at={[430, 75]} text="y=-½x+3" tone="primary" size={15} /></CoordinateAxes>
  if (variant === 'negative-intercept') return <CoordinateAxes>{line(-4, 3, 4, -5, '#e11d48')}<DiagramPoint at={[300, 230]} label="b<0" dx={34} dy={12} tone="accent" /><DiagramLabel at={[180, 70]} text="k<0" tone="primary" /></CoordinateAxes>
  if (variant === 'compare') return <CoordinateAxes>{line(-4, 5, 4, -5, '#2563eb')}<line x1="255" y1="20" x2="255" y2="195" stroke="#e11d48" strokeWidth="3" strokeDasharray="8 6" /><line x1="390" y1="20" x2="390" y2="260" stroke="#7c3aed" strokeWidth="3" strokeDasharray="8 6" /><DiagramLabel at={[255, 285]} text="x₁" tone="accent" /><DiagramLabel at={[390, 285]} text="x₂" tone="proof" /><DiagramLabel at={[445, 90]} text="x增大，y减小" tone="primary" size={15} /></CoordinateAxes>
  if (variant === 'intercept-triangle') return <CoordinateAxes>{line(-1, -6, 5, 6, '#2563eb')}<polygon points="300,160 390,160 300,300" fill="#fee2e2" fillOpacity="0.75" stroke="#e11d48" strokeWidth="4" /><DiagramPoint at={[390, 160]} label="(2,0)" dx={0} dy={20} tone="accent" /><DiagramPoint at={[300, 300]} label="(0,-4)" dx={42} dy={-12} tone="accent" /></CoordinateAxes>
  if (variant === 'through-points') return <CoordinateAxes>{line(-4, -7, 4, 9, '#2563eb')}<DiagramPoint at={[390, -15]} label="A(2,5)" dx={-35} dy={18} tone="accent" /><DiagramPoint at={[255, 300]} label="B(-1,-4)" dx={45} dy={-12} tone="proof" /></CoordinateAxes>
  if (variant === 'plans') return <CoordinateAxes>{line(-5, 0.5, 5, 5.5, '#2563eb')}{line(-5, -2.5, 5, 7.5, '#e11d48')}<DiagramPoint at={[390, 55]} label="分界点" dx={42} dy={-10} tone="proof" /><DiagramLabel at={[450, 115]} text="A" tone="primary" /><DiagramLabel at={[420, 35]} text="B" tone="accent" /></CoordinateAxes>
  return <CoordinateAxes>{line(-5, -5, 5, 5, '#2563eb')}{line(-5, 5, 5, -5, '#e11d48')}<DiagramPoint at={[300, 160]} label="P" dx={18} dy={-14} tone="proof" /><DiagramLabel at={[440, 55]} text="l₁" tone="primary" /><DiagramLabel at={[440, 260]} text="l₂" tone="accent" /></CoordinateAxes>
}

function CoordinateRightTriangle() { return <CoordinateAxes><polygon points="300,160 480,160 300,55" fill="#dbeafe" fillOpacity="0.7" stroke="#2563eb" strokeWidth="3.5" /><DiagramPoint at={[300, 160]} label="A(0,0)" dx={-40} dy={18} /><DiagramPoint at={[480, 160]} label="B(4,0)" dx={30} dy={18} /><DiagramPoint at={[300, 55]} label="C(0,3)" dx={36} dy={-10} /><DiagramLabel at={[390, 185]} text="4" tone="accent" /><DiagramLabel at={[275, 105]} text="3" tone="accent" /><DiagramLabel at={[400, 95]} text="BC=?" tone="proof" /></CoordinateAxes> }

function NumberLineAB() { return <g><line x1="65" y1="160" x2="540" y2="160" stroke="#334155" strokeWidth="3.5" /><path d="M540 160 l-14 -8 v16z" fill="#334155" />{[-2,-1,0,1,2].map((n,i)=><g key={n}><line x1={140+i*85} y1="145" x2={140+i*85} y2="175" stroke="#334155" strokeWidth="3" /><DiagramLabel at={[140+i*85,190]} text={String(n)} size={15} /></g>)}<DiagramPoint at={[180,160]} label="b" dx={0} dy={-20} tone="accent" /><DiagramPoint at={[430,160]} label="a" dx={0} dy={-20} tone="primary" /><DiagramLabel at={[180,110]} text="-2<b<-1" tone="accent" /><DiagramLabel at={[430,110]} text="0<a<1" tone="primary" /></g> }

function SquareCutout() { return <g><rect x="135" y="35" width="300" height="250" fill="#dbeafe" stroke="#2563eb" strokeWidth="4" /><rect x="335" y="185" width="100" height="100" fill="#fff" stroke="#e11d48" strokeWidth="3.5" strokeDasharray="9 6" /><DiagramLabel at={[285,310]} text="a" tone="primary" /><DiagramLabel at={[455,235]} text="b" tone="accent" /><DiagramLabel at={[250,145]} text="剩余面积 = a²-b²" tone="proof" size={18} /></g> }

function functionAnswerScene(problem: string): Scene {
  if (/x\^?2|x²/.test(problem)) return { title: '描点得到二次曲线', description: '列表中的每一组(x,y)对应图上一个点，描点后用平滑曲线连接。', extra: <FunctionPlot variant="parabola" /> }
  if (problem.includes('|x|')) return { title: '绝对值函数图像', description: '负半轴部分关于y轴折回，形成以原点为顶点的V形图像。', extra: <FunctionPlot variant="absolute" /> }
  if (/\\frac\{k\}\{x\}|k\/x/.test(problem)) return { title: '反比例关系图像', description: 'x不能为0，图像分成两支且不与坐标轴相交。', extra: <FunctionPlot variant="inverse" /> }
  if (/3x\+2|3x-1|2x-3.*2x.*2x\+4/.test(problem)) return { title: '同斜率直线组', description: 'k相同的直线平行，b改变使图像整体上下移动。', extra: <FunctionPlot variant="parallel-lines" /> }
  if (/套餐|方案|成本|收入|利润|费用|追上|交点/.test(problem)) return { title: '两条函数图像与分界点', description: '交点表示两种关系取值相同；交点两侧通过比较图像高低作决策。', extra: <FunctionPlot variant="plans" /> }
  if (parseLinearFunctions(problem).length > 0) return { title: '按解析式准确作图', description: '图中直线按题目给出的k、b绘制；标出坐标轴交点，并用交点核对方程或不等式。', extra: <LinearPlotFromProblem problem={problem} /> }
  if (/两条|l_1|l₁|y_1|y₁/.test(problem)) return { title: '两条直线的交点', description: '交点横、纵坐标同时满足两个解析式，也是对应方程组的解。', extra: <FunctionPlot variant="intersection" /> }
  if (/经过点|图像过点|待定系数/.test(problem)) return { title: '已知两点确定直线', description: '先描出两个已知点，再连接成直线；两点坐标用于求k、b。', extra: <FunctionPlot variant="through-points" /> }
  if (/与.*轴|y>0|y<0|不等式/.test(problem)) return { title: '从图像读取零点和正负区间', description: '与x轴交点对应y=0；图像在x轴上方对应y>0，下方对应y<0。', extra: <FunctionPlot variant="intercept-triangle" /> }
  return { title: '一次函数图像', description: '先列表选点，再描点、连线并向两端延长；同时标出坐标轴交点。', extra: <FunctionPlot variant="decreasing" /> }
}

function parseLinearFunctions(problem: string) {
  const normalized = problem.replace(/\s+/g, '').replace(/[−–]/g, '-')
  const matches = [...normalized.matchAll(/y(?:_[A-Za-z0-9]+|[₀-₉])?=([+-]?(?:\d+(?:\.\d+)?)?)x([+-]\d+(?:\.\d+)?)?/g)]
  return matches.map((match, index) => {
    const rawK = match[1]
    const k = rawK === '' || rawK === '+' ? 1 : rawK === '-' ? -1 : Number(rawK)
    const b = match[2] ? Number(match[2]) : 0
    return { k, b, label: match[0], tone: (['primary', 'accent', 'proof'] as Tone[])[index % 3] }
  }).filter(item => Number.isFinite(item.k) && Number.isFinite(item.b)).slice(0, 3)
}

function LinearPlotFromProblem({ problem }: { problem: string }) {
  const functions = parseLinearFunctions(problem)
  return <CoordinateAxes>{functions.map((fn, index) => {
    const x1 = -5
    const x2 = 5
    const y1 = fn.k * x1 + fn.b
    const y2 = fn.k * x2 + fn.b
    const xIntercept = fn.k !== 0 ? -fn.b / fn.k : Number.NaN
    return <g key={`${fn.label}-${index}`}>
      <line x1={300 + x1 * 45} y1={160 - y1 * 35} x2={300 + x2 * 45} y2={160 - y2 * 35} stroke={COLORS[fn.tone]} strokeWidth="3.5" strokeLinecap="round" />
      {Math.abs(fn.b) <= 4 && <DiagramPoint at={[300, 160 - fn.b * 35]} label={`(0,${fn.b})`} dx={40} dy={fn.b >= 0 ? -10 : 15} tone={fn.tone} />}
      {Number.isFinite(xIntercept) && Math.abs(xIntercept) <= 5 && <DiagramPoint at={[300 + xIntercept * 45, 160]} label={`(${Number(xIntercept.toFixed(2))},0)`} dx={0} dy={22} tone={fn.tone} />}
      <DiagramLabel at={[450, 45 + index * 24]} text={fn.label} tone={fn.tone} size={14} />
    </g>
  })}</CoordinateAxes>
}

function statisticsAnswerScene(problem: string): Scene {
  if (/箱线图|四分位/.test(problem)) return { title: '箱线图', description: '从左到右依次标出最小值、Q₁、中位数、Q₃和最大值。', extra: <StatisticsPlot variant="box" /> }
  if (/直方图|频数分布/.test(problem)) return { title: '频数分布直方图', description: '相邻组连续，长方形之间不留空隙；横轴为分组，纵轴为频数或频数/组距。', extra: <StatisticsPlot variant="histogram" /> }
  if (/折线图|变化|趋势/.test(problem)) return { title: '折线图', description: '横轴按时间顺序排列，点的高低表示数值，连线突出变化趋势。', extra: <StatisticsPlot variant="line" /> }
  if (/扇形图|百分比|占比/.test(problem)) return { title: '扇形图与比例', description: '圆心角=所占百分比×360°；各部分合计必须为100%。', extra: <StatisticsPlot variant="pie" /> }
  return { title: '条形统计图', description: '柱宽一致、间隔相等，柱高直接表示各类别数量，便于比较大小。', extra: <StatisticsPlot variant="bar" /> }
}

function FunctionLines({ single = false }: { single?: boolean }) { return <FunctionPlot variant={single ? 'intercept-triangle' : 'intersection'} /> }

function ThreeIntersectingLines({ values }: { values: string[] }) { return <g><line x1="70" y1="245" x2="530" y2="65" stroke="#2563eb" strokeWidth="3.5" /><line x1="75" y1="55" x2="525" y2="255" stroke="#e11d48" strokeWidth="3.5" /><line x1="300" y1="25" x2="300" y2="290" stroke="#7c3aed" strokeWidth="3.5" /><DiagramPoint at={[300,155]} label="O" dx={18} dy={18} /><DiagramLabel at={[255,90]} text={`${values[0] ?? 40}°`} tone="accent" /><DiagramLabel at={[345,90]} text={`${values[1] ?? 60}°`} tone="proof" /><DiagramLabel at={[440,155]} text="3/4/5/6" tone="muted" size={15} /></g> }

function LShapeTranslation() { return <g><path d="M95 85 H185 V175 H275 V265 H95 Z" fill="#dbeafe" stroke="#2563eb" strokeWidth="3.5" /><path d="M325 45 H385 V105 H445 V165 H325 Z" fill="#ffe4e6" stroke="#e11d48" strokeWidth="3.5" /><line x1="185" y1="175" x2="385" y2="105" stroke="#7c3aed" strokeWidth="4" strokeDasharray="10 7" /><DiagramLabel at={[285,125]} text="同一平移向量" tone="proof" size={15} /></g> }

function PolygonExteriorAngles() { return <g><polygon points="300,35 500,125 425,285 175,285 100,125" fill="#eff6ff" stroke="#2563eb" strokeWidth="3.5" /><path d="M300 35 L380 0 M500 125 L560 85 M425 285 L470 315 M175 285 L125 315 M100 125 L40 85" stroke="#e11d48" strokeWidth="4" fill="none" /><DiagramLabel at={[300,155]} text="沿同方向转一周" tone="proof" /><DiagramLabel at={[300,185]} text="外角和=360°" tone="accent" /></g> }

function RightTrianglePair() { return <g><polygon points="70,250 70,65 260,250" fill="#dbeafe" stroke="#2563eb" strokeWidth="3.5" /><polygon points="340,250 340,95 535,250" fill="#ffe4e6" stroke="#e11d48" strokeWidth="3.5" /><path d="M70 230 h20 v20 M340 230 h20 v20" fill="none" stroke="#7c3aed" strokeWidth="4" /><DiagramLabel at={[165,140]} text="斜边" tone="primary" /><DiagramLabel at={[438,150]} text="斜边" tone="accent" /><DiagramLabel at={[300,290]} text="HL：斜边+一条直角边" tone="proof" size={16} /></g> }

function PerpendicularBisector() { return <g><line x1="85" y1="235" x2="515" y2="235" stroke="#2563eb" strokeWidth="4" /><line x1="300" y1="35" x2="300" y2="290" stroke="#7c3aed" strokeWidth="3.5" strokeDasharray="10 7" /><line x1="300" y1="85" x2="85" y2="235" stroke="#e11d48" strokeWidth="4" /><line x1="300" y1="85" x2="515" y2="235" stroke="#e11d48" strokeWidth="4" /><DiagramPoint at={[85,235]} label="A" dx={0} dy={22} /><DiagramPoint at={[515,235]} label="B" dx={0} dy={22} /><DiagramPoint at={[300,85]} label="P" /><path d="M300 217 h18 v18" fill="none" stroke="#7c3aed" strokeWidth="3" /><DiagramLabel at={[190,145]} text="PA" tone="accent" /><DiagramLabel at={[410,145]} text="PB" tone="accent" /></g> }

function DiagonalReflection() { return <CoordinateAxes><line x1="120" y1="280" x2="500" y2="20" stroke="#2563eb" strokeWidth="3.5" /><line x1="165" y1="45" x2="435" y2="230" stroke="#7c3aed" strokeWidth="4" strokeDasharray="9 7" /><DiagramPoint at={[165,45]} label="A(1,4)" dx={-35} dy={-10} tone="accent" /><DiagramPoint at={[435,230]} label="A′(4,1)" dx={45} dy={15} tone="proof" /><DiagramLabel at={[450,65]} text="y=x" tone="primary" /></CoordinateAxes> }

function SquareOnHypotenuse() { return <g><polygon points="105,245 105,95 285,245" fill="#dbeafe" stroke="#2563eb" strokeWidth="3.5" /><polygon points="105,95 285,245 435,65 255,-85" fill="#ffe4e6" fillOpacity="0.7" stroke="#e11d48" strokeWidth="3.5" /><path d="M105 225 h20 v20" fill="none" stroke="#7c3aed" strokeWidth="3" /><DiagramLabel at={[335,125]} text="面积=AB²" tone="accent" /></g> }

function IsoscelesHeight() { return <g><polygon points="300,35 95,250 505,250" fill="#eff6ff" stroke="#2563eb" strokeWidth="3.5" /><line x1="300" y1="35" x2="300" y2="250" stroke="#e11d48" strokeWidth="3.5" /><path d="M300 232 h18 v18" fill="none" stroke="#e11d48" strokeWidth="3" /><DiagramPoint at={[300,35]} label="A" /><DiagramPoint at={[95,250]} label="B" dx={-12} dy={20} /><DiagramPoint at={[505,250]} label="C" dx={12} dy={20} /><DiagramPoint at={[300,250]} label="D" dx={0} dy={22} /><DiagramLabel at={[200,150]} text="5" tone="primary" /><DiagramLabel at={[400,150]} text="5" tone="primary" /><DiagramLabel at={[200,270]} text="3" tone="accent" /><DiagramLabel at={[400,270]} text="3" tone="accent" /></g> }

function NestedSquares() { return <g><rect x="115" y="35" width="360" height="250" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" /><polygon points="115,35 475,150 360,285 225,170" fill="#ffe4e6" fillOpacity="0.55" stroke="#e11d48" strokeWidth="3.5" /><line x1="115" y1="285" x2="360" y2="285" stroke="#7c3aed" strokeWidth="3.5" /><DiagramPoint at={[115,35]} label="A" /><DiagramPoint at={[475,35]} label="B" /><DiagramPoint at={[475,285]} label="C" dy={22} /><DiagramPoint at={[115,285]} label="D" dy={22} /><DiagramPoint at={[475,150]} label="E" dx={16} dy={0} /><DiagramPoint at={[360,285]} label="G" dy={22} tone="proof" /></g> }

function TriangleShortestPath() { return <g><polygon points="130,55 130,260 500,260" fill="#eff6ff" stroke="#2563eb" strokeWidth="3.5" /><line x1="130" y1="55" x2="420" y2="260" stroke="#e11d48" strokeWidth="3.5" /><line x1="420" y1="260" x2="70" y2="120" stroke="#7c3aed" strokeWidth="4" strokeDasharray="10 7" /><DiagramPoint at={[130,55]} label="A" /><DiagramPoint at={[130,260]} label="B" dx={-12} dy={20} /><DiagramPoint at={[500,260]} label="C" dx={12} dy={20} /><DiagramPoint at={[420,260]} label="P" dy={22} tone="accent" /><DiagramPoint at={[70,120]} label="D′" dx={-15} dy={0} tone="proof" /><DiagramLabel at={[270,185]} text="化折为直" tone="proof" /></g> }

function EqualPerpendiculars() { return <g><polygon points="300,35 85,250 515,250" fill="#eff6ff" stroke="#2563eb" strokeWidth="3.5" /><line x1="300" y1="250" x2="190" y2="145" stroke="#e11d48" strokeWidth="3.5" /><line x1="300" y1="250" x2="410" y2="145" stroke="#e11d48" strokeWidth="3.5" /><DiagramPoint at={[300,35]} label="A" /><DiagramPoint at={[85,250]} label="B" dx={-12} dy={20} /><DiagramPoint at={[515,250]} label="C" dx={12} dy={20} /><DiagramPoint at={[300,250]} label="D" dy={22} /><DiagramPoint at={[190,145]} label="E" dx={-14} dy={0} /><DiagramPoint at={[410,145]} label="F" dx={14} dy={0} /><DiagramLabel at={[245,195]} text="DE" tone="accent" /><DiagramLabel at={[355,195]} text="DF" tone="accent" /></g> }

function SsaAmbiguity() { return <g><line x1="90" y1="250" x2="520" y2="250" stroke="#2563eb" strokeWidth="4" /><line x1="90" y1="250" x2="420" y2="75" stroke="#e11d48" strokeWidth="3.5" /><line x1="90" y1="250" x2="420" y2="185" stroke="#7c3aed" strokeWidth="3.5" strokeDasharray="10 7" /><circle cx="420" cy="250" r="175" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="7 7" /><DiagramPoint at={[90,250]} label="A" dy={22} /><DiagramPoint at={[420,75]} label="C₁" /><DiagramPoint at={[420,185]} label="C₂" dx={15} dy={0} /><DiagramLabel at={[315,45]} text="相同两边和非夹角" tone="accent" /><DiagramLabel at={[315,285]} text="可得到两个不同三角形" tone="proof" /></g> }

function PythagoreanArea() { return <g><rect x="135" y="25" width="330" height="270" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" /><polygon points="300,85 405,160 300,235 195,160" fill="#ffe4e6" stroke="#e11d48" strokeWidth="3.5" /><line x1="135" y1="25" x2="405" y2="160" stroke="#7c3aed" strokeWidth="3" /><line x1="465" y1="25" x2="300" y2="235" stroke="#7c3aed" strokeWidth="3" /><line x1="465" y1="295" x2="195" y2="160" stroke="#7c3aed" strokeWidth="3" /><line x1="135" y1="295" x2="300" y2="85" stroke="#7c3aed" strokeWidth="3" /><DiagramLabel at={[300,160]} text="c²" tone="accent" size={24} /><DiagramLabel at={[300,310]} text="(a+b)² = 4×½ab + c²" tone="proof" size={17} /></g> }

function ChartComparison() { return <g><DiagramLabel at={[110,35]} text="条形图" tone="primary" /><rect x="55" y="190" width="35" height="80" fill="#2563eb" /><rect x="105" y="125" width="35" height="145" fill="#60a5fa" /><rect x="155" y="75" width="35" height="195" fill="#93c5fd" /><DiagramLabel at={[300,35]} text="折线图" tone="accent" /><polyline points="230,230 280,150 330,185 380,80" fill="none" stroke="#e11d48" strokeWidth="4" /><circle cx="230" cy="230" r="5" fill="#e11d48" /><circle cx="280" cy="150" r="5" fill="#e11d48" /><circle cx="330" cy="185" r="5" fill="#e11d48" /><circle cx="380" cy="80" r="5" fill="#e11d48" /><DiagramLabel at={[490,35]} text="扇形图" tone="proof" /><circle cx="490" cy="170" r="85" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="4" /><path d="M490 170 L490 85 A85 85 0 0 1 570 195 Z" fill="#fda4af" stroke="#fff" strokeWidth="3" /><DiagramLabel at={[300,300]} text="比大小   ·   看变化   ·   看占比" tone="base" size={16} /></g> }

function StatisticsPlot({ variant }: { variant: 'bar' | 'line' | 'pie' | 'histogram' | 'box' }) {
  if (variant === 'pie') return <g><circle cx="300" cy="160" r="120" fill="#dbeafe" stroke="#2563eb" strokeWidth="3.5" /><path d="M300 160 L300 40 A120 120 0 0 1 414 197 Z" fill="#fda4af" stroke="#fff" strokeWidth="4" /><path d="M300 160 L414 197 A120 120 0 0 1 230 258 Z" fill="#c4b5fd" stroke="#fff" strokeWidth="4" /><DiagramLabel at={[355,95]} text="40%" tone="accent" /><DiagramLabel at={[345,225]} text="25%" tone="proof" /><DiagramLabel at={[220,145]} text="35%" tone="primary" /></g>
  if (variant === 'line') return <g><line x1="70" y1="275" x2="545" y2="275" stroke="#334155" strokeWidth="4" /><line x1="70" y1="275" x2="70" y2="35" stroke="#334155" strokeWidth="4" /><polyline points="100,220 180,150 260,235 340,110 420,70 500,140" fill="none" stroke="#e11d48" strokeWidth="4" />{[[100,220],[180,150],[260,235],[340,110],[420,70],[500,140]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5.5" fill="#e11d48" />)}<DiagramLabel at={[300,305]} text="按时间顺序观察升降" tone="primary" size={16} /></g>
  if (variant === 'histogram') return <g><line x1="70" y1="275" x2="545" y2="275" stroke="#334155" strokeWidth="4" /><line x1="70" y1="275" x2="70" y2="35" stroke="#334155" strokeWidth="4" /><rect x="110" y="210" width="90" height="65" fill="#93c5fd" stroke="#2563eb" strokeWidth="3" /><rect x="200" y="150" width="90" height="125" fill="#60a5fa" stroke="#2563eb" strokeWidth="3" /><rect x="290" y="70" width="90" height="205" fill="#2563eb" stroke="#1d4ed8" strokeWidth="3" /><rect x="380" y="180" width="90" height="95" fill="#a5b4fc" stroke="#7c3aed" strokeWidth="3" /><DiagramLabel at={[300,305]} text="相邻组连续，不留空隙" tone="accent" size={16} /></g>
  if (variant === 'box') return <g><line x1="75" y1="160" x2="525" y2="160" stroke="#334155" strokeWidth="4" /><line x1="115" y1="125" x2="115" y2="195" stroke="#2563eb" strokeWidth="3.5" /><line x1="485" y1="125" x2="485" y2="195" stroke="#2563eb" strokeWidth="3.5" /><rect x="205" y="105" width="200" height="110" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="3.5" /><line x1="310" y1="105" x2="310" y2="215" stroke="#e11d48" strokeWidth="4" /><DiagramLabel at={[115,225]} text="最小" tone="primary" size={14} /><DiagramLabel at={[205,240]} text="Q₁" tone="proof" size={14} /><DiagramLabel at={[310,240]} text="中位数" tone="accent" size={14} /><DiagramLabel at={[405,240]} text="Q₃" tone="proof" size={14} /><DiagramLabel at={[485,225]} text="最大" tone="primary" size={14} /></g>
  return <g><line x1="70" y1="275" x2="545" y2="275" stroke="#334155" strokeWidth="4" /><line x1="70" y1="275" x2="70" y2="35" stroke="#334155" strokeWidth="4" /><rect x="115" y="195" width="60" height="80" fill="#93c5fd" /><rect x="220" y="120" width="60" height="155" fill="#60a5fa" /><rect x="325" y="70" width="60" height="205" fill="#2563eb" /><rect x="430" y="155" width="60" height="120" fill="#7c3aed" /><DiagramLabel at={[145,295]} text="A" size={14} /><DiagramLabel at={[250,295]} text="B" size={14} /><DiagramLabel at={[355,295]} text="C" size={14} /><DiagramLabel at={[460,295]} text="D" size={14} /></g>
}

function GenericGeometry() { return <g><polygon points="300,40 95,250 505,250" fill="#eff6ff" stroke="#2563eb" strokeWidth="3.5" /><line x1="300" y1="40" x2="300" y2="250" stroke="#7c3aed" strokeWidth="4" strokeDasharray="9 7" /><DiagramPoint at={[300,40]} label="A" /><DiagramPoint at={[95,250]} label="B" dx={-12} dy={20} /><DiagramPoint at={[505,250]} label="C" dx={12} dy={20} /><DiagramPoint at={[300,250]} label="D" dy={22} /><DiagramLabel at={[300,285]} text="逐项把题干条件标到图上" tone="proof" size={16} /></g> }

