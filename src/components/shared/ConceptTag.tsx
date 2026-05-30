import { Link } from 'react-router-dom'
import { getNodeById } from '@/data/knowledge-nodes'
import { CATEGORY_COLORS } from '@/types'

interface Props {
  conceptId: string
  showName?: boolean
}

export default function ConceptTag({ conceptId, showName = true }: Props) {
  const node = getNodeById(conceptId)
  if (!node) return null
  const color = CATEGORY_COLORS[node.category]

  return (
    <Link
      to={`/knowledge-graph/${conceptId}`}
      className="inline-flex items-center border px-2.5 py-0.5 rounded text-xs font-semibold transition-colors hover:shadow-sm"
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}14`,
      }}
      title={node.oneLineMeaning}
    >
      {showName ? node.name : '🔗'}
    </Link>
  )
}
