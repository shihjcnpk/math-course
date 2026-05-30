import type { ReactNode } from 'react'

interface Props { phase: number; playing: boolean }

function cls(phase: number, target: number, playing: boolean) {
  if (phase < target) return 'anim-hidden'
  return phase === target && playing ? 'animate-fade-in' : 'anim-visible'
}

function TextLabel({
  x,
  y,
  children,
  fill = '#334155',
  size = 14,
}: {
  x: number
  y: number
  children: ReactNode
  fill?: string
  size?: number
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fill={fill} fontWeight="bold">
      {children}
    </text>
  )
}

function Note({ lines, y = 22 }: { lines: string[]; y?: number }) {
  return (
    <g>
      <rect x={85} y={y} width={530} height={lines.length === 1 ? 34 : 54} rx={8} fill="#fff7ed" stroke="#fdba74" />
      {lines.map((line, index) => (
        <text
          key={line}
          x={350}
          y={y + 22 + index * 19}
          textAnchor="middle"
          fontSize={13}
          fill={index === 0 ? '#9a3412' : '#334155'}
          fontWeight={index === 0 ? 'bold' : 500}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

function NumberLine({ y, originX, unit, from = -5, to = 5 }: { y: number; originX: number; unit: number; from?: number; to?: number }) {
  const ticks = Array.from({ length: to - from + 1 }, (_, i) => i + from)
  return (
    <g>
      <line x1={originX + from * unit - 35} y1={y} x2={originX + to * unit + 35} y2={y} stroke="#64748b" strokeWidth={2} />
      <polygon points={`${originX + to * unit + 41},${y} ${originX + to * unit + 29},${y - 6} ${originX + to * unit + 29},${y + 6}`} fill="#64748b" />
      {ticks.map((n) => {
        const x = originX + n * unit
        return (
          <g key={n}>
            <line x1={x} y1={y - 8} x2={x} y2={y + 8} stroke={n === 0 ? '#2563eb' : '#cbd5e1'} strokeWidth={n === 0 ? 2.5 : 1.5} />
            <text x={x} y={y + 28} textAnchor="middle" fontSize={12} fill={n === 0 ? '#2563eb' : '#64748b'}>{n}</text>
          </g>
        )
      })}
    </g>
  )
}

export function AbsoluteValueDistance({ phase, playing }: Props) {
  const originX = 340
  const unit = 48
  const y = 145
  const aX = originX - 4 * unit
  const bX = originX + 3 * unit

  return (
    <svg viewBox="0 0 700 280" className="w-full max-w-2xl">
      <Note lines={phase < 2 ? ['绝对值不是“去掉负号”', '它表示数轴上点到原点或两点之间的距离'] : ['距离只有长度，没有方向', '所以绝对值的结果一定大于或等于 0']} />
      <NumberLine y={y} originX={originX} unit={unit} />
      <g className={cls(phase, 0, playing)}>
        <circle cx={aX} cy={y} r={8} fill="#ef4444" />
        <TextLabel x={aX} y={y - 22} fill="#ef4444">a = -4</TextLabel>
        <line x1={aX} y1={y - 42} x2={originX} y2={y - 42} stroke="#ef4444" strokeWidth={3} />
        <TextLabel x={(aX + originX) / 2} y={y - 55} fill="#ef4444">|-4| = 4</TextLabel>
      </g>
      {phase >= 1 && (
        <g className={cls(phase, 1, playing)}>
          <circle cx={bX} cy={y} r={8} fill="#16a34a" />
          <TextLabel x={bX} y={y - 22} fill="#16a34a">b = 3</TextLabel>
          <line x1={aX} y1={y + 50} x2={bX} y2={y + 50} stroke="#8b5cf6" strokeWidth={3} />
          <TextLabel x={(aX + bX) / 2} y={y + 77} fill="#6d28d9">|-4 - 3| = 7</TextLabel>
        </g>
      )}
      {phase >= 2 && <TextLabel x={350} y={260} fill="#1d4ed8">核心：绝对值 = 距离，距离不可能为负</TextLabel>}
    </svg>
  )
}

export function ExponentiationBrackets({ phase, playing }: Props) {
  return (
    <svg viewBox="0 0 700 300" className="w-full max-w-2xl">
      <Note lines={['括号决定“谁是底数”', '底数不同，平方的对象就不同']} />
      <g className={cls(phase, 0, playing)}>
        <rect x={70} y={85} width={260} height={120} rx={8} fill="#eff6ff" stroke="#3b82f6" />
        <TextLabel x={200} y={122} fill="#1d4ed8" size={20}>(-2)^2</TextLabel>
        <text x={200} y={158} textAnchor="middle" fontSize={20} fill="#1e293b">(-2) x (-2)</text>
        <TextLabel x={200} y={190} fill="#16a34a">= 4</TextLabel>
        <TextLabel x={200} y={230} fill="#1d4ed8" size={13}>底数是整个 -2</TextLabel>
      </g>
      {phase >= 1 && (
        <g className={cls(phase, 1, playing)}>
          <rect x={370} y={85} width={260} height={120} rx={8} fill="#fef2f2" stroke="#ef4444" />
          <TextLabel x={500} y={122} fill="#b91c1c" size={20}>-2^2</TextLabel>
          <text x={500} y={158} textAnchor="middle" fontSize={20} fill="#1e293b">-(2 x 2)</text>
          <TextLabel x={500} y={190} fill="#ef4444">= -4</TextLabel>
          <TextLabel x={500} y={230} fill="#b91c1c" size={13}>底数只是 2，负号在外面</TextLabel>
        </g>
      )}
      {phase >= 2 && <TextLabel x={350} y={275} fill="#b45309">少一个括号，底数就变了，结果可能相反</TextLabel>}
    </svg>
  )
}

export function BalanceScale({ phase, playing }: Props) {
  const move = phase === 1 ? 8 : phase === 2 ? -8 : 0

  return (
    <svg viewBox="0 0 700 340" className="w-full max-w-2xl">
      <Note lines={['等式像平衡的天平', '两边做同样的合法操作，平衡不变']} />
      <line x1={350} y1={94} x2={350} y2={230} stroke="#475569" strokeWidth={4} />
      <line x1={210} y1={124} x2={490} y2={124} stroke="#475569" strokeWidth={4} />
      <line x1={210} y1={124} x2={165} y2={192 + move} stroke="#94a3b8" strokeWidth={2} />
      <line x1={210} y1={124} x2={255} y2={192 + move} stroke="#94a3b8" strokeWidth={2} />
      <line x1={490} y1={124} x2={445} y2={192 + move} stroke="#94a3b8" strokeWidth={2} />
      <line x1={490} y1={124} x2={535} y2={192 + move} stroke="#94a3b8" strokeWidth={2} />
      <ellipse cx={210} cy={204 + move} rx={72} ry={18} fill="#dbeafe" stroke="#2563eb" strokeWidth={2} />
      <ellipse cx={490} cy={204 + move} rx={72} ry={18} fill="#dcfce7" stroke="#16a34a" strokeWidth={2} />
      <TextLabel x={210} y={208 + move} fill="#1d4ed8">x + 3</TextLabel>
      <TextLabel x={490} y={208 + move} fill="#15803d">8</TextLabel>
      {phase >= 1 && (
        <g className={cls(phase, phase, playing)}>
          <rect x={150} y={260} width={400} height={46} rx={8} fill="#f8fafc" stroke="#cbd5e1" />
          <TextLabel x={350} y={280} fill="#334155" size={13}>
            {phase === 1 ? '两边同时加 2：左盘和右盘都变重，仍相等' : phase === 2 ? '两边同时减 2：左盘和右盘都变轻，仍相等' : phase === 3 ? '两边同乘或同除非零数：等价关系不变' : '解方程的本质：每一步都保持等式等价'}
          </TextLabel>
          <TextLabel x={350} y={299} fill="#1d4ed8" size={13}>注意：除法时不能除以 0</TextLabel>
        </g>
      )}
    </svg>
  )
}

export function InequalityFlip({ phase, playing }: Props) {
  const y = 150
  const oneX = phase >= 1 ? 280 : 420
  const twoX = phase >= 1 ? 210 : 490

  return (
    <svg viewBox="0 0 700 280" className="w-full max-w-2xl">
      <Note lines={['乘以负数会把数轴上的左右顺序反过来', '顺序反了，不等号方向也必须反']} />
      <NumberLine y={y} originX={350} unit={70} from={-3} to={3} />
      <g className={phase >= 1 && playing ? 'animate-fade-in' : 'anim-visible'}>
        <circle cx={oneX} cy={y} r={9} fill="#2563eb" />
        <TextLabel x={oneX} y={y - 24} fill="#2563eb">{phase >= 1 ? '-1' : '1'}</TextLabel>
        <circle cx={twoX} cy={y} r={9} fill="#ef4444" />
        <TextLabel x={twoX} y={y - 24} fill="#ef4444">{phase >= 1 ? '-2' : '2'}</TextLabel>
      </g>
      <TextLabel x={350} y={242} fill={phase >= 2 ? '#1d4ed8' : '#334155'}>
        {phase === 0 ? '原来：1 < 2' : phase === 1 ? '同乘 -1 后：-1 在 -2 的右边' : '所以：1 < 2 变成 -1 > -2'}
      </TextLabel>
    </svg>
  )
}

export function TriangleAngleSum({ phase, playing }: Props) {
  return (
    <svg viewBox="0 0 700 320" className="w-full max-w-2xl">
      <Note lines={['把三个内角搬到同一直线上', '拼成一个平角，所以三角形内角和是 180 度']} />
      <polygon points="150,225 300,86 430,225" fill="#eff6ff" stroke="#2563eb" strokeWidth={3} />
      <TextLabel x={155} y={242} fill="#ef4444">A</TextLabel>
      <TextLabel x={300} y={78} fill="#16a34a">B</TextLabel>
      <TextLabel x={435} y={242} fill="#f59e0b">C</TextLabel>
      {phase >= 1 && (
        <g className={cls(phase, 1, playing)}>
          <path d="M150 225 Q185 195 205 225" fill="none" stroke="#ef4444" strokeWidth={5} />
          <path d="M300 86 Q288 128 328 132" fill="none" stroke="#16a34a" strokeWidth={5} />
          <path d="M430 225 Q390 193 382 225" fill="none" stroke="#f59e0b" strokeWidth={5} />
        </g>
      )}
      {phase >= 2 && (
        <g className={cls(phase, 2, playing)}>
          <line x1={150} y1={285} x2={550} y2={285} stroke="#334155" strokeWidth={3} />
          <path d="M238 285 Q285 245 330 285" fill="none" stroke="#ef4444" strokeWidth={6} />
          <path d="M315 285 Q350 238 385 285" fill="none" stroke="#16a34a" strokeWidth={6} />
          <path d="M370 285 Q420 245 470 285" fill="none" stroke="#f59e0b" strokeWidth={6} />
        </g>
      )}
      {phase >= 3 && <TextLabel x={350} y={312} fill="#1d4ed8">∠A + ∠B + ∠C = 180°</TextLabel>}
    </svg>
  )
}

export function CongruentOverlay({ phase, playing }: Props) {
  const offset = phase >= 1 ? 120 : 260
  const rotation = phase >= 2 ? 0 : -12

  return (
    <svg viewBox="0 0 700 320" className="w-full max-w-2xl">
      <Note lines={['全等的本质：能通过平移、旋转或翻折完全重合', '重合后对应边相等，对应角相等']} />
      <polygon points="210,225 290,100 390,225" fill="#dbeafe" stroke="#2563eb" strokeWidth={3} />
      <TextLabel x={278} y={248} fill="#1d4ed8" size={13}>三角形 1</TextLabel>
      <g transform={`translate(${offset},0) rotate(${rotation} 290 165)`} className={phase >= 1 && playing ? 'animate-fade-in' : 'anim-visible'}>
        <polygon points="210,225 290,100 390,225" fill="#dcfce7" fillOpacity={0.72} stroke="#16a34a" strokeWidth={3} />
      </g>
      <TextLabel x={350} y={292} fill="#334155">
        {phase === 0 ? '两个图形形状、大小相同，但位置不同' : phase === 1 ? '先平移，让它们靠近' : phase === 2 ? '再旋转，使对应边对齐' : '完全重合，说明两个三角形全等'}
      </TextLabel>
    </svg>
  )
}

export function AxisSymmetryFold({ phase, playing }: Props) {
  const rightOpacity = phase >= 3 ? 0.35 : 1

  return (
    <svg viewBox="0 0 700 320" className="w-full max-w-2xl">
      <Note lines={['轴对称有两个判断点', '折叠后重合；对应点连线被对称轴垂直平分']} />
      <line x1={350} y1={82} x2={350} y2={265} stroke="#2563eb" strokeWidth={3} strokeDasharray="8,5" />
      <TextLabel x={350} y={292} fill="#2563eb">对称轴</TextLabel>
      <polygon points="250,105 150,190 250,250" fill="#fee2e2" stroke="#ef4444" strokeWidth={3} />
      <polygon points="450,105 550,190 450,250" fill="#dcfce7" stroke="#16a34a" strokeWidth={3} opacity={rightOpacity} />
      {phase >= 2 && (
        <g className={cls(phase, 2, playing)}>
          <line x1={250} y1={105} x2={450} y2={105} stroke="#94a3b8" strokeDasharray="6,4" />
          <line x1={250} y1={250} x2={450} y2={250} stroke="#94a3b8" strokeDasharray="6,4" />
          <TextLabel x={350} y={100} fill="#64748b" size={12}>对应点连线被对称轴垂直平分</TextLabel>
        </g>
      )}
      {phase >= 3 && (
        <g className={cls(phase, 3, playing)} transform="translate(200,0) scale(-1,1) translate(-700,0)">
          <polygon points="450,105 550,190 450,250" fill="#dcfce7" fillOpacity={0.65} stroke="#16a34a" strokeWidth={3} />
        </g>
      )}
    </svg>
  )
}

export function PythagoreanTiles({ phase, playing }: Props) {
  return (
    <svg viewBox="0 0 700 360" className="w-full max-w-2xl">
      <Note lines={['勾股定理连接“边长”和“面积”', '直角边平方和等于斜边平方：a^2 + b^2 = c^2']} />
      <rect x={185} y={85} width={250} height={250} fill="#f8fafc" stroke="#334155" strokeWidth={3} />
      <polygon points="185,85 305,85 185,205" fill="#dbeafe" stroke="#2563eb" />
      <polygon points="435,85 435,205 315,85" fill="#dcfce7" stroke="#16a34a" />
      <polygon points="435,335 315,335 435,215" fill="#fee2e2" stroke="#ef4444" />
      <polygon points="185,335 185,215 305,335" fill="#fef3c7" stroke="#f59e0b" />
      <TextLabel x={240} y={155} fill="#334155" size={12}>直角三角形</TextLabel>
      {phase >= 1 && (
        <g className={cls(phase, 1, playing)}>
          <rect x={185} y={215} width={120} height={120} fill="#bfdbfe" fillOpacity={0.65} stroke="#2563eb" strokeWidth={2} />
          <rect x={315} y={105} width={100} height={100} fill="#bbf7d0" fillOpacity={0.65} stroke="#16a34a" strokeWidth={2} />
          <TextLabel x={245} y={282} fill="#1d4ed8">a^2</TextLabel>
          <TextLabel x={365} y={160} fill="#15803d">b^2</TextLabel>
        </g>
      )}
      {phase >= 2 && (
        <g className={cls(phase, 2, playing)}>
          <polygon points="305,85 435,205 315,335 185,215" fill="#ede9fe" fillOpacity={0.7} stroke="#7c3aed" strokeWidth={3} />
          <TextLabel x={310} y={225} fill="#6d28d9">c^2</TextLabel>
        </g>
      )}
      {phase >= 3 && <TextLabel x={525} y={218} fill="#1d4ed8">面积关系：a^2 + b^2 = c^2</TextLabel>}
    </svg>
  )
}

export function ParallelogramDrag({ phase, playing }: Props) {
  const shift = phase >= 1 ? 65 : 18
  return (
    <svg viewBox="0 0 700 320" className="w-full max-w-2xl">
      <Note lines={['拖动顶点时，图形会变形', '但平行四边形的核心性质保持不变']} />
      <polygon points={`${210 + shift},100 505,100 ${505 - shift},235 210,235`} fill="#eff6ff" stroke="#2563eb" strokeWidth={3} />
      <line x1={210 + shift} y1={100} x2={505 - shift} y2={235} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6,4" />
      <line x1={505} y1={100} x2={210} y2={235} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6,4" />
      <circle cx={210 + shift} cy={100} r={8} fill="#ef4444" className={phase >= 1 && playing ? 'animate-pop-in' : ''} />
      {phase >= 2 && (
        <g className={cls(phase, 2, playing)}>
          <TextLabel x={350} y={278} fill="#1d4ed8">对边平行且相等</TextLabel>
          <TextLabel x={350} y={300} fill="#6d28d9">对角线互相平分</TextLabel>
        </g>
      )}
    </svg>
  )
}

export function CoordinatePointMove({ phase, playing }: Props) {
  const origin = { x: 330, y: 200 }
  const unit = 36
  const point = phase >= 1 ? { x: 3, y: 2 } : { x: -2, y: -1 }
  const px = origin.x + point.x * unit
  const py = origin.y - point.y * unit

  return (
    <svg viewBox="0 0 700 330" className="w-full max-w-2xl">
      <Note lines={['点的位置由两个数确定', '横坐标看左右，纵坐标看上下']} />
      <line x1={120} y1={origin.y} x2={585} y2={origin.y} stroke="#334155" strokeWidth={2} />
      <line x1={origin.x} y1={75} x2={origin.x} y2={280} stroke="#334155" strokeWidth={2} />
      <polygon points="591,200 579,194 579,206" fill="#334155" />
      <polygon points="330,69 324,81 336,81" fill="#334155" />
      <TextLabel x={598} y={218} fill="#64748b" size={12}>x</TextLabel>
      <TextLabel x={344} y={74} fill="#64748b" size={12}>y</TextLabel>
      <line x1={px} y1={py} x2={px} y2={origin.y} stroke="#94a3b8" strokeDasharray="5,4" />
      <line x1={px} y1={py} x2={origin.x} y2={py} stroke="#94a3b8" strokeDasharray="5,4" />
      <circle cx={px} cy={py} r={9} fill="#2563eb" className={playing ? 'animate-pop-in' : ''} />
      <TextLabel x={px} y={py - 18} fill="#2563eb">P({point.x}, {point.y})</TextLabel>
      {phase >= 2 && <TextLabel x={350} y={310} fill="#1d4ed8">到 x 轴的距离 = |y|，到 y 轴的距离 = |x|</TextLabel>}
    </svg>
  )
}

export function CoordinateTranslation({ phase, playing }: Props) {
  const dx = phase >= 1 ? 150 : 0
  const dy = phase >= 2 ? -55 : 0
  const original = '210,225 280,110 355,225'
  const moved = `${210 + dx},${225 + dy} ${280 + dx},${110 + dy} ${355 + dx},${225 + dy}`

  return (
    <svg viewBox="0 0 700 330" className="w-full max-w-2xl">
      <defs>
        <marker id="coord-translation-arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#f59e0b" />
        </marker>
      </defs>
      <Note lines={['平移只改变位置，不改变形状和大小', '每个点都按同一个坐标规则变化']} />
      <polygon points={original} fill="#dbeafe" stroke="#2563eb" strokeWidth={3} />
      <TextLabel x={280} y={250} fill="#1d4ed8" size={13}>原图形</TextLabel>
      {phase >= 1 && (
        <g className={cls(phase, 1, playing)}>
          <polygon points={moved} fill="#dcfce7" fillOpacity={0.75} stroke="#16a34a" strokeWidth={3} />
          <line x1={280} y1={182} x2={280 + dx} y2={182 + dy} stroke="#f59e0b" strokeWidth={3} markerEnd="url(#coord-translation-arrow)" />
          <TextLabel x={455} y={258} fill="#15803d">平移后</TextLabel>
        </g>
      )}
      {phase >= 3 && <TextLabel x={350} y={310} fill="#1d4ed8">向右 a、向上 b：每个点 (x,y) → (x+a, y+b)</TextLabel>}
    </svg>
  )
}

export function TwoLinesIntersection({ phase, playing }: Props) {
  return (
    <svg viewBox="0 0 700 340" className="w-full max-w-2xl">
      <Note lines={['方程组的解对应两条直线的交点', '因为交点坐标同时满足两个方程']} />
      <line x1={100} y1={260} x2={610} y2={260} stroke="#334155" strokeWidth={2} />
      <line x1={220} y1={80} x2={220} y2={295} stroke="#334155" strokeWidth={2} />
      <line x1={130} y1={275} x2={560} y2={85} stroke="#2563eb" strokeWidth={3} />
      <line x1={130} y1={85} x2={560} y2={275} stroke="#ef4444" strokeWidth={3} />
      <TextLabel x={530} y={98} fill="#2563eb" size={13}>直线 1</TextLabel>
      <TextLabel x={530} y={270} fill="#ef4444" size={13}>直线 2</TextLabel>
      {phase >= 1 && (
        <g className={cls(phase, 1, playing)}>
          <circle cx={345} cy={180} r={10} fill="#16a34a" />
          <TextLabel x={345} y={158} fill="#15803d">交点 P(2,1)</TextLabel>
        </g>
      )}
      {phase >= 2 && <TextLabel x={350} y={320} fill="#1d4ed8">P 同时在两条直线上，所以 P 同时满足两个方程</TextLabel>}
    </svg>
  )
}

export function VarianceScatter({ phase, playing }: Props) {
  const compact = [260, 300, 340, 380, 420]
  const loose = [170, 250, 340, 470, 550]
  return (
    <svg viewBox="0 0 700 330" className="w-full max-w-2xl">
      <Note lines={['平均数相同，不代表数据一样稳定', '看每个数据离平均数有多远，就是在看分散程度']} />
      <line x1={130} y1={145} x2={570} y2={145} stroke="#94a3b8" strokeWidth={2} />
      <line x1={130} y1={230} x2={570} y2={230} stroke="#94a3b8" strokeWidth={2} />
      <line x1={340} y1={110} x2={340} y2={255} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6,4" />
      <TextLabel x={340} y={105} fill="#b45309">平均数</TextLabel>
      {compact.map((x) => <circle key={x} cx={x} cy={145} r={8} fill="#2563eb" className={playing && phase === 0 ? 'animate-pop-in' : ''} />)}
      {phase >= 1 && loose.map((x) => <circle key={x} cx={x} cy={230} r={8} fill="#ef4444" className={playing && phase === 1 ? 'animate-pop-in' : ''} />)}
      <TextLabel x={80} y={151} fill="#2563eb">A组</TextLabel>
      <TextLabel x={80} y={236} fill="#ef4444">B组</TextLabel>
      {phase >= 3 && <TextLabel x={350} y={305} fill="#1d4ed8">B组离平均数更远，方差更大，波动更明显</TextLabel>}
    </svg>
  )
}

export function MeanDynamic({ phase, playing }: Props) {
  const values = phase >= 1 ? [4, 5, 6, 7, 18] : [4, 5, 6, 7, 8]
  const mean = values.reduce((sum, n) => sum + n, 0) / values.length
  const meanX = 120 + mean * 24
  const medianX = 120 + 6 * 24

  return (
    <svg viewBox="0 0 700 310" className="w-full max-w-2xl">
      <Note lines={['平均数会受每个数据影响', '一个极端值会明显把平均数拉过去']} />
      <line x1={110} y1={165} x2={610} y2={165} stroke="#94a3b8" strokeWidth={2} />
      {values.map((n, index) => {
        const x = 120 + n * 24
        return (
          <g key={`${n}-${index}`}>
            <circle cx={x} cy={165} r={8} fill={n >= 18 ? '#ef4444' : '#2563eb'} className={playing ? 'animate-pop-in' : ''} />
            <text x={x} y={194} textAnchor="middle" fontSize={12} fill="#64748b">{n}</text>
          </g>
        )
      })}
      <line x1={meanX} y1={112} x2={meanX} y2={210} stroke="#16a34a" strokeWidth={3} />
      <TextLabel x={meanX} y={104} fill="#15803d">平均数 {mean.toFixed(1)}</TextLabel>
      {phase >= 2 && (
        <g className={cls(phase, 2, playing)}>
          <line x1={medianX} y1={125} x2={medianX} y2={205} stroke="#8b5cf6" strokeWidth={3} strokeDasharray="6,4" />
          <TextLabel x={medianX} y={230} fill="#6d28d9">中位数 6</TextLabel>
        </g>
      )}
      {phase >= 3 && <TextLabel x={350} y={285} fill="#1d4ed8">结论：有极端值时，中位数通常比平均数更稳定</TextLabel>}
    </svg>
  )
}
