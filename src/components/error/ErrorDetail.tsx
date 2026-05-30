import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ErrorEntry } from '@/types'
import { useStore } from '@/store'
import { useBreakpointDiagnosis } from '@/hooks/useBreakpointDiagnosis'
import BreakpointChain from './BreakpointChain'
import ReviewRecommendation from './ReviewRecommendation'
import MathText from '@/components/shared/MathText'

interface Props {
  entry: ErrorEntry
  onToggleResolved: () => void
  onToggleReMastered: () => void
  onDelete: () => void
}

/**
 * Full expanded error detail view.
 *
 * Shows:
 *   - Original problem description
 *   - Wrong answer vs correct answer
 *   - User's self-identified error reason
 *   - Auto-generated BreakpointChain (prerequisite chain visualization)
 *   - ReviewRecommendation (prioritized review plan)
 *   - Mark-as-resolved / Re-mastered toggle buttons
 *   - Diagnose button (to manually trigger/retrigger diagnosis)
 */
export default function ErrorDetail({ entry, onToggleResolved, onToggleReMastered, onDelete }: Props) {
  const navigate = useNavigate()
  const conceptMastery = useStore((s) => s.progress.conceptMastery)
  const { runDiagnosis } = useBreakpointDiagnosis()
  const [diagnosing, setDiagnosing] = useState(false)

  const handleDiagnose = useCallback(() => {
    if (!entry.conceptId) return
    setDiagnosing(true)
    // Small delay for visual feedback
    setTimeout(() => {
      runDiagnosis(entry.id, entry.conceptId)
      setDiagnosing(false)
    }, 300)
  }, [entry.id, entry.conceptId, runDiagnosis])

  const handleNavigate = useCallback(
    (lectureId: number) => {
      navigate(`/lectures/${lectureId}`)
    },
    [navigate],
  )

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Problem details grid */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {/* Error reason */}
        <DetailRow label="错误原因" value={entry.userNote || '未记录'} />

        {/* Wrong answer */}
        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
          <span className="text-xs font-medium text-red-600">错误答案</span>
          <p className="text-sm text-red-700 mt-0.5"><MathText>{entry.wrongAnswer || '未填写'}</MathText></p>
        </div>

        {/* Correct answer */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <span className="text-xs font-medium text-green-600">正确答案</span>
          <p className="text-sm text-green-700 mt-0.5"><MathText>{entry.correctAnswer || '未填写'}</MathText></p>
        </div>

        {/* Navigation to original lecture */}
        <button
          onClick={() => handleNavigate(entry.lectureId)}
          className="text-xs text-gray-500 hover:text-primary-600 text-left"
        >
          来自：第{entry.lectureId}讲 <MathText>{entry.lectureTitle}</MathText> →
        </button>
      </div>

      {/* Diagnosis section */}
      {entry.diagnosis && entry.diagnosis.identifiedBreakpoints.length > 0 ? (
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-amber-800">知识断点诊断</span>
            <button
              onClick={handleDiagnose}
              disabled={diagnosing}
              className="text-[10px] text-amber-600 hover:text-amber-700 underline disabled:opacity-50"
            >
              {diagnosing ? '诊断中...' : '重新诊断'}
            </button>
          </div>

          <p className="text-xs text-amber-600 mb-3">
            这道题表面上错在"{entry.diagnosis.surfaceConceptName}"，但真正需要回补的是：
          </p>

          {/* Breakpoint prerequisite chain */}
          <BreakpointChain diagnosis={entry.diagnosis} conceptMastery={conceptMastery} />

          {/* Prioritized review recommendations */}
          <ReviewRecommendation breakpoints={entry.diagnosis.identifiedBreakpoints} />
        </div>
      ) : entry.conceptId ? (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">尚未诊断知识断点</p>
            <button
              onClick={handleDiagnose}
              disabled={diagnosing}
              className="text-xs px-3 py-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {diagnosing ? '诊断中...' : '🔍 自动诊断'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-400">缺少知识点关联，无法诊断</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
        {/* Mark as resolved */}
        <button
          onClick={onToggleResolved}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            entry.resolved
              ? 'border-green-300 text-green-600 bg-green-50'
              : 'border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600'
          }`}
        >
          {entry.resolved ? '✓ 已解决' : '标记已解决'}
        </button>

        {/* Re-mastered toggle */}
        <button
          onClick={onToggleReMastered}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            entry.reMastered
              ? 'border-blue-300 text-blue-600 bg-blue-50'
              : 'border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          {entry.reMastered ? '✓ 已重学掌握' : '标记已重学掌握'}
        </button>

        {/* Navigate to review lecture (from diagnosis) */}
        {entry.diagnosis?.identifiedBreakpoints?.[0] && (
          <button
            onClick={() => handleNavigate(entry.diagnosis!.identifiedBreakpoints[0].reviewLectureId)}
            className="text-xs px-3 py-1.5 rounded-full border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors"
          >
            去回补第{entry.diagnosis.identifiedBreakpoints[0].reviewLectureId}讲 →
          </button>
        )}

        {/* Delete */}
        <button
          onClick={onDelete}
          className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 ml-auto"
        >
          删除
        </button>
      </div>
    </div>
  )
}

/** Simple label-value row */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <p className="text-sm text-gray-700 mt-0.5"><MathText>{value}</MathText></p>
    </div>
  )
}
