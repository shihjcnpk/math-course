import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '@/components/shared/SearchBar'
import MathText from '@/components/shared/MathText'
import { search } from '@/data/search-index'
import type { SearchResult, SearchFilterType } from '@/types'

const FILTER_OPTIONS: Array<{ value: SearchFilterType; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'chapter', label: '章节' },
  { value: 'knowledge-point', label: '知识点' },
  { value: 'question-type', label: '题型' },
  { value: 'common-mistake', label: '易错点' },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<SearchFilterType>('all')

  const results = useMemo(() => {
    if (!query.trim()) return []
    return search(query, 20, activeFilter)
  }, [query, activeFilter])

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">搜索</h1>

      <SearchBar
        large
        placeholder="输入关键词搜索——知识点名称、课程标题、题型、易错点..."
        onSearch={setQuery}
      />

      <div className="flex gap-2 my-4">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeFilter === opt.value
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 mt-4">
        {results.length === 0 && query && (
          <p className="text-center py-8 text-gray-400">未找到匹配 "{query}" 的结果</p>
        )}
        {results.map((r, i) => (
          <SearchResultCard key={`${r.id}-${i}`} result={r} />
        ))}
      </div>
    </div>
  )
}

function SearchResultCard({ result }: { result: SearchResult }) {
  return (
    <Link
      to={result.route}
      className="block p-4 rounded-lg border border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
          result.type === 'concept' ? 'bg-blue-50 text-blue-600' :
          result.type === 'lecture' ? 'bg-green-50 text-green-600' :
          result.type === 'question-type' ? 'bg-amber-50 text-amber-600' :
          'bg-red-50 text-red-600'
        }`}>
          {result.type === 'concept' ? '知识点' :
           result.type === 'lecture' ? '课程' :
           result.type === 'question-type' ? '题型' : '易错点'}
        </span>
        <h3 className="font-medium text-gray-900"><MathText>{result.title}</MathText></h3>
      </div>
      <p className="text-sm text-gray-500"><MathText>{result.snippet}</MathText></p>
      {result.context && <p className="mt-1 text-xs text-gray-400">{result.context}</p>}
    </Link>
  )
}
