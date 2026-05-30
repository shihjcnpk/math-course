import { useState, useCallback } from 'react'
import type { LectureExercise } from '@/types'
import { useStore } from '@/store'
import { useBreakpointDiagnosis } from '@/hooks/useBreakpointDiagnosis'
import { getNodeById } from '@/data/knowledge-nodes'
import MathText from '@/components/shared/MathText'

interface Props {
  basic: LectureExercise[]
  intermediate: LectureExercise[]
  challenge: LectureExercise[]
  knowledgeTransfer: LectureExercise[]
  lectureId: number
  lectureTitle: string
}

type Tier = 'basic' | 'intermediate' | 'challenge' | 'transfer'

const TIER_CONFIG: Record<Tier, { label: string; pct: string; color: string; bg: string }> = {
  basic: { label: '基础巩固', pct: '60%', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  intermediate: { label: '能力提升', pct: '30%', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  challenge: { label: '挑战拓展', pct: '10%', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  transfer: { label: '知识迁移', pct: '', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
}

export default function ExerciseSection({ basic, intermediate, challenge, knowledgeTransfer, lectureId, lectureTitle }: Props) {
  const [activeTier, setActiveTier] = useState<Tier>('basic')
  const [reportFeedback, setReportFeedback] = useState<string | null>(null)
  const addError = useStore((s) => s.addError)
  const { runDiagnosis } = useBreakpointDiagnosis()

  const tiers: Record<Tier, LectureExercise[]> = {
    basic, intermediate, challenge,
    transfer: knowledgeTransfer,
  }
  const current = tiers[activeTier]

  const handleReportError = useCallback(
    (ex: LectureExercise) => {
      const conceptId = ex.flaggedConceptIds[0] || ''
      const conceptNode = conceptId ? getNodeById(conceptId) : null
      const conceptName = conceptNode?.name || ''

      addError({
        lectureId,
        lectureTitle,
        problemDescription: ex.question,
        wrongAnswer: '',
        correctAnswer: ex.answer,
        conceptId,
        conceptName,
        errorType: '练习错题',
        userNote: '',
      })

      if (conceptId) {
        const state = useStore.getState()
        const latestError = state.errors[0]
        if (latestError) {
          const diagnosis = runDiagnosis(latestError.id, conceptId)

          if (diagnosis.identifiedBreakpoints.length > 0) {
            const topBp = diagnosis.identifiedBreakpoints[0]
            setReportFeedback(
              `已记录错题。真正需要回补的是：第${topBp.reviewLectureId}讲 ${topBp.conceptName}`,
            )
          } else {
            setReportFeedback('已记录错题。未检测到明显知识断点，建议复习本题涉及的知识点。')
          }
          setTimeout(() => setReportFeedback(null), 5000)
        }
      } else {
        setReportFeedback('已记录错题。缺少知识点关联，暂时无法自动诊断。')
        setTimeout(() => setReportFeedback(null), 5000)
      }
    },
    [lectureId, lectureTitle, addError, runDiagnosis],
  )

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">分层训练</h2>

      {reportFeedback && (
        <div className="mb-3 px-3 py-2 text-xs rounded-lg bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
          {reportFeedback}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(TIER_CONFIG) as Tier[]).map((t) => {
          const cfg = TIER_CONFIG[t]
          const count = tiers[t].length
          if (!count) return null
          return (
            <button
              key={t}
              onClick={() => setActiveTier(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                activeTier === t ? `${cfg.bg} ${cfg.color}` : 'bg-white border-gray-200 text-gray-500'
              }`}
            >
              {cfg.label} {cfg.pct && `(${cfg.pct})`} · {count}题
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        {current.map((ex, i) => (
          <ExerciseCard key={ex.id || i} exercise={ex} index={i} onReportError={() => handleReportError(ex)} />
        ))}
      </div>
    </section>
  )
}

function ExerciseCard({ exercise: ex, index, onReportError }: { exercise: LectureExercise; index: number; onReportError: () => void }) {
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 mb-3 leading-relaxed"><MathText>{ex.question}</MathText></p>
          {ex.knowledgeChain && ex.knowledgeChain.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {ex.knowledgeChain.map((k, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">
                  <MathText>{k}</MathText>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            {ex.hint && (
              <button onClick={() => setShowHint(!showHint)} className="text-xs text-amber-600 hover:text-amber-700">
                {showHint ? '隐藏提示' : '查看提示'}
              </button>
            )}
            <button onClick={() => setShowAnswer(!showAnswer)} className="text-xs text-green-600 hover:text-green-700">
              {showAnswer ? '隐藏答案' : '查看答案'}
            </button>
            <button onClick={onReportError} className="text-xs text-red-500 hover:text-red-600 ml-auto">
              记录错题
            </button>
          </div>
          {showHint && ex.hint && (
            <p className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded leading-relaxed"><MathText>{ex.hint}</MathText></p>
          )}
          {showAnswer && (
            <p className="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded leading-relaxed"><MathText>{ex.answer}</MathText></p>
          )}
        </div>
      </div>
    </div>
  )
}
