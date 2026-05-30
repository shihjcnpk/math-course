interface Props { phase: number; playing: boolean }

export default function NumberLineOps({ phase, playing }: Props) {
  const startX = 400
  const unitSize = 40
  const startNum = 3
  const addAmount = 5
  const subAmount = 4

  const startPos = startX + startNum * unitSize
  const addEndPos = startPos + addAmount * unitSize
  const subEndPos = addEndPos - subAmount * unitSize
  const ticks = Array.from({ length: 21 }, (_, i) => i - 10)

  return (
    <svg viewBox="0 0 800 230" className="w-full max-w-2xl">
      <rect x={145} y={12} width={510} height={38} rx={8} fill="#fff7ed" stroke="#fdba74" />
      <text x={400} y={36} textAnchor="middle" fontSize={14} fill="#9a3412" fontWeight="bold">
        数轴运算：加正数向右，减正数向左；终点就是结果
      </text>

      <line x1={30} y1={112} x2={770} y2={112} stroke="#94a3b8" strokeWidth={2} />
      <polygon points="775,112 765,107 765,117" fill="#94a3b8" />

      {ticks.map((n) => {
        const x = startX + n * unitSize
        if (x < 30 || x > 770) return null
        return (
          <g key={n}>
            <line x1={x} y1={102} x2={x} y2={122} stroke="#cbd5e1" strokeWidth={n === 0 ? 2 : 1} />
            <text x={x} y={n === 0 ? 96 : 142} textAnchor="middle" fontSize={12} fill={n === 0 ? '#ef4444' : '#64748b'}>
              {n}
            </text>
          </g>
        )
      })}

      <g className={phase === 0 && playing ? 'animate-pop-in' : 'anim-visible'}>
        <circle cx={startPos} cy={112} r={8} fill="#3b82f6" />
        <text x={startPos} y={87} textAnchor="middle" fontSize={14} fill="#3b82f6" fontWeight="bold">
          起点：{startNum}
        </text>
      </g>

      {phase >= 1 && (
        <g className={phase === 1 && playing ? 'animate-fade-in' : 'anim-visible'}>
          <line x1={startPos} y1={92} x2={addEndPos} y2={92} stroke="#22c55e" strokeWidth={3} markerEnd="url(#arrowGreen)" />
          <text x={(startPos + addEndPos) / 2} y={78} textAnchor="middle" fontSize={13} fill="#16a34a" fontWeight="bold">
            +{addAmount}：向右移动 {addAmount} 格
          </text>
          <circle cx={addEndPos} cy={112} r={8} fill="#22c55e" className="animate-pop-in" />
          <text x={addEndPos} y={87} textAnchor="middle" fontSize={14} fill="#16a34a" fontWeight="bold">
            {startNum + addAmount}
          </text>
        </g>
      )}

      {phase >= 2 && (
        <g className={phase === 2 && playing ? 'animate-fade-in' : 'anim-visible'}>
          <line x1={addEndPos} y1={132} x2={subEndPos} y2={132} stroke="#ef4444" strokeWidth={3} markerEnd="url(#arrowRed)" />
          <text x={(addEndPos + subEndPos) / 2} y={158} textAnchor="middle" fontSize={13} fill="#ef4444" fontWeight="bold">
            -{subAmount}：向左移动 {subAmount} 格
          </text>
          <circle cx={subEndPos} cy={112} r={8} fill="#ef4444" className="animate-pop-in" />
          <text x={subEndPos} y={87} textAnchor="middle" fontSize={14} fill="#ef4444" fontWeight="bold">
            {startNum + addAmount - subAmount}
          </text>
        </g>
      )}

      {phase >= 3 && (
        <g className="animate-fade-in">
          <text x={400} y={194} textAnchor="middle" fontSize={16} fill="#1d4ed8" fontWeight="bold">
            {startNum} + {addAmount} - {subAmount} = {startNum + addAmount - subAmount}
          </text>
          <text x={400} y={214} textAnchor="middle" fontSize={12} fill="#64748b">
            先看方向，再数单位长度，最后读出终点
          </text>
        </g>
      )}

      <defs>
        <marker id="arrowGreen" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#22c55e" />
        </marker>
        <marker id="arrowRed" viewBox="0 0 10 10" refX={0} refY={5} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M10,0 L0,5 L10,10 Z" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  )
}
