import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { BreakpointDiagnosis, MasteryLevel } from '@/types'
import { getNodeById } from '@/data/knowledge-nodes'
import { getAllPrerequisites } from '@/data/knowledge-relationships'

interface Props {
  diagnosis: BreakpointDiagnosis
  conceptMastery: Record<string, MasteryLevel>
}

interface TreeNode {
  conceptId: string
  conceptName: string
  depth: number
  lectureIds: number[]
  mastery: MasteryLevel | 'unstudied'
  isBreakpoint: boolean
  children: TreeNode[]
}

const MASTERY_STYLES: Record<MasteryLevel | 'unstudied', { bg: string; border: string; text: string; label: string }> = {
  weak: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', label: '薄弱' },
  ok: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', label: '一般' },
  strong: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', label: '已掌握' },
  unstudied: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', label: '未学习' },
}

/**
 * Visual prerequisite chain for a diagnosed error.
 *
 * Shows the error's surface concept at the top, with prerequisite breakpoints
 * and their prerequisites below, forming a tree upward through the knowledge
 * dependency chain.
 *
 * Color coding:
 *   - Red: weak (identified as a root cause)
 *   - Amber: ok but could use practice
 *   - Green: strong / mastered
 *   - Gray: unstudied (no mastery data)
 */
export default function BreakpointChain({ diagnosis, conceptMastery }: Props) {
  const tree = useMemo(() => buildTree(diagnosis, conceptMastery), [diagnosis, conceptMastery])

  if (!tree) return null

  // Collect all nodes flattened for rendering in depth order
  const depthGroups = groupByDepth(tree)

  return (
    <div className="mt-3">
      <h4 className="text-sm font-medium text-gray-700 mb-3">知识依赖链</h4>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        {depthGroups.map((group, depthIdx) => (
          <div key={depthIdx}>
            {/* Depth label */}
            {depthIdx > 0 && (
              <div className="flex items-center gap-1 my-2 ml-6">
                <span className="text-[10px] text-gray-400">
                  {depthIdx === 1 ? '↑ 前置知识断点' : '↑ 更深层前置'}
                </span>
                <div className="flex-1 border-t border-dashed border-gray-200" />
              </div>
            )}

            {/* Nodes at this depth */}
            <div className="flex flex-wrap gap-2 justify-center">
              {group.map((node) => {
                const style = MASTERY_STYLES[node.mastery]
                const lectureId = node.lectureIds[0]

                return (
                  <Link
                    key={node.conceptId + '-' + node.depth}
                    to={lectureId ? `/lectures/${lectureId}` : '#'}
                    className={`
                      inline-flex flex-col items-center px-3 py-2 rounded-lg border text-xs
                      transition-all hover:shadow-sm hover:scale-105
                      ${style.bg} ${style.border} ${style.text}
                      ${node.isBreakpoint ? 'ring-2 ring-red-300 ring-offset-1' : ''}
                    `}
                    title={
                      node.isBreakpoint
                        ? `断点概念：${node.conceptName}（${style.label}）`
                        : `前置概念：${node.conceptName}（${style.label}）`
                    }
                  >
                    <span className="font-medium whitespace-nowrap">{node.conceptName}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">
                      {style.label}
                      {lectureId ? ` · 第${lectureId}讲` : ''}
                    </span>
                    {node.isBreakpoint && (
                      <span className="text-[10px] text-red-500 mt-0.5">⚡ 断点</span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Connecting lines between depth levels (CSS-only) */}
            {depthIdx < depthGroups.length - 1 && depthGroups[depthIdx + 1].length > 0 && (
              <div className="flex justify-center my-1">
                <svg width="20" height="16" className="text-gray-300">
                  <line x1="10" y1="0" x2="10" y2="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,3" />
                  <line x1="1" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,3" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Build the tree data structure from diagnosis results */
function buildTree(
  diagnosis: BreakpointDiagnosis,
  conceptMastery: Record<string, MasteryLevel>,
): TreeNode | null {
  const surfaceNode = getNodeById(diagnosis.surfaceConceptId)
  if (!surfaceNode) return null

  // Create the root (surface concept where the error occurred)
  const root: TreeNode = {
    conceptId: diagnosis.surfaceConceptId,
    conceptName: diagnosis.surfaceConceptName,
    depth: 0,
    lectureIds: surfaceNode.lectureIds,
    mastery: conceptMastery[diagnosis.surfaceConceptId] || 'unstudied',
    isBreakpoint: false,
    children: [],
  }

  // For each identified breakpoint, create a child node
  const breakpointIds = new Set(diagnosis.identifiedBreakpoints.map((bp) => bp.conceptId))

  for (const bp of diagnosis.identifiedBreakpoints) {
    const bpNode = getNodeById(bp.conceptId)
    if (!bpNode) continue

    const child: TreeNode = {
      conceptId: bp.conceptId,
      conceptName: bp.conceptName,
      depth: 1,
      lectureIds: bpNode.lectureIds,
      mastery: conceptMastery[bp.conceptId] || 'unstudied',
      isBreakpoint: true,
      children: [],
    }

    // Get prerequisites of this breakpoint (up to 2 more levels)
    const deepPrereqs = getAllPrerequisites(bp.conceptId, 3)
    for (const prereqId of deepPrereqs) {
      // Skip if already shown as a breakpoint or the surface concept
      if (breakpointIds.has(prereqId) || prereqId === diagnosis.surfaceConceptId) continue

      const prereqNode = getNodeById(prereqId)
      if (!prereqNode) continue

      const mastery = conceptMastery[prereqId] || 'unstudied'
      // Only show prerequisites that are weak or unstudied
      if (mastery === 'strong') continue

      child.children.push({
        conceptId: prereqId,
        conceptName: prereqNode.name,
        depth: 2,
        lectureIds: prereqNode.lectureIds,
        mastery,
        isBreakpoint: false,
        children: [],
      })
    }

    root.children.push(child)
  }

  return root
}

/** Flatten tree nodes into depth groups for rendering */
function groupByDepth(root: TreeNode): TreeNode[][] {
  const groups: Map<number, TreeNode[]> = new Map()

  function walk(node: TreeNode) {
    const group = groups.get(node.depth) || []
    group.push(node)
    groups.set(node.depth, group)

    for (const child of node.children) {
      walk(child)
    }
  }

  walk(root)
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([, nodes]) => nodes)
}
