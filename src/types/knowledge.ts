/** Grade level */
export type GradeLevel = 7 | 8

/** Top-level concept category matching 人教版 structure */
export type ConceptCategory =
  | 'number-and-expression'     // 数与式
  | 'equation-and-inequality'    // 方程与不等式
  | 'geometry-and-proof'         // 几何与证明
  | 'coordinate-and-function'    // 坐标与函数
  | 'statistics-and-data'        // 统计与数据
  | 'comprehensive'              // 综合

/** Concept difficulty tier */
export type ConceptDifficulty = 'basic' | 'intermediate' | 'advanced'

/** User's mastery level for a concept */
export type MasteryLevel = 'weak' | 'ok' | 'strong'

/**
 * Core entity: a single knowledge node.
 * Every concept in 7-8 grade math gets exactly one of these.
 * Relationship fields form the edges of the knowledge graph.
 */
export interface KnowledgeNode {
  /** Unique machine-readable ID, e.g. 'absolute-value' */
  id: string
  /** Chinese display name, e.g. '绝对值' */
  name: string
  /** Alternative names / search aliases */
  aliases: string[]
  /** Which category this concept belongs to */
  category: ConceptCategory
  /** Grade level where first introduced */
  grade: GradeLevel
  /** Difficulty tier */
  difficulty: ConceptDifficulty
  /** One-line plain-language explanation */
  oneLineMeaning: string
  /** Full description (2-4 sentences), used in tooltips and detail panels */
  description: string

  /**
   * IDs of prerequisite concepts — the student MUST understand these first.
   * These form directed prerequisite edges in the graph.
   */
  prerequisites: string[]

  /**
   * IDs of laterally related concepts — shared foundations, analogous structures.
   * These form undirected related edges in the graph.
   */
  related: string[]

  /**
   * IDs of concepts that build on this one — "where this leads".
   * These form directed next-step edges in the graph.
   */
  leadsTo: string[]

  /** Real-world or downstream applications */
  commonUses: string[]

  /** Typical question types that test this concept */
  typicalQuestionTypes: string[]

  /** Most common mistakes students make */
  commonMistakes: CommonMistake[]

  /** Lectures that teach or heavily use this concept */
  lectureIds: number[]

  /** Whether this concept benefits from an interactive visual demo */
  visualDemo: boolean

  /** Importance level for exam coverage */
  importanceLevel: 'high' | 'medium' | 'low'

  /** What the student should be able to do to prove mastery */
  masteryCheck: string

  /** Representative KaTeX formula for quick display in graph nodes */
  representativeFormula?: string
}

export interface CommonMistake {
  description: string
  wrongExample: string
  correctApproach: string
  /** IDs of prerequisite concepts typically responsible for this mistake */
  likelyBreakpointCandidates: string[]
}

/** Category display info */
export const CATEGORY_LABELS: Record<ConceptCategory, string> = {
  'number-and-expression': '数与式',
  'equation-and-inequality': '方程与不等式',
  'geometry-and-proof': '几何与证明',
  'coordinate-and-function': '坐标与函数',
  'statistics-and-data': '统计与数据',
  'comprehensive': '综合',
}

export const CATEGORY_COLORS: Record<ConceptCategory, string> = {
  'number-and-expression': '#3b82f6',
  'equation-and-inequality': '#f59e0b',
  'geometry-and-proof': '#10b981',
  'coordinate-and-function': '#8b5cf6',
  'statistics-and-data': '#ec4899',
  'comprehensive': '#ef4444',
}
