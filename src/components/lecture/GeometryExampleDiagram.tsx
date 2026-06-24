import type { ReactNode } from 'react'

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

const S = (a: Point, b: Point, tone: Tone = 'base', dashed = false, width = 4): SegmentSpec => ({ a, b, tone, dashed, width })
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
  segments: [S([55, 200], [550, 200], 'primary'), S([110, 75], [270, 200], 'accent'), S([270, 200], [495, 55], 'accent'), S([110, 75], [110, 275], 'proof', true), S([110, 275], [495, 55], 'proof', true)],
  points: [P([110, 75], 'A', -12, -14), P([495, 55], 'B', 12, -14), P([270, 200], 'P', 0, 23), P([110, 275], 'A′', -15, 20, 'proof')],
  labels: [L([525, 190], '河岸 l', 'primary', 16), ...(detailed ? [L([90, 137], '3 km', 'accent', 15), L([502, 128], '5 km', 'accent', 15), L([300, 45], '投影距离 8 km', 'muted', 15)] : [])],
})

const doubleReflection = (): Scene => ({
  title: '角内最短周长：两次对称',
  description: 'P分别关于OA、OB对称到P₁、P₂，紫色直线把三段周长展平。',
  segments: [S([300, 260], [65, 90], 'primary'), S([300, 260], [535, 90], 'primary'), S([300, 260], [300, 115], 'muted'), S([300, 115], [145, 148], 'accent'), S([145, 148], [455, 148], 'accent'), S([455, 148], [300, 115], 'accent'), S([85, 225], [515, 225], 'proof', true)],
  points: [P([300, 260], 'O', 0, 23), P([300, 115], 'P', 0, -14), P([145, 148], 'M', -12, -12), P([455, 148], 'N', 12, -12), P([85, 225], 'P₁', -15, 20, 'proof'), P([515, 225], 'P₂', 15, 20, 'proof')],
  labels: [L([132, 84], 'OA', 'primary', 16), L([470, 84], 'OB', 'primary', 16), L([300, 285], '60°', 'accent', 17)],
})

