import type { LectureStatus } from '@/types'
import { lectureRegistry } from '@/data/lectures'

/** Compute overall course progress percentage */
export function computeProgress(statuses: Record<number, LectureStatus>): {
  total: number
  completed: number
  mastered: number
  percentage: number
} {
  const total = lectureRegistry.length
  let completed = 0
  let mastered = 0

  for (const lecture of lectureRegistry) {
    const status = statuses[lecture.id]
    if (status === 'mastered' || status === 'in-progress' || status === 'needs-review') {
      completed++
    }
    if (status === 'mastered') {
      mastered++
    }
  }

  return {
    total,
    completed,
    mastered,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

/** Get status display info */
export function getStatusInfo(status: LectureStatus): {
  label: string
  color: string
  bgColor: string
  icon: string
} {
  const map: Record<LectureStatus, { label: string; color: string; bgColor: string; icon: string }> = {
    'not-started': { label: '未学', color: 'text-gray-400', bgColor: 'bg-gray-100', icon: '○' },
    'in-progress': { label: '学习中', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '▶' },
    'needs-review': { label: '待复习', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: '↻' },
    'error-prone': { label: '易错', color: 'text-red-600', bgColor: 'bg-red-100', icon: '⚠' },
    'mastered': { label: '已掌握', color: 'text-green-600', bgColor: 'bg-green-100', icon: '✓' },
  }
  return map[status]
}
