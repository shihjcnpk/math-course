import type { ConceptExplanation } from '@/types'
import KaTeXRenderer from '@/components/shared/KaTeXRenderer'
import MathText from '@/components/shared/MathText'

interface Props { concepts: ConceptExplanation[] }

export default function ConceptSection({ concepts }: Props) {
  if (!concepts.length) return null
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">概念理解</h2>
      <div className="space-y-5">
        {concepts.map((c, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2"><MathText>{c.title}</MathText></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-amber-50 rounded border border-amber-100">
                <p className="font-medium text-amber-700 mb-1">通俗理解</p>
                <p className="text-gray-700 leading-relaxed"><MathText>{c.everydayAnalogy}</MathText></p>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                <p className="font-medium text-blue-700 mb-1">数学表述</p>
                <p className="text-gray-700 leading-relaxed"><MathText>{c.formalDefinition}</MathText></p>
                {c.formula && c.formula.includes('$') && (
                  <div className="mt-2 p-2 bg-white rounded text-center">
                    <MathText>{c.formula}</MathText>
                  </div>
                )}
                {c.formula && !c.formula.includes('$') && (
                  <div className="mt-2 p-2 bg-white rounded text-center">
                    <KaTeXRenderer formula={c.formula} displayMode />
                  </div>
                )}
              </div>
            </div>
            {c.associationReminders.length > 0 && (
              <div className="mt-3 space-y-2">
                {c.associationReminders.map((r, j) => (
                  <div
                    key={j}
                    className="rounded-md border border-primary-100 bg-primary-50 px-3 py-2 text-sm font-medium leading-relaxed text-primary-800"
                  >
                    <MathText>{r}</MathText>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
