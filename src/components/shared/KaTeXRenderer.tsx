import { memo, useMemo } from 'react'
import katex from 'katex'

interface Props {
  formula: string
  displayMode?: boolean
  className?: string
}

/**
 * Thin wrapper around KaTeX for rendering math formulas.
 * Memoized by formula string to avoid re-rendering.
 */
const KaTeXRenderer = memo(function KaTeXRenderer({
  formula,
  displayMode = false,
  className = '',
}: Props) {
  const normalizedFormula = useMemo(() => {
    const trimmed = formula.trim()
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.indexOf('$$', 2) === trimmed.length - 2) {
      return trimmed.slice(2, -2).trim()
    }
    if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.indexOf('$', 1) === trimmed.length - 1) {
      return trimmed.slice(1, -1).trim()
    }
    return formula
  }, [formula])

  const html = useMemo(() => {
    try {
      return katex.renderToString(normalizedFormula, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: false,
      })
    } catch {
      return null
    }
  }, [normalizedFormula, displayMode])

  if (html === null) {
    return <span className={`text-red-500 ${className}`}>[公式错误: {normalizedFormula}]</span>
  }

  if (displayMode) {
    return (
      <span
        className={`katex-display block my-4 text-center overflow-x-auto text-[1.06rem] leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <span
      className={`inline-block align-middle text-[1.04em] ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
})

export default KaTeXRenderer
