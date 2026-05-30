import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { BreakpointDiagnosis } from '@/types'

interface Props {
  /** The identified breakpoints to generate recommendations from */
  breakpoints: BreakpointDiagnosis['identifiedBreakpoints']
}

const CONFIDENCE_CONFIG: Record<string, { label: string; color: string; order: number }> = {
  high: { label: '高', color: 'bg-red-100 text-red-700', order: 0 },
  medium: { label: '中', color: 'bg-amber-100 text-amber-700', order: 1 },
  low: { label: '低', color: 'bg-blue-100 text-blue-700', order: 2 },
}

interface ReviewItem {
  conceptName: string
  lectureId: number
  reason: string
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Generates a prioritized review plan from breakpoint diagnosis results.
 *
 * Orders recommendations by confidence (high first), then by lecture.
 * Each recommendation shows:
 *   "建议先复习第X讲：XXX（因为...）"
 *
 * Clicking navigates to the recommended lecture.
 */
export default function ReviewRecommendation({ breakpoints }: Props) {
  const recommendations = useMemo(() => buildRecommendations(breakpoints), [breakpoints])

  if (recommendations.length === 0) return null

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-blue-700 mb-3">回补建议</h4>

      <ol className="space-y-2">
        {recommendations.map((item, idx) => {
          const cfg = CONFIDENCE_CONFIG[item.confidence]

          return (
            <li key={`${item.lectureId}-${idx}`} className="flex items-start gap-2">
              {/* Priority number */}
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {idx + 1}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">建议先复习</span>
                  <Link
                    to={`/lectures/${item.lectureId}`}
                    className="text-sm font-medium text-primary-600 hover:underline"
                  >
                    第{item.lectureId}讲：{item.conceptName}
                  </Link>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${cfg.color}`}>
                    {cfg.label}置信度
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 ml-0">{item.reason}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/**
 * Build a deduplicated, prioritized list of review recommendations.
 *
 * Deduplication: if two breakpoints map to the same lecture, keep the one
 * with higher confidence.
 */
function buildRecommendations(
  breakpoints: BreakpointDiagnosis['identifiedBreakpoints'],
): ReviewItem[] {
  // Deduplicate by lectureId, keeping highest confidence
  const byLecture = new Map<number, ReviewItem>()

  for (const bp of breakpoints) {
    const existing = byLecture.get(bp.reviewLectureId)
    const currentOrder = CONFIDENCE_CONFIG[bp.confidence]?.order ?? 2
    const existingOrder = existing ? (CONFIDENCE_CONFIG[existing.confidence]?.order ?? 2) : 999

    if (!existing || currentOrder < existingOrder) {
      byLecture.set(bp.reviewLectureId, {
        conceptName: bp.conceptName,
        lectureId: bp.reviewLectureId,
        reason: bp.reason,
        confidence: bp.confidence,
      })
    }
  }

  // Sort: confidence order, then lecture ID
  return Array.from(byLecture.values()).sort((a, b) => {
    const orderA = CONFIDENCE_CONFIG[a.confidence]?.order ?? 2
    const orderB = CONFIDENCE_CONFIG[b.confidence]?.order ?? 2
    if (orderA !== orderB) return orderA - orderB
    return a.lectureId - b.lectureId
  })
}
