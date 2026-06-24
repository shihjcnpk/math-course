import { getNodeById } from '@/data/knowledge-nodes'
import { getBreakpointCandidates } from '@/data/knowledge-relationships'
import type { BreakpointDiagnosis } from '@/types'

/**
 * Diagnose knowledge breakpoints for a given error.
 * Algorithm:
 * 1. Find the knowledge node for the error concept
 * 2. Cross-reference with user's weak concepts
 * 3. Walk prerequisite tree to find likely root causes
 * 4. Generate review recommendations
 */
export function diagnoseBreakpoint(
  errorConceptId: string,
  weakConceptIds: string[],
): BreakpointDiagnosis {
  const node = getNodeById(errorConceptId)

  if (!node) {
    return {
      surfaceConceptId: errorConceptId,
      surfaceConceptName: '未知概念',
      identifiedBreakpoints: [],
    }
  }

  const candidates = getBreakpointCandidates(errorConceptId, weakConceptIds)
  const hasWeakEvidence = candidates.length > 0

  // No weak evidence means "candidate for a quick self-test", not a confirmed breakpoint.
  if (candidates.length === 0) {
    for (const prereqId of node.prerequisites) {
      const prereqNode = getNodeById(prereqId)
      if (prereqNode) {
        candidates.push({
          conceptId: prereqId,
          conceptName: prereqNode.name,
          reason: `尚无薄弱证据；“${prereqNode.name}”是“${node.name}”的直接前置知识，建议先做1道基础题自测`,
        })
      }
    }
  }

  // Find recommended lectures for each breakpoint
  const breakpoints = candidates.map(c => {
    const bpNode = getNodeById(c.conceptId)
    return {
      conceptId: c.conceptId,
      conceptName: c.conceptName,
      reason: c.reason,
      confidence: hasWeakEvidence ? ('high' as const) : ('low' as const),
      reviewLectureId: bpNode?.lectureIds[0] || 1,
    }
  })

  return {
    surfaceConceptId: errorConceptId,
    surfaceConceptName: node.name,
    identifiedBreakpoints: breakpoints.slice(0, 5), // Top 5
  }
}

/**
 * Generate a personalized review path based on diagnosed breakpoints.
 */
export function generateReviewPath(
  breakpoints: BreakpointDiagnosis[],
): Array<{ conceptName: string; lectureId: number; priority: number }> {
  const path: Array<{ conceptName: string; lectureId: number; priority: number }> = []

  for (const diagnosis of breakpoints) {
    for (const bp of diagnosis.identifiedBreakpoints) {
      const existing = path.find(p => p.lectureId === bp.reviewLectureId)
      if (!existing) {
        path.push({
          conceptName: bp.conceptName,
          lectureId: bp.reviewLectureId,
          priority: bp.confidence === 'high' ? 1 : bp.confidence === 'medium' ? 2 : 3,
        })
      }
    }
  }

  return path.sort((a, b) => a.priority - b.priority)
}
