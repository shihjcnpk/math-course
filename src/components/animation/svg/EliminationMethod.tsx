interface Props { phase: number; playing: boolean }

export default function EliminationMethod({ phase, playing }: Props) {
  const visible = (p: number) => phase >= p ? 'anim-visible' : 'anim-hidden'
  const anim = (p: number) => phase === p && playing ? 'animate-fade-in' : visible(p)

  return (
    <svg viewBox="0 0 650 370" className="w-full max-w-2xl">
      <rect x={80} y={14} width={490} height={42} rx={8} fill="#fff7ed" stroke="#fdba74" />
      <text x={325} y={40} textAnchor="middle" fontSize={14} fill="#9a3412" fontWeight="bold">
        消元法：让一个未知数的系数互为相反数，相加后抵消
      </text>

      <g className={anim(0)}>
        <text x={325} y={90} textAnchor="middle" fontSize={26} fill="#1e293b" fontFamily="monospace">
          2x + <tspan fill="#3b82f6">y</tspan> = 7
        </text>
        <text x={325} y={130} textAnchor="middle" fontSize={26} fill="#1e293b" fontFamily="monospace">
          x <tspan fill="#ef4444">- y</tspan> = 2
        </text>
      </g>

      {phase >= 1 && (
        <g className={anim(1)}>
          <rect x={380} y={67} width={28} height={28} rx={4} fill="#dbeafe" stroke="#3b82f6" />
          <rect x={356} y={107} width={48} height={28} rx={4} fill="#fee2e2" stroke="#ef4444" />
          <text x={325} y={164} textAnchor="middle" fontSize={14} fill="#6366f1" fontWeight="bold">
            y 的系数是 +1 和 -1，互为相反数
          </text>
        </g>
      )}

      {phase >= 2 && (
        <g className={anim(2)}>
          <line x1={90} y1={185} x2={560} y2={185} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,3" />
          <text x={325} y={214} textAnchor="middle" fontSize={15} fill="#334155" fontFamily="monospace">
            (2x + x) + (y - y) = 7 + 2
          </text>
        </g>
      )}

      {phase >= 3 && (
        <g className={anim(3)}>
          <text x={325} y={252} textAnchor="middle" fontSize={24} fill="#1e293b" fontFamily="monospace">
            3x + <tspan fill="#94a3b8" textDecoration="line-through">0</tspan> = 9
          </text>
          <text x={325} y={282} textAnchor="middle" fontSize={24} fill="#16a34a" fontFamily="monospace" fontWeight="bold">
            x = 3
          </text>
        </g>
      )}

      {phase >= 4 && (
        <g className={anim(4)}>
          <text x={325} y={316} textAnchor="middle" fontSize={14} fill="#64748b">
            把 x = 3 代入 2x + y = 7：6 + y = 7
          </text>
          <text x={325} y={344} textAnchor="middle" fontSize={22} fill="#16a34a" fontFamily="monospace" fontWeight="bold">
            y = 1
          </text>
        </g>
      )}

      {phase >= 5 && (
        <g className={phase === 5 && playing ? 'animate-pop-in' : 'anim-visible'}>
          <text x={325} y={365} textAnchor="middle" fontSize={14} fill="#1d4ed8" fontWeight="bold">
            方程组的解是 x = 3，y = 1
          </text>
        </g>
      )}
    </svg>
  )
}
