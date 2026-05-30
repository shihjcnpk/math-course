import { knowledgeNodes } from './knowledge-nodes'
import { lectureRegistry } from './lectures'
import type { SearchResult } from '@/types'

/**
 * Build a search index from knowledge nodes and lecture metadata.
 * This is pre-computed at build time for fast client-side search.
 */
function buildSearchIndex(): Map<string, SearchResult[]> {
  const index = new Map<string, SearchResult[]>()

  function addToken(token: string, result: SearchResult) {
    const existing = index.get(token) || []
    // Deduplicate by id
    if (!existing.find(r => r.id === result.id)) {
      existing.push(result)
      index.set(token, existing)
    }
  }

  function tokenize(text: string): string[] {
    // Split into tokens, keep CJK characters as individual tokens
    // and Latin words as space-separated tokens
    const tokens: string[] = []
    // Extract Chinese words (2-char sequences) and English words
    const chineseChars = text.match(/[一-鿿]+/g) || []
    const latinWords = text.match(/[a-zA-Z0-9]+/g) || []

    for (const phrase of chineseChars) {
      // Single characters
      for (const char of phrase) {
        tokens.push(char.toLowerCase())
      }
      // Also add 2-char sequences for better matching
      for (let i = 0; i < phrase.length - 1; i++) {
        tokens.push(phrase.slice(i, i + 2).toLowerCase())
      }
    }

    for (const word of latinWords) {
      tokens.push(word.toLowerCase())
    }

    return [...new Set(tokens)]
  }

  // Index knowledge nodes
  for (const node of knowledgeNodes) {
    const searchText = [
      node.name,
      ...node.aliases,
      node.oneLineMeaning,
      node.description,
      ...node.commonUses,
      ...node.typicalQuestionTypes,
      ...node.commonMistakes.map(m => m.description),
    ].join(' ')

    const tokens = tokenize(searchText)

    for (const token of tokens) {
      addToken(token, {
        type: 'concept',
        id: node.id,
        title: node.name,
        snippet: node.oneLineMeaning,
        matchField: '知识点',
        relevanceScore: 1,
        route: `/knowledge-graph/${node.id}`,
      })
    }
  }

  // Index lectures
  for (const lecture of lectureRegistry) {
    const searchText = [
      lecture.title,
      lecture.overview,
      lecture.oneLineMainIdea,
      ...lecture.objectives,
    ].join(' ')

    const tokens = tokenize(searchText)

    for (const token of tokens) {
      addToken(token, {
        type: 'lecture',
        id: `lecture-${lecture.id}`,
        title: `第${lecture.id}讲：${lecture.title}`,
        snippet: lecture.oneLineMainIdea,
        matchField: '课程',
        relevanceScore: 1,
        route: `/lectures/${lecture.id}`,
      })
    }
  }

  return index
}

export const searchIndex = buildSearchIndex()

/**
 * Search function using the pre-built index.
 */
export function search(query: string, limit = 20): SearchResult[] {
  if (!query.trim()) return []

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return []

  // Collect results for each token
  const resultSets = tokens.map(token => {
    const exactMatches = searchIndex.get(token) || []

    // Also try partial matches
    const partialMatches: SearchResult[] = []
    for (const [key, results] of searchIndex) {
      if (key.includes(token) && key !== token) {
        partialMatches.push(...results)
      }
    }

    return [...exactMatches, ...partialMatches]
  })

  // Score: results that appear in multiple token sets rank higher
  const scored = new Map<string, { result: SearchResult; count: number }>()
  for (const resultSet of resultSets) {
    for (const result of resultSet) {
      const existing = scored.get(result.id)
      if (existing) {
        existing.count++
        existing.result.relevanceScore = existing.count / tokens.length
      } else {
        scored.set(result.id, { result: { ...result }, count: 1 })
      }
    }
  }

  return Array.from(scored.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(s => s.result)
}
