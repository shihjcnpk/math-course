import type { CoreMethod } from '@/types'
import MathText from '@/components/shared/MathText'

interface Props { methods: CoreMethod[] }

export default function MethodSection({ methods }: Props) {
  if (!methods.length) return null
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">核心方法</h2>
      <div className="space-y-4">
        {methods.map((m, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2"><MathText>{m.name}</MathText></h3>
            <div className="mb-3 p-3 bg-gray-50 rounded text-sm text-gray-600">
              <p className="font-medium text-gray-700 mb-1">方法来源</p>
              <p className="leading-relaxed"><MathText>{m.derivation}</MathText></p>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mb-3">
              {m.steps.map((s, j) => <li key={j}><MathText>{s}</MathText></li>)}
            </ol>
            {m.visualExplanation && (
              <div className="p-2 bg-indigo-50 rounded text-center text-sm overflow-x-auto">
                <MathText>{m.visualExplanation}</MathText>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