const rectangleFold = (): Scene => ({
  title: '长方形折叠',
  description: '紫色虚线AE是折痕，D折到F；同色线段表示折叠前后的对应关系。',
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
      title: '坐标网格中的平移', description: '蓝色是原三角形，橙色是向右4格、向上2格后的图形；箭头表示同一平移向量。',
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
    case '28-4': return { title: '长方体表面最短路径', description: '紫色虚线表示把相邻表面展开后，蚂蚁路径变成平面直线。', extra: <CuboidPath /> }
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
    case '29-4': return { title: '梯子滑动模型', description: '同一根梯子长度不变；实线为原位置，虚线为梯脚外移2米后的位置。', extra: <Ladder /> }
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

interface Props {
  lectureId: number
  questionIndex: number
  problem: string
}

export default function GeometryExampleDiagram({ lectureId, questionIndex, problem }: Props) {
  const scene = sceneFor(`${lectureId}-${questionIndex + 1}`)
  if (!scene) return null

  const titleId = `geometry-diagram-${lectureId}-${questionIndex + 1}`
  return (
    <figure className="my-4 overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-violet-50 shadow-sm" data-geometry-example-diagram>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 bg-white/80 px-4 py-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-700">题意示意图</p>
          <p className="text-sm font-bold text-slate-800">{scene.title}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">先看图，再审题</span>
      </div>
      <svg viewBox="0 0 600 320" className="block h-auto w-full" role="img" aria-labelledby={titleId} preserveAspectRatio="xMidYMid meet">
        <title id={titleId}>{`${scene.title}：${problem.replace(/[$\\]/g, '')}`}</title>
        <defs>
          <pattern id={`grid-${lectureId}-${questionIndex}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#dbeafe" strokeWidth="0.7" />
          </pattern>
          <filter id={`shadow-${lectureId}-${questionIndex}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#0f172a" floodOpacity="0.18" />
          </filter>
        </defs>
        <rect width="600" height="320" fill="#ffffff" />
        <rect width="600" height="320" fill={`url(#grid-${lectureId}-${questionIndex})`} opacity="0.48" />
        <g filter={`url(#shadow-${lectureId}-${questionIndex})`}>
          {scene.polygons?.map((polygon, index) => <polygon key={`polygon-${index}`} points={polygon.points.map(p => p.join(',')).join(' ')} fill={polygon.fill ?? 'none'} stroke={COLORS[polygon.tone ?? 'base']} strokeWidth="4" strokeDasharray={polygon.dashed ? '10 8' : undefined} strokeLinejoin="round" />)}
          {scene.circles?.map((circle, index) => <circle key={`circle-${index}`} cx={circle.at[0]} cy={circle.at[1]} r={circle.r} fill={circle.fill ?? 'none'} stroke={COLORS[circle.tone ?? 'base']} strokeWidth="4" strokeDasharray={circle.dashed ? '10 8' : undefined} />)}
          {scene.paths?.map((path, index) => <path key={`path-${index}`} d={path.d} fill={path.fill ?? 'none'} stroke={COLORS[path.tone ?? 'base']} strokeWidth={path.width ?? 4} strokeDasharray={path.dashed ? '10 8' : undefined} strokeLinecap="round" strokeLinejoin="round" />)}
          {scene.segments?.map((segment, index) => <line key={`segment-${index}`} x1={segment.a[0]} y1={segment.a[1]} x2={segment.b[0]} y2={segment.b[1]} stroke={COLORS[segment.tone ?? 'base']} strokeWidth={segment.width ?? 4} strokeDasharray={segment.dashed ? '11 8' : undefined} strokeLinecap="round" />)}
          {scene.ticks?.map((tick, index) => <Tick key={`tick-${index}`} {...tick} />)}
          {scene.rightAngles?.map((mark, index) => <RightAngle key={`right-${index}`} {...mark} />)}
          {scene.extra}
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
  return <g><circle cx={at[0]} cy={at[1]} r="5.5" fill="#fff" stroke={COLORS[tone]} strokeWidth="3" /><text x={at[0] + dx} y={at[1] + dy} textAnchor="middle" dominantBaseline="middle" fill={COLORS[tone]} fontSize="18" fontWeight="800" paintOrder="stroke" stroke="#fff" strokeWidth="4">{label}</text></g>
}

function DiagramLabel({ at, text, tone = 'base', size = 18, weight = 700, anchor = 'middle' }: LabelSpec) {
  return <text x={at[0]} y={at[1]} textAnchor={anchor} dominantBaseline="middle" fill={COLORS[tone]} fontSize={size} fontWeight={weight} paintOrder="stroke" stroke="#fff" strokeWidth="4">{text}</text>
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
  return <g><line x1="80" y1="260" x2="540" y2="260" stroke="#334155" strokeWidth="3" /><line x1="150" y1="285" x2="150" y2="35" stroke="#334155" strokeWidth="3" /><line x1="250" y1="210" x2="430" y2="135" stroke="#e11d48" strokeWidth="5" /><line x1="100" y1="110" x2="280" y2="35" stroke="#2563eb" strokeWidth="5" /><DiagramPoint at={[250, 210]} label="A" dx={-12} dy={18} /><DiagramPoint at={[430, 135]} label="A′" dx={14} dy={-10} tone="accent" /><DiagramPoint at={[100, 110]} label="B" dx={-12} dy={-10} /><DiagramPoint at={[280, 35]} label="B′" dx={14} dy={-8} tone="primary" /><DiagramLabel at={[340, 190]} text="(+4,+3)" tone="accent" size={16} /><DiagramLabel at={[190, 85]} text="同一向量" tone="primary" size={15} /></g>
}

function RegularPolygon() {
  const points: Point[] = [[300, 35], [470, 115], [420, 275], [180, 275], [130, 115]]
  return <g><polygon points={points.map(p => p.join(',')).join(' ')} fill="#eff6ff" stroke="#2563eb" strokeWidth="5" strokeLinejoin="round" /><DiagramLabel at={[300, 85]} text="140°" tone="accent" size={20} /><path d="M 270 55 Q 300 105 330 55" fill="none" stroke="#e11d48" strokeWidth="4" /><DiagramLabel at={[300, 300]} text="外角 = 40° → 边数 = 360°÷40°" tone="proof" size={16} /></g>
}

function CuboidPath() {
  return <g><polygon points="140,85 420,85 500,145 220,145" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" /><polygon points="220,145 500,145 500,265 220,265" fill="#f8fafc" stroke="#334155" strokeWidth="4" /><line x1="140" y1="85" x2="140" y2="205" stroke="#334155" strokeWidth="4" /><line x1="140" y1="205" x2="220" y2="265" stroke="#334155" strokeWidth="4" /><line x1="420" y1="85" x2="420" y2="205" stroke="#64748b" strokeWidth="3" strokeDasharray="9 7" /><line x1="420" y1="205" x2="140" y2="205" stroke="#64748b" strokeWidth="3" strokeDasharray="9 7" /><line x1="140" y1="205" x2="500" y2="145" stroke="#e11d48" strokeWidth="5" /><DiagramPoint at={[140, 205]} label="起点" dx={-25} dy={20} tone="accent" /><DiagramPoint at={[500, 145]} label="终点" dx={25} dy={-15} tone="accent" /><DiagramLabel at={[320, 190]} text="展开后为直线" tone="proof" size={16} /></g>
}

function GridTriangle() {
  const grid: ReactNode[] = []
  for (let i = 0; i <= 4; i += 1) {
    grid.push(<line key={`v${i}`} x1={170 + i * 65} y1="25" x2={170 + i * 65} y2="285" stroke="#94a3b8" strokeWidth="1.5" />)
    grid.push(<line key={`h${i}`} x1="170" y1={25 + i * 65} x2="430" y2={25 + i * 65} stroke="#94a3b8" strokeWidth="1.5" />)
  }
  return <g>{grid}<line x1="170" y1="285" x2="365" y2="285" stroke="#2563eb" strokeWidth="6" /><line x1="365" y1="285" x2="365" y2="25" stroke="#e11d48" strokeWidth="6" /><line x1="170" y1="285" x2="365" y2="25" stroke="#7c3aed" strokeWidth="6" /><DiagramPoint at={[170, 285]} label="A" dx={-13} dy={19} /><DiagramPoint at={[365, 285]} label="B" dx={13} dy={19} /><DiagramPoint at={[365, 25]} label="C" dx={13} dy={-8} /><DiagramLabel at={[265, 303]} text="3格" tone="primary" size={15} /><DiagramLabel at={[390, 155]} text="4格" tone="accent" size={15} /></g>
}

function Ladder() {
  return <g><line x1="95" y1="35" x2="95" y2="275" stroke="#334155" strokeWidth="7" /><line x1="95" y1="275" x2="545" y2="275" stroke="#334155" strokeWidth="7" /><line x1="95" y1="75" x2="365" y2="275" stroke="#2563eb" strokeWidth="7" /><line x1="95" y1="135" x2="455" y2="275" stroke="#e11d48" strokeWidth="7" strokeDasharray="12 8" /><DiagramPoint at={[365, 275]} label="原梯脚" dx={0} dy={22} tone="primary" /><DiagramPoint at={[455, 275]} label="新梯脚" dx={0} dy={22} tone="accent" /><DiagramLabel at={[235, 150]} text="10 m" tone="primary" size={17} /><DiagramLabel at={[410, 255]} text="外移2 m" tone="accent" size={15} /></g>
}

function PentagonBisector() {
  const pts = '300,35 500,130 425,285 175,285 100,130'
  return <g><polygon points={pts} fill="#eff6ff" stroke="#2563eb" strokeWidth="5" strokeLinejoin="round" /><line x1="500" y1="130" x2="175" y2="285" stroke="#e11d48" strokeWidth="5" /><DiagramPoint at={[300, 35]} label="A" /><DiagramPoint at={[500, 130]} label="B" dx={15} dy={0} /><DiagramPoint at={[425, 285]} label="C" dx={10} dy={18} /><DiagramPoint at={[175, 285]} label="D" dx={-10} dy={18} /><DiagramPoint at={[100, 130]} label="E" dx={-15} dy={0} /><DiagramLabel at={[440, 155]} text="54°" tone="accent" size={17} /><DiagramLabel at={[465, 105]} text="54°" tone="accent" size={17} /></g>
}

function CoordinateDoubleReflection() {
  return <g><line x1="55" y1="250" x2="550" y2="250" stroke="#2563eb" strokeWidth="4" /><line x1="55" y1="105" x2="550" y2="105" stroke="#2563eb" strokeWidth="4" /><DiagramLabel at={[520, 92]} text="y=4" tone="primary" size={15} /><DiagramLabel at={[520, 238]} text="x轴" tone="primary" size={15} /><line x1="130" y1="70" x2="130" y2="300" stroke="#7c3aed" strokeWidth="3" strokeDasharray="10 7" /><line x1="465" y1="142" x2="465" y2="70" stroke="#7c3aed" strokeWidth="3" strokeDasharray="10 7" /><line x1="130" y1="300" x2="465" y2="70" stroke="#e11d48" strokeWidth="5" /><DiagramPoint at={[130, 70]} label="A" dx={-14} dy={-10} /><DiagramPoint at={[130, 300]} label="A′" dx={-16} dy={14} tone="proof" /><DiagramPoint at={[465, 142]} label="B" dx={15} dy={0} /><DiagramPoint at={[465, 70]} label="B′" dx={17} dy={-9} tone="proof" /><DiagramPoint at={[203, 250]} label="P" dx={0} dy={21} tone="accent" /><DiagramPoint at={[414, 105]} label="Q" dx={0} dy={-15} tone="accent" /></g>
}
