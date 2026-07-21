import type { KnowledgeNetwork } from '@/types'
import RelationDiagram from '@/components/lecture/RelationDiagram'

interface Props { network: KnowledgeNetwork }

export default function ConnectionSection({ network }: Props) {
  const hasContent = network.fromWhere.length > 0 || network.currentCore.length > 0 || network.toWhere.length > 0
  if (!hasContent) return null

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">知识网络导航</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <RelationDiagram network={network} />
      </div>
    </section>
  )
}
