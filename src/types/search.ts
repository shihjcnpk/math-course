import type { GradeLevel } from './knowledge'

/** Search filter categories */
export type SearchFilterType =
  | 'all'
  | 'chapter'
  | 'knowledge-point'
  | 'question-type'
  | 'common-mistake'

/** Active search filters */
export interface SearchFilters {
  type: SearchFilterType
  moduleId?: number
  gradeLevel?: GradeLevel
}

/** A single search result */
export interface SearchResult {
  type: 'lecture' | 'concept' | 'question-type' | 'mistake'
  id: string
  title: string
  /** Matching excerpt with highlighted terms */
  snippet: string
  /** Which field the match was found in */
  matchField: string
  /** Relevance score 0-1 */
  relevanceScore: number
  /** Route to navigate to */
  route: string
  /** Additional context (e.g. which lecture this belongs to) */
  context?: string
}

/** Pre-built search index entry */
export interface SearchIndexEntry {
  token: string            // Lowercase normalized token
  results: SearchResult[]  // All results matching this token
}
