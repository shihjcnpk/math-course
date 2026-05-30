import { Link } from 'react-router-dom'
import type { LectureMeta } from '@/types'
import { useStore } from '@/store'
import { getAnimationsForLecture } from '@/data/animation-registry'
import { hasAnimationComponent } from '@/components/animation/animation-components'
import StatusBadge from './StatusBadge'
import MathText from './MathText'

interface Props {
  lecture: LectureMeta
}

export default function LectureCard({ lecture }: Props) {
  const status = useStore((s) => s.progress.lectureStatuses[lecture.id] || 'not-started')
  const hasAnimations = getAnimationsForLecture(lecture.id).some((anim) => hasAnimationComponent(anim.id))

  return (
    <Link
      to={`/lectures/${lecture.id}`}
      className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all bg-white"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm">
            第{lecture.id}讲：<MathText>{lecture.title}</MathText>
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2"><MathText>{lecture.oneLineMainIdea}</MathText></p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {hasAnimations && (
            <span className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-2 py-0.5 text-xs font-semibold text-fuchsia-700">
              动图演示
            </span>
          )}
          <StatusBadge status={status} size="sm" />
        </div>
      </div>
    </Link>
  )
}
