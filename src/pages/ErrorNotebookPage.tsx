import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { useBreakpointDiagnosis } from '@/hooks/useBreakpointDiagnosis'
import { getModuleForLecture, modules } from '@/data/modules'
import { getNodeById } from '@/data/knowledge-nodes'
import { CATEGORY_LABELS, type ConceptCategory } from '@/types'
import type { ErrorEntry } from '@/types'
import ErrorDetail from '@/components/error/ErrorDetail'
import MathText from '@/components/shared/MathText'

type FilterMode = 'all' | 'unresolved' | 'resolved'

export default function ErrorNotebookPage() {
  const errors = useStore((s) => s.errors)
  const toggleResolved = useStore((s) => s.toggleResolved)
  const toggleReMastered = useStore((s) => s.toggleReMastered)
  const deleteError = useStore((s) => s.deleteError)

  const { diagnoseAll } = useBreakpointDiagnosis()

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [moduleFilter, setModuleFilter] = useState<number | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<ConceptCategory | null>(null)
  const [diagnoseMessage, setDiagnoseMessage] = useState<string | null>(null)

  // Multi-criteria filter
  const filtered = useMemo(() => {
    return errors.filter((e) => {
      if (filterMode === 'unresolved' && e.resolved) return false
      if (filterMode === 'resolved' && !e.resolved) return false

      if (moduleFilter !== null) {
        const mod = getModuleForLecture(e.lectureId)
        if (!mod || mod.id !== moduleFilter) return false
      }

      if (categoryFilter !== null) {
        const node = e.conceptId ? getNodeById(e.conceptId) : null
        if (!node || node.category !== categoryFilter) return false
      }

      return true
    })
  }, [errors, filterMode, moduleFilter, categoryFilter])

  const handleDiagnoseAll = useCallback(() => {
    const count = diagnoseAll()
    setDiagnoseMessage(
      count > 0
        ? `已为 ${count} 条错题完成诊断`
        : '没有需要诊断的错题（所有未解决的错题已有诊断结果）',
    )
    setTimeout(() => setDiagnoseMessage(null), 3000)
  }, [diagnoseAll])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">错题本</h1>
          <p className="text-gray-500 text-sm">记录每道错题，诊断知识断点，回补薄弱环节</p>
        </div>

        {/* Auto-diagnose button */}
        <button
          onClick={handleDiagnoseAll}
          className="text-sm px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center gap-1.5"
        >
          <span>🔍</span>
          <span>全部自动诊断</span>
        </button>
      </div>

      {diagnoseMessage && (
        <div className="mb-3 px-3 py-2 text-xs rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
          {diagnoseMessage}
        </div>
      )}

      {/* Filter bar: status + module + category */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Status filter pills */}
        {(['all', 'unresolved', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterMode(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterMode === f ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {f === 'all' ? '全部' : f === 'unresolved' ? '未解决' : '已解决'}
          </button>
        ))}

        <span className="text-gray-300 mx-1">|</span>

        {/* Module filter */}
        <select
          value={moduleFilter ?? ''}
          onChange={(e) => setModuleFilter(e.target.value ? Number(e.target.value) : null)}
          className="text-xs px-2 py-1 rounded border border-gray-200 bg-white text-gray-600"
        >
          <option value="">全部模块</option>
          {modules
            .filter((m) => m.id >= 2) // Skip module 1 (overview)
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.subtitle} {m.title}
              </option>
            ))}
        </select>

        {/* Category filter */}
        <select
          value={categoryFilter ?? ''}
          onChange={(e) => setCategoryFilter((e.target.value as ConceptCategory) || null)}
          className="text-xs px-2 py-1 rounded border border-gray-200 bg-white text-gray-600"
        >
          <option value="">全部知识点类型</option>
          {(Object.entries(CATEGORY_LABELS) as [ConceptCategory, string][]).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <span className="ml-auto text-xs text-gray-400">{filtered.length} 条记录</span>
      </div>

      {/* Error list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg mb-2">暂无错题记录</p>
          <p className="text-sm">学习课程时遇到错题可以在这里记录和诊断</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <ErrorCard
              key={entry.id}
              entry={entry}
              isExpanded={expandedId === entry.id}
              onToggleExpand={() =>
                setExpandedId(expandedId === entry.id ? null : entry.id)
              }
              onToggleResolved={() => toggleResolved(entry.id)}
              onToggleReMastered={() => toggleReMastered(entry.id)}
              onDelete={() => {
                if (expandedId === entry.id) setExpandedId(null)
                deleteError(entry.id)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ErrorCard({
  entry,
  isExpanded,
  onToggleExpand,
  onToggleResolved,
  onToggleReMastered,
  onDelete,
}: {
  entry: ErrorEntry
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleResolved: () => void
  onToggleReMastered: () => void
  onDelete: () => void
}) {
  const moduleInfo = getModuleForLecture(entry.lectureId)

  return (
    <div
      className={`bg-white rounded-lg border transition-all ${
        entry.resolved ? 'border-green-200 opacity-75' : 'border-gray-200'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Metadata row */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Link
                to={`/lectures/${entry.lectureId}`}
                className="text-xs text-primary-600 hover:underline"
              >
                第{entry.lectureId}讲
              </Link>

              {moduleInfo && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                  {moduleInfo.subtitle}
                </span>
              )}

              <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-600">
                {entry.conceptName || entry.conceptId || '未分类'}
              </span>

              {entry.errorType && (
                <span className="text-[10px] text-gray-400"><MathText>{entry.errorType}</MathText></span>
              )}

              {entry.resolved && (
                <span className="text-xs text-green-500 font-medium">✓ 已解决</span>
              )}

              {entry.reMastered && (
                <span className="text-xs text-blue-500 font-medium">✓ 已重学掌握</span>
              )}

              {entry.diagnosis && entry.diagnosis.identifiedBreakpoints.length > 0 && (
                <span className="text-[10px] text-amber-500">
                  已诊断 {entry.diagnosis.identifiedBreakpoints.length} 个断点
                </span>
              )}
            </div>

            {/* Problem summary */}
            <p className="font-medium text-gray-800 text-sm"><MathText>{entry.problemDescription}</MathText></p>
            <p className="text-sm text-red-500 mt-1">错误答案：<MathText>{entry.wrongAnswer || '未填写'}</MathText></p>
            <p className="text-sm text-green-600">正确答案：<MathText>{entry.correctAnswer || '未填写'}</MathText></p>
          </div>

          {/* Expand/collapse button */}
          <button
            onClick={onToggleExpand}
            className="flex-shrink-0 text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
          >
            {isExpanded ? '收起 ▲' : '展开 ▼'}
          </button>
        </div>

        {/* Expanded detail view */}
        {isExpanded && (
          <ErrorDetail
            entry={entry}
            onToggleResolved={onToggleResolved}
            onToggleReMastered={onToggleReMastered}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  )
}
