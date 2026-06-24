import type { LectureMeta, LectureStatus } from '@/types'
import { lectureRegistry } from '@/data/lectures'

/** Compute overall course progress percentage */
export function computeProgress(
  statuses: Record<number, LectureStatus>,
  lectures: LectureMeta[] = lectureRegistry,
): {
  total: number
  started: number
  mastered: number
  percentage: number
} {
  const total = lectures.length
  let started = 0
  let mastered = 0

  for (const lecture of lectures) {
    const status = statuses[lecture.id]
    if (status && status !== 'not-started') {
      started++
    }
    if (status === 'mastered') {
      mastered++
    }
  }

  return {
    total,
    started,
    mastered,
    percentage: total > 0 ? Math.round((mastered / total) * 100) : 0,
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
