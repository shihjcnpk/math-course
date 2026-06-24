import { useState, useCallback } from 'react'
import type { LectureExercise } from '@/types'
import { useStore } from '@/store'
import { useBreakpointDiagnosis } from '@/hooks/useBreakpointDiagnosis'
import { getNodeById } from '@/data/knowledge-nodes'
import { ERROR_TYPES } from '@/data/adhd-support'
import MathText from '@/components/shared/MathText'
import GeometryExampleDiagram from '@/components/lecture/GeometryExampleDiagram'

interface Props {
  basic: LectureExercise[]
  intermediate: LectureExercise[]
  challenge: LectureExercise[]
  knowledgeTransfer: LectureExercise[]
  lectureId: number
  lectureTitle: string
}

type Tier = 'basic' | 'intermediate' | 'challenge' | 'transfer'

interface ErrorReportPayload {
  wrongAnswer: string
  errorTypeId: string
  secondaryErrorTypeId?: string
  userNote: string
}

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
    (ex: LectureExercise, report: ErrorReportPayload) => {
      const conceptId = ex.flaggedConceptIds[0] || ''
      const conceptNode = conceptId ? getNodeById(conceptId) : null
      const conceptName = conceptNode?.name || ''
      const selectedErrorType = ERROR_TYPES.find((item) => item.id === report.errorTypeId)

      addError({
        lectureId,
        lectureTitle,
        problemDescription: ex.question,
        wrongAnswer: report.wrongAnswer,
        correctAnswer: ex.answer,
        conceptId,
        conceptName,
        errorType: selectedErrorType?.name || '未分类',
        errorTypeId: selectedErrorType?.id,
        secondaryErrorTypeId: report.secondaryErrorTypeId || undefined,
        userNote: report.userNote,
        reminderSentence: selectedErrorType?.reminder_sentence,
        sourceExerciseId: ex.id,
      })

      if (conceptId) {
        const state = useStore.getState()
        const latestError = state.errors[0]
        if (latestError) {
          const diagnosis = runDiagnosis(latestError.id, conceptId)

          if (diagnosis.identifiedBreakpoints.length > 0) {
            const topBp = diagnosis.identifiedBreakpoints[0]
            setReportFeedback(
              topBp.confidence === 'low'
                ? `已记录错题。尚无已确认断点，建议先自测：第${topBp.reviewLectureId}讲 ${topBp.conceptName}`
                : `已记录错题。已发现薄弱前置：第${topBp.reviewLectureId}讲 ${topBp.conceptName}`,
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
    <section className="mb-8" data-exercise-section>
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
          <ExerciseCard key={ex.id || i} exercise={ex} index={i} lectureId={lectureId} onReportError={(report) => handleReportError(ex, report)} />
        ))}
      </div>
    </section>
  )
}

function ExerciseCard({
  exercise: ex,
  index,
  lectureId,
  onReportError,
}: {
  exercise: LectureExercise
  index: number
  lectureId: number
  onReportError: (report: ErrorReportPayload) => void
}) {
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)
  const [wrongAnswer, setWrongAnswer] = useState('')
  const [errorTypeId, setErrorTypeId] = useState(ERROR_TYPES[0]?.id || '')
  const [secondaryErrorTypeId, setSecondaryErrorTypeId] = useState('')
  const [userNote, setUserNote] = useState('')
  const selectedErrorType = ERROR_TYPES.find((item) => item.id === errorTypeId)

  const submitReport = () => {
    if (!wrongAnswer.trim() || !errorTypeId || !userNote.trim()) return
    onReportError({ wrongAnswer: wrongAnswer.trim(), errorTypeId, secondaryErrorTypeId, userNote: userNote.trim() })
    setShowReportForm(false)
    setWrongAnswer('')
    setUserNote('')
    setSecondaryErrorTypeId('')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4" data-exercise-card>
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 mb-3 leading-relaxed" data-exercise-question><MathText>{ex.question}</MathText></p>
          <GeometryExampleDiagram lectureId={lectureId} problem={ex.question} context="exercise" diagramId={`exercise-${ex.id}`} />
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
            <button type="button" onClick={() => setShowReportForm(!showReportForm)} className="text-xs text-red-500 hover:text-red-600 ml-auto">
              {showReportForm ? '取消记录' : '记录错题'}
            </button>
          </div>
          {showHint && ex.hint && (
            <p className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded leading-relaxed"><MathText>{ex.hint}</MathText></p>
          )}
          {showAnswer && (
            <div className="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded leading-relaxed">
              <MathText>{ex.answer}</MathText>
              <GeometryExampleDiagram lectureId={lectureId} problem={ex.question} context="answer" diagramId={`answer-${ex.id}`} />
            </div>
          )}
          {showReportForm && (
            <div className="mt-3 space-y-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-semibold text-red-800">保留原错误，再做具体分类</p>
              <label className="block text-xs text-gray-700">
                我的错误答案或错误过程
                <textarea
                  value={wrongAnswer}
                  onChange={(event) => setWrongAnswer(event.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded border border-red-200 bg-white px-2 py-1.5 text-sm focus:border-red-300 focus:outline-none"
                  placeholder="不要抄正确答案，写下当时真实的错误过程"
                />
              </label>
              <label className="block text-xs text-gray-700">
                次要错因（可选）
                <select
                  value={secondaryErrorTypeId}
                  onChange={(event) => setSecondaryErrorTypeId(event.target.value)}
                  className="mt-1 w-full rounded border border-red-200 bg-white px-2 py-1.5 text-sm"
                >
                  <option value="">无</option>
                  {ERROR_TYPES.filter((item) => item.id !== errorTypeId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <label className="block text-xs text-gray-700">
                主要错因
                <select
                  value={errorTypeId}
                  onChange={(event) => setErrorTypeId(event.target.value)}
                  className="mt-1 w-full rounded border border-red-200 bg-white px-2 py-1.5 text-sm"
                >
                  {ERROR_TYPES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <label className="block text-xs text-gray-700">
                我为什么会错（一句具体原因）
                <input
                  value={userNote}
                  onChange={(event) => setUserNote(event.target.value)}
                  className="mt-1 w-full rounded border border-red-200 bg-white px-2 py-1.5 text-sm focus:border-red-300 focus:outline-none"
                  placeholder="例如：去括号时只改了第一项符号"
                />
              </label>
              {selectedErrorType && (
                <p className="rounded bg-white px-2 py-1.5 text-xs text-blue-700">
                  下次提醒：{selectedErrorType.reminder_sentence}
                </p>
              )}
              <button
                type="button"
                onClick={submitReport}
                disabled={!wrongAnswer.trim() || !errorTypeId || !userNote.trim()}
                className="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                保存错题并自动诊断
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
