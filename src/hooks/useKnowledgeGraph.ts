import { useMemo, useCallback } from 'react'
import { useReactFlow, MarkerType, type Node, type Edge } from 'reactflow'
import dagre from '@dagrejs/dagre'
import type { KnowledgeNode, MasteryLevel } from '@/types'
import type { GraphEdgeType } from '@/types/graph'
import { computePathHighlight } from '@/components/graph/PathHighlighter'

const NODE_WIDTH = 170
const NODE_HEIGHT = 72
const NODE_HALF_W = NODE_WIDTH / 2
const NODE_HALF_H = NODE_HEIGHT / 2

interface UseKnowledgeGraphOptions {
  knowledgeNodes: KnowledgeNode[]
  selectedNodeId: string | null
  conceptMastery: Record<string, MasteryLevel>
}

/**
 * Derives ReactFlow nodes + edges from KnowledgeNode data,
 * applies dagre automatic layout, overlays user progress styling,
 * and computes path highlighting when a node is selected.
 */
export function useKnowledgeGraph({
  knowledgeNodes,
  selectedNodeId,
  conceptMastery,
}: UseKnowledgeGraphOptions) {
  const { fitView } = useReactFlow()

  // Compute path highlight when a node is selected
  const pathData = useMemo(() => {
    if (!selectedNodeId) return { pathNodeIds: new Set<string>(), pathEdgeIds: new Set<string>() }
    return computePathHighlight(knowledgeNodes, selectedNodeId)
  }, [knowledgeNodes, selectedNodeId])

  // Build ReactFlow nodes (without positions — dagre sets those)
  const rawNodes: Node[] = useMemo(() => {
    const nodeIdSet = new Set(knowledgeNodes.map((n) => n.id))

    return knowledgeNodes.map((kn) => {
      const mastery = conceptMastery[kn.id] ?? null
      const isPathNode = pathData.pathNodeIds.has(kn.id)
      const isDimmed = selectedNodeId ? !isPathNode : false

      return {
        id: kn.id,
        type: 'knowledgeNode',
        position: { x: 0, y: 0 },
        hidden: !nodeIdSet.has(kn.id),
        data: {
          label: kn.name,
          category: kn.category,
          grade: kn.grade,
          difficulty: kn.difficulty,
          oneLineMeaning: kn.oneLineMeaning,
          formula: kn.representativeFormula,
          mastery,
          isHighlighted: isPathNode && kn.id !== selectedNodeId,
          isDimmed,
          isSelected: kn.id === selectedNodeId,
          isDisabled: false,
        },
      }
    })
  }, [knowledgeNodes, conceptMastery, selectedNodeId, pathData])

  // Build ReactFlow edges
  const rawEdges: Edge[] = useMemo(() => {
    const nodeIdSet = new Set(knowledgeNodes.map((n) => n.id))
    const result: Edge[] = []
    const seenEdgeIds = new Set<string>()

    for (const kn of knowledgeNodes) {
      // prerequisite edges: from prerequisite to this node (dashed gray)
      for (const prereqId of kn.prerequisites) {
        if (!nodeIdSet.has(prereqId)) continue
        const edgeId = `${prereqId}-prereq-${kn.id}`
        if (seenEdgeIds.has(edgeId)) continue
        seenEdgeIds.add(edgeId)

        const isPathEdge = pathData.pathEdgeIds.has(edgeId)
        result.push(createEdge(edgeId, prereqId, kn.id, 'prerequisite', isPathEdge))
      }

      // related edges: undirected, thin solid
      for (const relId of kn.related) {
        if (!nodeIdSet.has(relId)) continue
        // Deduplicate symmetric related edges
        const ordered = kn.id < relId ? [kn.id, relId] : [relId, kn.id]
        const edgeId = `${ordered[0]}-related-${ordered[1]}`
        if (seenEdgeIds.has(edgeId)) continue
        seenEdgeIds.add(edgeId)

        const isPathEdge = pathData.pathEdgeIds.has(edgeId)
        result.push(createEdge(edgeId, ordered[0], ordered[1], 'related', isPathEdge))
      }

      // leads-to edges: directed, thick blue with arrow
      for (const leadId of kn.leadsTo) {
        if (!nodeIdSet.has(leadId)) continue
        const edgeId = `${kn.id}-leads-${leadId}`
        if (seenEdgeIds.has(edgeId)) continue
        seenEdgeIds.add(edgeId)

        const isPathEdge = pathData.pathEdgeIds.has(edgeId)
        result.push(createEdge(edgeId, kn.id, leadId, 'leads-to', isPathEdge))
      }
    }

    return result
  }, [knowledgeNodes, pathData])

  // Apply dagre layout
  const nodes = useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph()
    dagreGraph.setDefaultEdgeLabel(() => ({}))
    dagreGraph.setGraph({
      rankdir: 'LR',
      nodesep: 60,
      ranksep: 160,
      marginx: 40,
      marginy: 40,
    })

    for (const node of rawNodes) {
      dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    }

    for (const edge of rawEdges) {
      dagreGraph.setEdge(edge.source, edge.target)
    }

    dagre.layout(dagreGraph)

    return rawNodes.map((node) => {
      const pos = dagreGraph.node(node.id)
      if (!pos) return node
      return {
        ...node,
        position: {
          x: pos.x - NODE_HALF_W,
          y: pos.y - NODE_HALF_H,
        },
      }
    })
  }, [rawNodes, rawEdges])

  // Fit all nodes into view
  const fitAll = useCallback(() => {
    fitView({ padding: 0.2, duration: 400 })
  }, [fitView])

  // Focus on a specific node
  const focusNode = useCallback(
    (nodeId: string) => {
      fitView({ nodes: [{ id: nodeId }], maxZoom: 1.2, duration: 500 })
    },
    [fitView],
  )

  return { nodes, edges: rawEdges, focusNode, fitAll }
}

/** Build a single edge object with styling per type */
function createEdge(
  id: string,
  source: string,
  target: string,
  type: GraphEdgeType,
  isPath: boolean,
): Edge {
  const pathColor = '#f59e0b' // amber for path highlight

  switch (type) {
    case 'prerequisite':
      return {
        id,
        source,
        target,
        type: 'graphEdge',
        style: {
          stroke: isPath ? pathColor : '#94a3b8',
          strokeWidth: isPath ? 3 : 1.5,
          strokeDasharray: '6 3',
        },
        animated: isPath,
      }

    case 'related':
      return {
        id,
        source,
        target,
        type: 'graphEdge',
        style: {
          stroke: isPath ? pathColor : '#cbd5e1',
          strokeWidth: isPath ? 3 : 1,
        },
      }

    case 'leads-to':
      return {
        id,
        source,
        target,
        type: 'graphEdge',
        style: {
          stroke: isPath ? pathColor : '#3b82f6',
          strokeWidth: isPath ? 3 : 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isPath ? pathColor : '#3b82f6',
          width: 16,
          height: 16,
        },
        animated: isPath,
      }
  }
}
