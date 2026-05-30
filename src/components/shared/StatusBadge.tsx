import type { LectureStatus } from '@/types'
import { getStatusInfo } from '@/utils/progress'

interface Props {
  status: LectureStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const info = getStatusInfo(status)
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass} ${info.bgColor} ${info.color}`}>
      <span className="text-[10px]">{info.icon}</span>
      {info.label}
    </span>
  )
}
