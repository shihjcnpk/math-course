interface Props { phase: number; playing: boolean }

export default function BracketRemoval({ phase, playing }: Props) {
  const visible = (p: number) => phase >= p ? 'anim-visible' : 'anim-hidden'
  const anim = (p: number) => phase === p && playing ? 'animate-fade-in' : visible(p)

  return (
    <svg viewBox="0 0 700 280" className="w-full max-w-2xl">
      <rect x={110} y={14} width={480} height={42} rx={8} fill="#fff7ed" stroke="#fdba74" />
      <text x={350} y={40} textAnchor="middle" fontSize={14} fill="#9a3412" fontWeight="bold">
        括号前是负号：括号内每一项都要变号
      </text>

      <g className={anim(0)}>
        <text x={350} y={92} textAnchor="middle" fontSize={28} fill="#1e293b" fontFamily="monospace">
          3x - <tspan fill="#ef4444">(</tspan>2x - 5<tspan fill="#ef4444">)</tspan>
        </text>
      </g>

      {phase >= 1 && (
        <g className={anim(1)}>
          <rect x={222} y={65} width={34} height={34} rx={5} fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} />
          <text x={239} y={90} textAnchor="middle" fontSize={24} fill="#b45309" fontFamily="monospace">-</text>
          <text x={350} y={124} textAnchor="middle" fontSize={13} fill="#b45309" fontWeight="bold">
            这个负号不是只管第一项，而是作用到整个括号
          </text>
        </g>
      )}

      {phase >= 2 && (
        <g className={anim(2)}>
          <path d="M240 100 C260 128, 290 134, 315 108" fill="none" stroke="#f59e0b" strokeWidth={2} markerEnd="url(#minusArrow)" />
          <path d="M240 100 C280 150, 360 150, 394 108" fill="none" stroke="#f59e0b" strokeWidth={2} markerEnd="url(#minusArrow)" />
          <text x={350} y={160} textAnchor="middle" fontSize={14} fill="#b45309" fontWeight="bold">
            -(2x) = -2x，-(-5) = +5
          </text>
        </g>
      )}

      {phase >= 3 && (
        <g className={anim(3)}>
          <text x={350} y={202} textAnchor="middle" fontSize={26} fill="#1e293b" fontFamily="monospace">
            3x <tspan fill="#ef4444">- 2x</tspan> <tspan fill="#16a34a">+ 5</tspan>
          </text>
          <text x={350} y={228} textAnchor="middle" fontSize={13} fill="#64748b">
            先变号，再合并同类项
          </text>
        </g>
      )}

      {phase >= 4 && (
        <g className={phase === 4 && playing ? 'animate-pop-in' : 'anim-visible'}>
          <text x={350} y={262} textAnchor="middle" fontSize={24} fill="#1d4ed8" fontFamily="monospace" fontWeight="bold">
            3x - 2x + 5 = x + 5
          </text>
        </g>
      )}

      <defs>
        <marker id="minusArrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#f59e0b" />
        </marker>
      </defs>
    </svg>
  )
}
