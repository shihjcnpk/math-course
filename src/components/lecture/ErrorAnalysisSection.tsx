import type { LectureMistake } from '@/types'
import MathText from '@/components/shared/MathText'
import { ERROR_FOUR_QUESTIONS } from '@/data/adhd-support'

interface Props { mistakes: LectureMistake[] }

export default function ErrorAnalysisSection({ mistakes }: Props) {
  if (!mistakes.length) return null
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">高频易错点</h2>
      <div className="space-y-3">
        {mistakes.map((m, i) => (
          <div key={i} className="bg-white rounded-lg border border-red-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-red-50 rounded border border-red-100">
                <p className="font-medium text-red-700 mb-1">错误做法</p>
                <p className="text-gray-700 leading-relaxed"><MathText>{m.wrongExample}</MathText></p>
                <p className="text-xs text-red-500 mt-1 leading-relaxed">原因：<MathText>{m.wrongReason}</MathText></p>
              </div>
              <div className="p-3 bg-green-50 rounded border border-green-100">
                <p className="font-medium text-green-700 mb-1">正确做法</p>
                <p className="text-gray-700 leading-relaxed"><MathText>{m.correctApproach}</MathText></p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed"><MathText>{m.relatedReminder}</MathText></p>
            <details className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <summary className="cursor-pointer text-xs font-semibold text-amber-800">错题四问：订正后再回答</summary>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-gray-700">
                {ERROR_FOUR_QUESTIONS.map((question) => <li key={question}>{question}</li>)}
              </ol>
            </details>
          </div>
        ))}
      </div>
    </section>
  )
}
