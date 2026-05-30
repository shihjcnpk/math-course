import { useState, useCallback } from 'react'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'
import type { ConceptCategory } from '@/types'

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ConceptCategory[]

interface GraphControlsProps {
  categoryFilter: ConceptCategory[]
  onToggleCategory: (cat: ConceptCategory) => void
  gradeFilter: number[]
  onToggleGrade: (grade: number) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onFocusNode: (nodeId: string) => void
  onFitAll: () => void
  nodeCount: number
  categoryNodeCounts: Record<ConceptCategory, number>
}

export default function GraphControls({
  categoryFilter,
  onToggleCategory,
  gradeFilter,
  onToggleGrade,
  searchQuery,
  onSearchChange,
  nodeCount,
  categoryNodeCounts,
}: GraphControlsProps) {
  const [searchInput, setSearchInput] = useState(searchQuery)

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchInput.trim()) {
        onSearchChange(searchInput.trim())
      }
    },
    [searchInput, onSearchChange],
  )

  const handleClearSearch = useCallback(() => {
    setSearchInput('')
    onSearchChange('')
  }, [onSearchChange])

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          搜索知识点
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="输入关键词…"
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 focus:border-primary-300 placeholder-gray-400"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grade filter */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          年级筛选
        </label>
        <div className="flex gap-1.5">
          {[7, 8].map((grade) => (
            <button
              key={grade}
              onClick={() => onToggleGrade(grade)}
              className={`flex-1 py-1 text-xs rounded border transition-colors ${
                gradeFilter.length === 0 || gradeFilter.includes(grade)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {grade}年级
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          模块筛选 ({nodeCount})
        </label>
        {ALL_CATEGORIES.map((cat) => {
          const isActive =
            categoryFilter.length === 0 || categoryFilter.includes(cat)
          const count = categoryNodeCounts[cat] ?? 0

          return (
            <button
              key={cat}
              onClick={() => onToggleCategory(cat)}
              className={`w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors ${
                isActive
                  ? 'font-medium'
                  : 'opacity-40'
              }`}
              style={{
                borderLeft: `3px solid ${CATEGORY_COLORS[cat]}`,
                color: isActive ? CATEGORY_COLORS[cat] : '#9ca3af',
              }}
            >
              <span>{CATEGORY_LABELS[cat]}</span>
              <span className="float-right text-xs text-gray-400">{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
