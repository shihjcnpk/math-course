import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { REVIEW_SCHEDULE, REVIEW_STAGES } from '@/data/adhd-support'
import { buildReviewQueue } from '@/utils/review'
import { useStore } from '@/store'
import type { ErrorEntry, ReviewStage } from '@/types'
import MathText from '@/components/shared/MathText'

interface Props {
  errors: ErrorEntry[]
}

export default function ReviewQueue({ errors }: Props) {
  const markReviewStage = useStore((state) => state.markReviewStage)
  const buckets = useMemo(() => buildReviewQueue(errors), [errors])
  const dueCount = REVIEW_STAGES.reduce((sum, stage) => sum + buckets[stage].length, 0)

  return (
    <section className="mb-6 rounded-xl border border-purple-200 bg-purple-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-purple-950">今日间隔复习</h2>
          <p className="text-xs text-purple-700">每道错题一次只完成当前最早到期阶段。</p>
        </div>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-purple-700">{dueCount} 项待复习</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-5">
        {REVIEW_STAGES.map((stage) => (
          <ReviewBucket
            key={stage}
            stage={stage}
            errors={buckets[stage]}
            onMark={(errorId, outcome) => markReviewStage(errorId, stage, outcome)}
          />
        ))}
      </div>
    </section>
  )
}

function ReviewBucket({
  stage,
  errors,
  onMark,
}: {
  stage: ReviewStage
  errors: ErrorEntry[]
  onMark: (errorId: string, outcome: 'correct' | 'needs-work') => void
}) {
  const rule = REVIEW_SCHEDULE[stage]

  const stagePrompt = (error: ErrorEntry) => {
    if (stage === 'D0') return error.problemDescription
    if (stage === 'D1') return `进入第${error.lectureId}讲“基础巩固”，另选1道同知识点基础题，不看原解独立完成。`
    if (stage === 'D3') return `进入第${error.lectureId}讲“能力提升/知识迁移”，完成1道条件或问法发生变化的同类题。`
    if (stage === 'D7') return `先口头判断本题题型与第一步，再把它混入第${error.lectureId}讲其他题型中完成。`
    return `不看错题卡，完成第${error.lectureId}讲1道综合或迁移题，并说出原错因是否再次出现。`
  }

  return (
    <div className="rounded-lg border border-purple-100 bg-white p-3">
      <p className="text-xs font-bold text-purple-800">{rule.output_slot}</p>
      <p className="text-[11px] text-gray-500">{stage} · {rule.name}</p>
      <p className="mt-1 text-[11px] text-gray-500">{rule.task}</p>

      {errors.length === 0 ? (
        <p className="mt-3 text-xs text-gray-300">暂无</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {errors.map((error) => (
            <li key={error.id} className="border-t border-gray-100 pt-2 first:border-0 first:pt-0">
              <Link to={'/lectures/' + error.lectureId} className="text-xs font-medium text-primary-700 hover:underline">
                第{error.lectureId}讲
              </Link>
              <p className="mt-1 text-xs text-gray-600"><MathText>{stagePrompt(error)}</MathText></p>
              <div className="mt-2 flex gap-1">
                <button type="button" onClick={() => onMark(error.id, 'correct')} className="rounded bg-green-50 px-2 py-1 text-[10px] text-green-700 hover:bg-green-100">
                  独立做对
                </button>
                <button type="button" onClick={() => onMark(error.id, 'needs-work')} className="rounded bg-amber-50 px-2 py-1 text-[10px] text-amber-700 hover:bg-amber-100">
                  仍需回补
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
