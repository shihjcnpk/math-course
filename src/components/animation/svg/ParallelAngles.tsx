interface Props { phase: number; playing: boolean }

export default function ParallelAngles({ phase, playing }: Props) {
  const visible = (p: number) => phase >= p ? 'anim-visible' : 'anim-hidden'
  const anim = (p: number) => phase === p && playing ? 'animate-fade-in' : visible(p)

  const leftX = 100
  const rightX = 600
  const topY = 95
  const bottomY = 285
  const transTopX = 250
  const transBottomX = 450

  return (
    <svg viewBox="0 0 700 380" className="w-full max-w-2xl">
      <rect x={70} y={12} width={560} height={42} rx={8} fill="#fff7ed" stroke="#fdba74" />
      <text x={350} y={38} textAnchor="middle" fontSize={14} fill="#9a3412" fontWeight="bold">
        两直线平行时，同位角和内错角相等，同旁内角互补
      </text>

      <line x1={leftX} y1={topY} x2={rightX} y2={topY} stroke="#1e293b" strokeWidth={2.5} />
      <text x={leftX - 18} y={topY - 10} fontSize={13} fill="#64748b">l1</text>
      <line x1={leftX} y1={bottomY} x2={rightX} y2={bottomY} stroke="#1e293b" strokeWidth={2.5} />
      <text x={leftX - 18} y={bottomY - 10} fontSize={13} fill="#64748b">l2</text>

      <text x={610} y={topY - 8} fontSize={13} fill="#64748b">l1 ∥ l2</text>
      <line x1={transTopX} y1={topY - 30} x2={transBottomX} y2={bottomY + 30} stroke="#6366f1" strokeWidth={2} strokeDasharray="6,3" />
      <text x={transTopX - 38} y={topY - 35} fontSize={13} fill="#6366f1">截线</text>

      <g className={anim(0)}>
        {[
          { x: transTopX + 22, y: topY - 5, n: '1' },
          { x: transTopX + 33, y: topY + 23, n: '2' },
          { x: transTopX + 8, y: topY + 28, n: '3' },
          { x: transTopX - 15, y: topY - 5, n: '4' },
          { x: transBottomX + 22, y: bottomY - 5, n: '5' },
          { x: transBottomX + 33, y: bottomY + 23, n: '6' },
          { x: transBottomX + 8, y: bottomY + 28, n: '7' },
          { x: transBottomX - 15, y: bottomY - 5, n: '8' },
        ].map((a) => (
          <text key={a.n} x={a.x} y={a.y} fontSize={13} fill="#475569" fontWeight="bold">
            {a.n}
          </text>
        ))}
      </g>

      {phase >= 1 && (
        <g className={anim(1)}>
          <circle cx={transTopX + 25} cy={topY - 2} r={14} fill="none" stroke="#3b82f6" strokeWidth={2} className={playing ? 'animate-pulse-highlight' : ''} />
          <circle cx={transBottomX + 25} cy={bottomY - 2} r={14} fill="none" stroke="#3b82f6" strokeWidth={2} className={playing ? 'animate-pulse-highlight' : ''} />
          <text x={350} y={334} textAnchor="middle" fontSize={13} fill="#2563eb" fontWeight="bold">
            同位角：∠1 = ∠5，它们在同一相对位置
          </text>
        </g>
      )}

      {phase >= 2 && (
        <g className={anim(2)}>
          <circle cx={transTopX + 14} cy={topY + 24} r={14} fill="none" stroke="#22c55e" strokeWidth={2} className={playing ? 'animate-pulse-highlight' : ''} />
          <circle cx={transBottomX + 25} cy={bottomY - 2} r={14} fill="none" stroke="#22c55e" strokeWidth={2} className={playing ? 'animate-pulse-highlight' : ''} />
          <text x={350} y={334} textAnchor="middle" fontSize={13} fill="#16a34a" fontWeight="bold">
            内错角：∠3 = ∠5，它们在两条平行线内部、截线两侧
          </text>
        </g>
      )}

      {phase >= 3 && (
        <g className={anim(3)}>
          <circle cx={transTopX + 14} cy={topY + 24} r={14} fill="none" stroke="#f59e0b" strokeWidth={2} className={playing ? 'animate-pulse-highlight' : ''} />
          <circle cx={transBottomX + 35} cy={bottomY + 18} r={14} fill="none" stroke="#f59e0b" strokeWidth={2} className={playing ? 'animate-pulse-highlight' : ''} />
          <text x={350} y={334} textAnchor="middle" fontSize={13} fill="#b45309" fontWeight="bold">
            同旁内角：∠3 + ∠6 = 180°，它们互补
          </text>
        </g>
      )}

      {phase >= 4 && (
        <text x={350} y={362} textAnchor="middle" fontSize={13} fill="#1d4ed8" fontWeight="bold">
          识别口诀：先看平行线内外，再看截线同侧还是两侧
        </text>
      )}
    </svg>
  )
}
