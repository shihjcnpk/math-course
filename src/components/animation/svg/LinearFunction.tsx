interface Props { phase: number; playing: boolean }

export default function LinearFunction({ phase, playing }: Props) {
  const originX = 200
  const originY = 230
  const unitSize = 35
  const gridLines = Array.from({ length: 21 }, (_, i) => i - 10)

  const kValues = [1, 2, 0.5, -1]
  const bValues = [0, 3, -2]
  const kIdx = Math.min(phase, kValues.length - 1)
  const k = phase <= 3 ? kValues[kIdx] : kValues[0]
  const b = phase >= 4 ? bValues[Math.min(phase - 4, bValues.length - 1)] : 0

  const f = (x: number) => k * x + b
  const x1 = -8
  const x2 = 8
  const toX = (x: number) => originX + x * unitSize
  const toY = (y: number) => originY - y * unitSize

  const explanation = phase <= 3
    ? k > 1 ? '|k| > 1：直线更陡，仍向右上升'
      : k === 1 ? 'k = 1：基准直线，每右走 1 格上升 1 格'
        : k > 0 ? '0 < k < 1：直线更平缓，仍向右上升'
          : 'k < 0：直线向右下降'
    : b > 0 ? 'b > 0：直线整体向上平移'
      : b < 0 ? 'b < 0：直线整体向下平移'
        : 'b = 0：直线经过原点'

  return (
    <svg viewBox="0 0 650 400" className="w-full max-w-2xl">
      <rect x={270} y={14} width={340} height={54} rx={8} fill="#fff7ed" stroke="#fdba74" />
      <text x={440} y={36} textAnchor="middle" fontSize={13} fill="#9a3412" fontWeight="bold">
        y = kx + b：k 控制倾斜，b 控制上下平移
      </text>
      <text x={440} y={56} textAnchor="middle" fontSize={12} fill="#334155">
        {explanation}
      </text>

      {gridLines.map((i) => {
        const x = toX(i)
        const y = toY(i)
        return (
          <g key={i}>
            {x > 20 && x < 630 && (
              <line x1={x} y1={toY(8)} x2={x} y2={toY(-8)} stroke="#e2e8f0" strokeWidth={0.5} />
            )}
            {y > 80 && y < 390 && (
              <line x1={toX(-8)} y1={y} x2={toX(8)} y2={y} stroke="#e2e8f0" strokeWidth={0.5} />
            )}
          </g>
        )
      })}

      <line x1={toX(-8.5)} y1={originY} x2={toX(8.5)} y2={originY} stroke="#1e293b" strokeWidth={2} />
      <line x1={originX} y1={toY(4)} x2={originX} y2={toY(-4.5)} stroke="#1e293b" strokeWidth={2} />
      <polygon points={`${toX(8.5)},${originY} ${toX(8.5)-8},${originY-3} ${toX(8.5)-8},${originY+3}`} fill="#1e293b" />
      <polygon points={`${originX},${toY(4)} ${originX-3},${toY(4)+8} ${originX+3},${toY(4)+8}`} fill="#1e293b" />
      <text x={toX(8.5) + 5} y={originY + 4} fontSize={12} fill="#64748b">x</text>
      <text x={originX + 5} y={toY(4) - 8} fontSize={12} fill="#64748b">y</text>
      <text x={originX - 10} y={originY + 15} fontSize={12} fill="#94a3b8">O</text>

      <line
        x1={toX(x1)} y1={toY(f(x1))}
        x2={toX(x2)} y2={toY(f(x2))}
        stroke="#6366f1"
        strokeWidth={3}
        strokeLinecap="round"
        className={playing ? 'animate-fade-in' : ''}
      />

      <text x={420} y={108} fontSize={26} fill="#1e293b" fontFamily="monospace" fontWeight="bold">
        y = <tspan fill="#3b82f6">{k === 1 && b === 0 ? 'x' : `${k}x`}</tspan>
        {b !== 0 && <tspan fill="#16a34a">{b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`}</tspan>}
      </text>

      {phase <= 3 && (
        <g>
          <line x1={toX(0)} y1={toY(0)} x2={toX(1)} y2={toY(0)} stroke="#f59e0b" strokeWidth={3} />
          <line x1={toX(1)} y1={toY(0)} x2={toX(1)} y2={toY(k)} stroke="#f59e0b" strokeWidth={3} />
          <text x={toX(1) + 35} y={toY(k / 2)} fontSize={12} fill="#b45309" fontWeight="bold">
            斜率 k = 上升量 / 水平量
          </text>
        </g>
      )}

      {b !== 0 && (
        <g>
          <circle cx={toX(0)} cy={toY(b)} r={6} fill="#22c55e" className="animate-pop-in" />
          <text x={toX(0) + 18} y={toY(b) + 4} fontSize={12} fill="#15803d" fontWeight="bold">
            截距 b
          </text>
        </g>
      )}

      <text x={325} y={386} textAnchor="middle" fontSize={12} fill="#64748b">
        观察顺序：先看 k 的正负和大小，再看 b 与 y 轴交点
      </text>
    </svg>
  )
}
