import type { ConceptCategory, MasteryLevel } from './knowledge'

/** A node in the knowledge graph visualization */
export interface GraphNode {
  id: string
  type: 'knowledgeNode'
  position: { x: number; y: number }
  data: {
    label: string
    category: ConceptCategory
    difficulty: string
    oneLineMeaning: string
    formula?: string
    mastery: MasteryLevel | null
    isHighlighted: boolean
    isDimmed: boolean
  }
}

/** Edge type for knowledge relationships */
export type GraphEdgeType = 'prerequisite' | 'related' | 'leads-to'

/** An edge in the knowledge graph visualization */
export interface GraphEdge {
  id: string
  source: string
  target: string
  type: GraphEdgeType
  animated?: boolean
  style?: Record<string, string>
  label?: string
}

/** Graph filter state */
export interface GraphFilter {
  categories: ConceptCategory[]
  gradeLevels: number[]
  searchQuery: string
}

/** Default graph filter */
export const DEFAULT_GRAPH_FILTER: GraphFilter = {
  categories: [],
  gradeLevels: [],
  searchQuery: '',
}
