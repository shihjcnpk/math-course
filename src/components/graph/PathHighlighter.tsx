import type { KnowledgeNode } from '@/types'

/**
 * Compute path-highlight data from root concepts to a selected node.
 *
 * Uses BFS from root concepts (no prerequisites), following leadsTo edges
 * forward, to find the shortest learning path to the selected node.
 * Returns node IDs and edge IDs that lie on that path.
 */
export function computePathHighlight(
  nodes: KnowledgeNode[],
  selectedNodeId: string,
): { pathNodeIds: Set<string>; pathEdgeIds: Set<string> } {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const rootNodes = nodes.filter((n) => n.prerequisites.length === 0)

  // BFS to find shortest path from any root to selected node
  const visited = new Set<string>()
  const queue: Array<{
    nodeId: string
    path: { nodes: string[]; edges: string[] }
  }> = rootNodes.map((r) => ({
    nodeId: r.id,
    path: { nodes: [r.id], edges: [] },
  }))

  while (queue.length > 0) {
    const { nodeId, path } = queue.shift()!
    if (nodeId === selectedNodeId) {
      // Found path — also include any prerequisite + related edges
      // whose both endpoints are in the path node set
      const pathNodeSet = new Set(path.nodes)
      const allPathEdges = new Set(path.edges)

      for (const pid of path.nodes) {
        const pnode = nodeMap.get(pid)
        if (!pnode) continue
        // prerequisite edges connecting two path nodes
        for (const prereq of pnode.prerequisites) {
          if (pathNodeSet.has(prereq)) {
            allPathEdges.add(`${prereq}-prereq-${pid}`)
          }
        }
        // related edges connecting two path nodes (use ordered key)
        for (const rel of pnode.related) {
          if (pathNodeSet.has(rel) && pid < rel) {
            allPathEdges.add(`${pid}-related-${rel}`)
          }
        }
      }

      return { pathNodeIds: pathNodeSet, pathEdgeIds: allPathEdges }
    }
    if (visited.has(nodeId)) continue
    visited.add(nodeId)

    const node = nodeMap.get(nodeId)
    if (!node) continue

    for (const nextId of node.leadsTo) {
      if (!visited.has(nextId)) {
        const edgeId = `${nodeId}-leads-${nextId}`
        queue.push({
          nodeId: nextId,
          path: {
            nodes: [...path.nodes, nextId],
            edges: [...path.edges, edgeId],
          },
        })
      }
    }
  }

  // No path found — just highlight the selected node itself
  return {
    pathNodeIds: new Set([selectedNodeId]),
    pathEdgeIds: new Set<string>(),
  }
}
