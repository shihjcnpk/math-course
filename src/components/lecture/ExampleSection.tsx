import { useState } from 'react'
import type { KnowledgeThreadDefinition, TypicalQuestion } from '@/types'
import MathText from '@/components/shared/MathText'
import { FIVE_SECOND_BRAKE } from '@/data/adhd-support'
import QuestionTypeNetwork from '@/components/lecture/QuestionTypeNetwork'
import GeometryExampleDiagram from '@/components/lecture/GeometryExampleDiagram'

interface Props { questions: TypicalQuestion[]; threads: KnowledgeThreadDefinition[]; lectureId: number }

export default function ExampleSection({ questions, threads, lectureId }: Props) {
  if (!questions.length) return null
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">典型题型精讲</h2>
      <div className="space-y-6">
        {questions.map((q, i) => (
          <QuestionCard key={i} question={q} threads={threads} lectureId={lectureId} questionIndex={i} />
        ))}
      </div>
    </section>
  )
}

function QuestionCard({ question: q, threads, lectureId, questionIndex }: { question: TypicalQuestion; threads: KnowledgeThreadDefinition[]; lectureId: number; questionIndex: number }) {
  const [showVariations, setShowVariations] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-1"><MathText>{q.name}</MathText></h3>
      <p className="text-sm text-gray-500 mb-3">题型本质：<MathText>{q.essence}</MathText></p>

      <QuestionTypeNetwork question={q} threads={threads} />

      <div className="mb-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
        <p className="text-xs font-semibold text-orange-800">做题前5秒刹车</p>
        <ol className="mt-1 grid grid-cols-1 gap-1 text-xs text-orange-900 sm:grid-cols-2">
          {FIVE_SECOND_BRAKE.map((step, index) => (
            <li key={step}>{index + 1}. {step}</li>
          ))}
        </ol>
      </div>

      <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100">
        <p className="text-xs font-medium text-blue-700 mb-1">解题步骤</p>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-0.5">
          {q.solutionSteps.map((s, j) => <li key={j}><MathText>{s}</MathText></li>)}
        </ol>
      </div>

      <div className="mb-3 p-3 bg-green-50 rounded border border-green-100">
        <p className="text-xs font-medium text-green-700 mb-1">例题</p>
        <p className="text-sm text-gray-800 mb-2 leading-relaxed"><MathText>{q.example.problem}</MathText></p>
        <GeometryExampleDiagram lectureId={lectureId} questionIndex={questionIndex} problem={q.example.problem} />
        <div className="text-sm text-gray-700 space-y-1">
          {q.example.stepByStepAnalysis.map((s, j) => (
            <p key={j} className="leading-relaxed"><MathText>{s}</MathText></p>
          ))}
        </div>
        <p className="text-sm font-semibold text-green-700 mt-2">答案：<MathText>{q.example.answer}</MathText></p>
        <p className="mt-1 text-xs text-blue-600">检查方法：把结果代回题目条件，核对符号、单位、范围和结论是否回答了所求。</p>
        <p className="text-xs text-red-500 mt-1">易错：<MathText>{q.example.commonMistake}</MathText></p>
      </div>

      <p className="text-sm text-gray-600 mb-2 leading-relaxed"><MathText>{q.summary}</MathText></p>

      {q.variations.length > 0 && (
        <div>
          <button
            onClick={() => setShowVariations(!showVariations)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            {showVariations ? '收起变式题' : `查看 ${q.variations.length} 道变式题`}
          </button>
          {showVariations && (
            <div className="mt-2 space-y-2">
              {q.variations.map((v, j) => (
                <div key={j} className="p-2 bg-gray-50 rounded text-sm">
                  <p className="text-gray-800 leading-relaxed"><MathText>{v.problem}</MathText></p>
                  <p className="text-xs text-amber-600 mt-1">提示：<MathText>{v.hint}</MathText></p>
                  <p className="text-xs text-green-600">答案：<MathText>{v.answer}</MathText></p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
