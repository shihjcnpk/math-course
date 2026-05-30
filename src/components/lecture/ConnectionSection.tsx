import type { KnowledgeNetwork } from '@/types'
import MathText from '@/components/shared/MathText'
import RelationDiagram from '@/components/lecture/RelationDiagram'

interface Props { network: KnowledgeNetwork }

export default function ConnectionSection({ network }: Props) {
  const hasContent = network.fromWhere.length > 0 || network.currentCore.length > 0 || network.toWhere.length > 0
  if (!hasContent) return null

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">知识网络导航</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-amber-50 rounded border border-amber-100">
            <h3 className="font-medium text-amber-700 mb-2">我从哪里来</h3>
            <ul className="space-y-1 text-gray-700">
              {network.fromWhere.map((s, i) => <li key={i}>• <MathText>{s}</MathText></li>)}
            </ul>
          </div>
          <div className="p-3 bg-blue-50 rounded border border-blue-100">
            <h3 className="font-medium text-blue-700 mb-2">正在学什么</h3>
            <ul className="space-y-1 text-gray-700">
              {network.currentCore.map((s, i) => <li key={i}>• <MathText>{s}</MathText></li>)}
            </ul>
          </div>
          <div className="p-3 bg-green-50 rounded border border-green-100">
            <h3 className="font-medium text-green-700 mb-2">我要到哪里去</h3>
            <ul className="space-y-1 text-gray-700">
              {network.toWhere.map((s, i) => <li key={i}>• <MathText>{s}</MathText></li>)}
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <RelationDiagram network={network} />
        </div>
      </div>
    </section>
  )
}
