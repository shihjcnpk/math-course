interface Props {
  value: number    // 0-100
  size?: 'sm' | 'md' | 'lg'
  color?: string
  showLabel?: boolean
}

export default function ProgressBar({ value, size = 'md', color = 'bg-primary-500', showLabel = false }: Props) {
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5'

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-500 w-10 text-right">{value}%</span>
      )}
    </div>
  )
}
