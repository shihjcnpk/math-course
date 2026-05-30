/**
 * Simple client-side search utilities.
 * The main search is in data/search-index.ts; this file provides additional helpers.
 */
import { search as searchIndex } from '@/data/search-index'
import type { SearchResult, SearchFilterType } from '@/types'

/**
 * Search with optional filtering.
 */
export function filteredSearch(
  query: string,
  filterType: SearchFilterType,
): SearchResult[] {
  const results = searchIndex(query, 50)

  if (filterType === 'all') return results
  if (filterType === 'chapter') return results.filter((r) => r.type === 'lecture')
  if (filterType === 'knowledge-point') return results.filter((r) => r.type === 'concept')
  if (filterType === 'question-type') return results.filter((r) => r.type === 'question-type')
  if (filterType === 'common-mistake') return results.filter((r) => r.type === 'mistake')

  return results
}
