import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types'
import type { ConceptCategory, ConceptDifficulty, MasteryLevel } from '@/types'
import KaTeXRenderer from '@/components/shared/KaTeXRenderer'

const DIFFICULTY_COLORS: Record<ConceptDifficulty, string> = {
  basic: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

const DIFFICULTY_LABELS: Record<ConceptDifficulty, string> = {
  basic: '基础',
  intermediate: '中等',
  advanced: '进阶',
}

const MASTERY_BORDER: Record<string, string> = {
  strong: '#22c55e',
  weak: '#ef4444',
  ok: '#f59e0b',
}

function truncateName(name: string, max = 10): string {
  return name.length > max ? name.slice(0, max) + '…' : name
}

export interface GraphNodeData {
  label: string
  category: ConceptCategory
  grade: number
  difficulty: ConceptDifficulty
  oneLineMeaning: string
  formula?: string
  mastery: MasteryLevel | null
  isHighlighted: boolean
  isDimmed: boolean
  isSelected: boolean
  isDisabled: boolean
}

const GraphNode = memo(function GraphNode({
  data,
}: NodeProps<GraphNodeData>) {
  const {
    label,
    category,
    grade,
    difficulty,
    formula,
    mastery,
    isHighlighted,
    isDimmed,
    isSelected,
  } = data

  const catColor = CATEGORY_COLORS[category]
  const borderColor = mastery ? MASTERY_BORDER[mastery] : '#d1d5db'
  const borderWidth = isSelected ? 4 : isHighlighted ? 3 : 2
  const opacity = isDimmed ? 0.35 : 1

  return (
    <div
      className="graph-node-custom"
      style={{
        opacity,
        background: `${catColor}10`,
        border: `${borderWidth}px solid ${borderColor}`,
        borderLeft: `4px solid ${catColor}`,
        borderRadius: 10,
        padding: '8px 10px',
        minWidth: 140,
        maxWidth: 180,
        cursor: 'pointer',
        boxShadow: isSelected
          ? `0 0 0 2px ${catColor}, 0 4px 12px rgba(0,0,0,0.15)`
          : isHighlighted
            ? '0 2px 8px rgba(0,0,0,0.1)'
            : '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'all 0.15s ease',
      }}
      title={`${CATEGORY_LABELS[category]} · ${grade}年级 · ${DIFFICULTY_LABELS[difficulty]}`}
    >
      <Handle type="target" position={Position.Left} style={{ background: catColor, width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} style={{ background: catColor, width: 8, height: 8 }} />

      {/* Top row: name + grade badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: catColor,
            lineHeight: 1.3,
            flex: 1,
          }}
        >
          {truncateName(label)}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: '#fff',
            background: catColor,
            borderRadius: 4,
            padding: '1px 5px',
            flexShrink: 0,
          }}
        >
          {grade}
        </span>
      </div>

      {/* Difficulty dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: DIFFICULTY_COLORS[difficulty],
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: 10, color: '#9ca3af' }}>
          {DIFFICULTY_LABELS[difficulty]}
        </span>
        {mastery === 'strong' && (
          <span style={{ fontSize: 10, color: '#22c55e', marginLeft: 'auto' }}>已掌握</span>
        )}
        {mastery === 'weak' && (
          <span style={{ fontSize: 10, color: '#ef4444', marginLeft: 'auto' }}>薄弱</span>
        )}
      </div>

      {/* Formula preview */}
      {formula && (
        <div
          style={{
            marginTop: 4,
            fontSize: 11,
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <KaTeXRenderer formula={formula} />
        </div>
      )}
    </div>
  )
})

export default GraphNode
