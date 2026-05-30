import { useState, useMemo, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import { knowledgeNodes } from '@/data/knowledge-nodes'
import { getKnowledgeNeighborhood } from '@/data/knowledge-relationships'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'
import type { ConceptCategory } from '@/types'
import { useStore } from '@/store'
import KnowledgeGraph from '@/components/graph/KnowledgeGraph'
import GraphControls from '@/components/graph/GraphControls'
import KaTeXRenderer from '@/components/shared/KaTeXRenderer'
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph'

export default function KnowledgeGraphPageWrapper() {
  return (
    <ReactFlowProvider>
      <KnowledgeGraphPage />
    </ReactFlowProvider>
  )
}

function KnowledgeGraphPage() {
  const { nodeId: selectedNodeId } = useParams<{ nodeId?: string }>()
  const navigate = useNavigate()

  const categoryFilter = useStore((s) => s.categoryFilter)
  const toggleCategory = useStore((s) => s.toggleCategory)
  const conceptMastery = useStore((s) => s.progress.conceptMastery)

  const [gradeFilter, setGradeFilter] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Category node counts
  const categoryNodeCounts = useMemo(() => {
    const counts: Record<ConceptCategory, number> = {
      'number-and-expression': 0,
      'equation-and-inequality': 0,
      'geometry-and-proof': 0,
      'coordinate-and-function': 0,
      'statistics-and-data': 0,
      'comprehensive': 0,
    }
    for (const n of knowledgeNodes) {
      counts[n.category]++
    }
    return counts
  }, [])

  const handleToggleGrade = useCallback((grade: number) => {
    setGradeFilter((prev) => {
      if (prev.includes(grade)) return prev.filter((g) => g !== grade)
      return [...prev, grade]
    })
  }, [])

  // Filter nodes by category, grade, and search
  const filteredNodes = useMemo(() => {
    let nodes = knowledgeNodes

    if (categoryFilter.length > 0) {
      nodes = nodes.filter((n) => categoryFilter.includes(n.category))
    }
    if (gradeFilter.length === 1) {
      nodes = nodes.filter((n) => gradeFilter.includes(n.grade))
    }

    // Search filter: match name or aliases
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      nodes = nodes.filter(
        (n) =>
          n.name.includes(q) ||
          n.aliases.some((a) => a.toLowerCase().includes(q)) ||
          n.id.toLowerCase().includes(q),
      )
    }

    return nodes
  }, [categoryFilter, gradeFilter, searchQuery])

  const { nodes, edges, focusNode, fitAll } = useKnowledgeGraph({
    knowledgeNodes: filteredNodes,
    selectedNodeId: selectedNodeId ?? null,
    conceptMastery,
  })

  // When search finds a node, auto-focus it
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query)
      // If search matches exactly one node, focus it after layout
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        const matches = knowledgeNodes.filter(
          (n) =>
            n.name.includes(q) ||
            n.aliases.some((a) => a.toLowerCase().includes(q)) ||
            n.id.toLowerCase().includes(q),
        )
        if (matches.length === 1) {
          // Small delay to let the graph re-layout
          setTimeout(() => focusNode(matches[0].id), 100)
        }
      }
    },
    [focusNode],
  )

  const handleDeselect = useCallback(() => {
    navigate('/knowledge-graph')
  }, [navigate])

  return (
    <div className="flex gap-0 h-[calc(100vh-3.5rem)] -mx-6 -my-6">
      {/* Left sidebar: controls */}
      <div className="w-64 flex-shrink-0 overflow-y-auto bg-white border-r border-gray-200 px-4 py-4 space-y-5">
        <h1 className="text-lg font-bold text-gray-900">知识图谱</h1>

        <GraphControls
          categoryFilter={categoryFilter}
          onToggleCategory={toggleCategory}
          gradeFilter={gradeFilter}
          onToggleGrade={handleToggleGrade}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFocusNode={focusNode}
          onFitAll={fitAll}
          nodeCount={filteredNodes.length}
          categoryNodeCounts={categoryNodeCounts}
        />

        {/* Node list */}
        <div className="space-y-0.5 border-t border-gray-100 pt-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
            知识点 ({filteredNodes.length})
          </h3>
          {filteredNodes.slice(0, 60).map((node) => {
            const mastery = conceptMastery[node.id]
            return (
              <Link
                key={node.id}
                to={`/knowledge-graph/${node.id}`}
                className={`block px-2.5 py-1.5 rounded text-sm transition-colors ${
                  selectedNodeId === node.id
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{
                  borderLeft: `3px solid ${CATEGORY_COLORS[node.category]}30`,
                }}
              >
                <span className="text-xs text-gray-400 mr-1.5">{node.grade}年</span>
                <span style={{ color: CATEGORY_COLORS[node.category] }}>
                  {node.name}
                </span>
                {mastery === 'weak' && (
                  <span className="ml-1 text-red-500 text-xs">!</span>
                )}
                {mastery === 'strong' && (
                  <span className="ml-1 text-green-500 text-xs">✓</span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Center: ReactFlow canvas */}
      <div className="flex-1 relative bg-gray-50">
        <KnowledgeGraph nodes={nodes} edges={edges} />

        {/* Floating action buttons */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <button
            onClick={fitAll}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 text-gray-600"
          >
            适应全部
          </button>
          {selectedNodeId && (
            <button
              onClick={handleDeselect}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 text-gray-600"
            >
              取消选择
            </button>
          )}
        </div>
      </div>

      {/* Right: Node detail panel (slides in when node selected) */}
      {selectedNodeId && (
        <div className="w-80 flex-shrink-0 overflow-y-auto bg-white border-l border-gray-200">
          <NodeDetailPanel nodeId={selectedNodeId} onClose={handleDeselect} />
        </div>
      )}
    </div>
  )
}

function NodeDetailPanel({
  nodeId,
  onClose,
}: {
  nodeId: string
  onClose: () => void
}) {
  const node = knowledgeNodes.find((n) => n.id === nodeId)
  const conceptMastery = useStore((s) => s.progress.conceptMastery)
  const neighborhood = useMemo(
    () => (node ? getKnowledgeNeighborhood(node.id) : null),
    [node],
  )

  if (!node) {
    return (
      <div className="p-4">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm mb-4"
        >
          关闭
        </button>
        <p className="text-gray-400 text-sm">知识点未找到</p>
      </div>
    )
  }

  const mastery = conceptMastery[node.id]

  return (
    <div className="p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 text-sm mb-3"
      >
        关闭
      </button>

      {/* Header */}
      <div className="mb-5">
        <span
          className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white mb-2"
          style={{ backgroundColor: CATEGORY_COLORS[node.category] }}
        >
          {CATEGORY_LABELS[node.category]} · {node.grade}年级 ·{' '}
          {node.difficulty === 'basic'
            ? '基础'
            : node.difficulty === 'intermediate'
              ? '中等'
              : '进阶'}
        </span>
        <h2
          className="text-lg font-bold"
          style={{ color: CATEGORY_COLORS[node.category] }}
        >
          {node.name}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{node.oneLineMeaning}</p>

        {/* Mastery badge */}
        {mastery && (
          <span
            className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
              mastery === 'strong'
                ? 'bg-green-50 text-green-700'
                : mastery === 'weak'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            {mastery === 'strong'
              ? '已掌握'
              : mastery === 'weak'
                ? '薄弱点'
                : '学习中'}
          </span>
        )}

        {/* Formula */}
        {node.representativeFormula && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-center">
            <KaTeXRenderer formula={node.representativeFormula} displayMode />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-5">{node.description}</p>

      {/* Neighborhood */}
      {neighborhood && (
        <div className="space-y-3 text-sm">
          {neighborhood.prerequisites.length > 0 && (
            <div>
              <h3 className="font-medium text-amber-600 text-xs mb-1.5">
                前置知识
              </h3>
              {neighborhood.prerequisites.map((n) => (
                <Link
                  key={n.id}
                  to={`/knowledge-graph/${n.id}`}
                  className="block px-2 py-1 rounded text-gray-600 hover:bg-amber-50 text-xs"
                >
                  <span className="text-amber-400 mr-1">&#8592;</span>
                  {n.name}
                </Link>
              ))}
            </div>
          )}

          {neighborhood.related.length > 0 && (
            <div>
              <h3 className="font-medium text-blue-600 text-xs mb-1.5">
                横向关联
              </h3>
              {neighborhood.related.map((n) => (
                <Link
                  key={n.id}
                  to={`/knowledge-graph/${n.id}`}
                  className="block px-2 py-1 rounded text-gray-600 hover:bg-blue-50 text-xs"
                >
                  <span className="text-blue-400 mr-1">&#8596;</span>
                  {n.name}
                </Link>
              ))}
            </div>
          )}

          {neighborhood.dependents.length > 0 && (
            <div>
              <h3 className="font-medium text-green-600 text-xs mb-1.5">
                后续延伸
              </h3>
              {neighborhood.dependents.map((n) => (
                <Link
                  key={n.id}
                  to={`/knowledge-graph/${n.id}`}
                  className="block px-2 py-1 rounded text-gray-600 hover:bg-green-50 text-xs"
                >
                  <span className="text-green-400 mr-1">&#8594;</span>
                  {n.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Common mistakes */}
      {node.commonMistakes.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-800 text-sm mb-2">常见错误</h3>
          <ul className="space-y-2">
            {node.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-600">
                <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
                <span>{m.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mastery check */}
      <div className="mt-5 pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-800 text-sm mb-1">掌握标准</h3>
        <p className="text-xs text-gray-500">{node.masteryCheck}</p>
      </div>
    </div>
  )
}
