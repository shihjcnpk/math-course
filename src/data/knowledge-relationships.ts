import { knowledgeNodes, getNodeById } from './knowledge-nodes'
import type { KnowledgeNode } from '@/types'

/**
 * Recursively get all prerequisite node IDs for a given node.
 * Walks the prerequisite tree upward to a given depth.
 */
export function getAllPrerequisites(nodeId: string, maxDepth = 5): string[] {
  const result = new Set<string>()
  const queue: Array<{ id: string; depth: number }> = [{ id: nodeId, depth: 0 }]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (current.depth >= maxDepth) continue
    const node = getNodeById(current.id)
    if (!node) continue

    for (const prereqId of node.prerequisites) {
      if (!result.has(prereqId)) {
        result.add(prereqId)
        queue.push({ id: prereqId, depth: current.depth + 1 })
      }
    }
  }

  return Array.from(result)
}

/**
 * Get all concepts that depend on a given concept (transitive closure forward).
 */
export function getAllDependents(nodeId: string, maxDepth = 5): string[] {
  const result = new Set<string>()

  function walk(id: string, depth: number) {
    if (depth >= maxDepth) return
    const dependents = knowledgeNodes.filter(n => n.prerequisites.includes(id))
    for (const dep of dependents) {
      if (!result.has(dep.id)) {
        result.add(dep.id)
        walk(dep.id, depth + 1)
      }
    }
  }

  walk(nodeId, 0)
  return Array.from(result)
}

/**
 * Find a learning path from one concept to another using BFS.
 * Returns the sequence of node IDs from "from" to "to".
 */
export function findLearningPath(fromId: string, toId: string): string[] | null {
  const visited = new Set<string>()
  const queue: Array<{ id: string; path: string[] }> = [{ id: fromId, path: [fromId] }]

  while (queue.length > 0) {
    const { id, path } = queue.shift()!
    if (id === toId) return path
    if (visited.has(id)) continue
    visited.add(id)

    const node = getNodeById(id)
    if (!node) continue

    for (const nextId of node.leadsTo) {
      if (!visited.has(nextId)) {
        queue.push({ id: nextId, path: [...path, nextId] })
      }
    }
  }

  return null
}

/**
 * Get all related concepts within a given "radius" — prerequisites, dependents, and lateral connections.
 */
export function getKnowledgeNeighborhood(nodeId: string): {
  prerequisites: KnowledgeNode[]
  related: KnowledgeNode[]
  dependents: KnowledgeNode[]
} {
  const node = getNodeById(nodeId)
  if (!node) return { prerequisites: [], related: [], dependents: [] }

  return {
    prerequisites: node.prerequisites.map(id => getNodeById(id)).filter(Boolean) as KnowledgeNode[],
    related: node.related.map(id => getNodeById(id)).filter(Boolean) as KnowledgeNode[],
    dependents: node.leadsTo.map(id => getNodeById(id)).filter(Boolean) as KnowledgeNode[],
  }
}

/**
 * Get breakpoint candidates when a student makes an error on a given concept.
 * Cross-references the concept's common mistakes against prerequisite weaknesses.
 */
export function getBreakpointCandidates(
  errorConceptId: string,
  weakConceptIds: string[],
): Array<{ conceptId: string; conceptName: string; reason: string }> {
  const node = getNodeById(errorConceptId)
  if (!node) return []

  const candidates: Array<{ conceptId: string; conceptName: string; reason: string }> = []

  // Check if any weak concepts are direct prerequisites
  const allPrereqs = getAllPrerequisites(errorConceptId)
  for (const prereqId of allPrereqs) {
    if (weakConceptIds.includes(prereqId)) {
      const prereqNode = getNodeById(prereqId)
      if (prereqNode) {
        candidates.push({
          conceptId: prereqId,
          conceptName: prereqNode.name,
          reason: `"${prereqNode.name}"被标记为薄弱，它是"${node.name}"的前置知识`,
        })
      }
    }
  }

  // Also check common mistake patterns
  for (const mistake of node.commonMistakes) {
    for (const candidateId of mistake.likelyBreakpointCandidates) {
      if (weakConceptIds.includes(candidateId) && !candidates.find(c => c.conceptId === candidateId)) {
        const cNode = getNodeById(candidateId)
        if (cNode) {
          candidates.push({
            conceptId: candidateId,
            conceptName: cNode.name,
            reason: `常见错误"${mistake.description}"通常源于"${cNode.name}"薄弱`,
          })
        }
      }
    }
  }

  return candidates
}

/**
 * Get all nodes that are "root" concepts — no prerequisites.
 */
export function getRootConcepts(): KnowledgeNode[] {
  return knowledgeNodes.filter(n => n.prerequisites.length === 0)
}

/**
 * Get nodes sorted by dependency order (topological sort approximation by grade+difficulty).
 */
export function getNodesByLearningOrder(): KnowledgeNode[] {
  const gradeOrder: Record<string, number> = { 'basic': 0, 'intermediate': 1, 'advanced': 2 }
  return [...knowledgeNodes].sort((a, b) => {
    if (a.grade !== b.grade) return a.grade - b.grade
    return (gradeOrder[a.difficulty] || 0) - (gradeOrder[b.difficulty] || 0)
  })
}
