interface Props { phase: number; playing: boolean }

function stageClass(phase: number, target: number, playing: boolean) {
  if (phase < target) return 'anim-hidden'
  return phase === target && playing ? 'animate-fade-in' : 'anim-visible'
}

function Label({
  x,
  y,
  children,
  fill = '#334155',
  size = 14,
}: {
  x: number
  y: number
  children: string
  fill?: string
  size?: number
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fill={fill} fontWeight="bold">
      {children}
    </text>
  )
}

function Note({ lines }: { lines: string[] }) {
  return (
    <g>
      <rect x={82} y={18} width={536} height={54} rx={8} fill="#fff7ed" stroke="#fdba74" />
      {lines.map((line, index) => (
        <text
          key={line}
          x={350}
          y={41 + index * 20}
          textAnchor="middle"
          fontSize={14}
          fill={index === 0 ? '#9a3412' : '#334155'}
          fontWeight={index === 0 ? 'bold' : 500}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

export default function ReflectionShortestPath({ phase, playing }: Props) {
  const riverY = 190
  const a = { x: 130, y: 92 }
  const b = { x: 535, y: 112 }
  const reflectedA = { x: a.x, y: riverY * 2 - a.y }

  const t = (riverY - reflectedA.y) / (b.y - reflectedA.y)
  const p = {
    x: reflectedA.x + (b.x - reflectedA.x) * t,
    y: riverY,
  }

  return (
    <svg viewBox="0 0 700 380" className="w-full max-w-2xl">
      <defs>
        <marker id="reflection-arrow-blue" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#2563eb" />
        </marker>
        <marker id="reflection-arrow-green" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#16a34a" />
        </marker>
      </defs>

      {phase === 0 && <Note lines={['目标：从 A 出发，到河岸 l 饮水一次，再到 B', '问题：河岸上的点 P 选在哪里，AP + PB 最短？']} />}
      {phase === 1 && <Note lines={['关键转化：把河岸 l 当镜面', '作 A 关于 l 的对称点 A′，则任意 P 都有 AP = A′P']} />}
      {phase === 2 && <Note lines={['化折为直：连接 A′B', 'A′B 与河岸 l 的交点就是最佳饮水点 P']} />}
      {phase >= 3 && <Note lines={['证明：AP + PB = A′P + PB', 'A′、P、B 共线时最短，所以原折线路径最短']} />}

      <rect x={58} y={riverY - 11} width={584} height={22} rx={11} fill="#dbeafe" />
      <line x1={58} y1={riverY} x2={642} y2={riverY} stroke="#2563eb" strokeWidth={3} />
      <Label x={620} y={riverY - 18} fill="#1d4ed8">河岸 l / 镜面</Label>

      <g className={stageClass(phase, 0, playing)}>
        <circle cx={a.x} cy={a.y} r={9} fill="#ef4444" />
        <Label x={a.x} y={a.y - 18} fill="#dc2626">A 将军</Label>
        <circle cx={b.x} cy={b.y} r={9} fill="#f59e0b" />
        <Label x={b.x} y={b.y - 18} fill="#b45309">B 马</Label>
        <line x1={a.x} y1={a.y} x2={250} y2={riverY} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5,5" />
        <line x1={250} y1={riverY} x2={b.x} y2={b.y} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5,5" />
        <Label x={262} y={riverY + 28} fill="#64748b" size={13}>随便选 P：不一定最短</Label>
      </g>

      {phase >= 1 && (
        <g className={stageClass(phase, 1, playing)}>
          <line x1={a.x} y1={a.y} x2={reflectedA.x} y2={reflectedA.y} stroke="#7c3aed" strokeWidth={2} strokeDasharray="6,4" />
          <circle cx={reflectedA.x} cy={reflectedA.y} r={9} fill="#8b5cf6" />
          <Label x={reflectedA.x} y={reflectedA.y + 27} fill="#6d28d9">A′ 影子</Label>
          <Label x={a.x + 92} y={riverY - 30} fill="#6d28d9" size={13}>A 与 A′ 关于 l 对称</Label>
          <Label x={a.x + 78} y={riverY + 44} fill="#6d28d9" size={13}>对任意 P：AP = A′P</Label>
        </g>
      )}

      {phase >= 2 && (
        <g className={stageClass(phase, 2, playing)}>
          <line
            x1={reflectedA.x}
            y1={reflectedA.y}
            x2={b.x}
            y2={b.y}
            stroke="#16a34a"
            strokeWidth={3}
            markerEnd="url(#reflection-arrow-green)"
          />
          <circle cx={p.x} cy={p.y} r={10} fill="#16a34a" className="animate-pop-in" />
          <Label x={p.x} y={p.y - 18} fill="#15803d">P 最佳饮水点</Label>
          <Label x={410} y={330} fill="#15803d" size={13}>P 是直线 A′B 与河岸 l 的交点</Label>
        </g>
      )}

      {phase >= 3 && (
        <g className={stageClass(phase, 3, playing)}>
          <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke="#2563eb" strokeWidth={4} markerEnd="url(#reflection-arrow-blue)" />
          <line x1={p.x} y1={p.y} x2={b.x} y2={b.y} stroke="#2563eb" strokeWidth={4} markerEnd="url(#reflection-arrow-blue)" />
          <line x1={reflectedA.x} y1={reflectedA.y} x2={p.x} y2={p.y} stroke="#8b5cf6" strokeWidth={2} strokeDasharray="6,4" />
          <rect x={134} y={346} width={432} height={24} rx={6} fill="#eff6ff" stroke="#bfdbfe" />
          <Label x={350} y={363} fill="#1d4ed8" size={13}>核心口诀：化折为直，先作对称点，再连直线找交点</Label>
        </g>
      )}
    </svg>
  )
}
