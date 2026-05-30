import KaTeXRenderer from './KaTeXRenderer'

interface Props {
  children: string
  className?: string
}

type Token =
  | { type: 'text'; value: string }
  | { type: 'inlineMath'; value: string }
  | { type: 'blockMath'; value: string }

function tokenizeMathText(text: string): Token[] {
  const tokens: Token[] = []
  let cursor = 0

  while (cursor < text.length) {
    const blockStart = text.indexOf('$$', cursor)
    const inlineStart = text.indexOf('$', cursor)

    if (blockStart === -1 && inlineStart === -1) {
      tokens.push({ type: 'text', value: text.slice(cursor) })
      break
    }

    const useBlock = blockStart !== -1 && (inlineStart === -1 || blockStart <= inlineStart)
    const start = useBlock ? blockStart : inlineStart
    const delimiter = useBlock ? '$$' : '$'

    if (start > cursor) {
      tokens.push({ type: 'text', value: text.slice(cursor, start) })
    }

    const contentStart = start + delimiter.length
    const end = text.indexOf(delimiter, contentStart)
    if (end === -1) {
      tokens.push({ type: 'text', value: text.slice(start) })
      break
    }

    const value = text.slice(contentStart, end).trim()
    tokens.push({ type: useBlock ? 'blockMath' : 'inlineMath', value })
    cursor = end + delimiter.length
  }

  return tokens
}

function TextWithBreaks({ value }: { value: string }) {
  return (
    <>
      {value.split('\n').map((part, index, arr) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

function isLikelyStandaloneLatex(text: string) {
  if (text.includes('$')) return false
  return /\\(begin|end|text|frac|sqrt|times|div|cdot|leq|geq|neq|quad|qquad|left|right|sum|bar|Delta|rightarrow|Rightarrow|boxed|underbrace|pm)\b/.test(text)
}

export default function MathText({ children, className = '' }: Props) {
  if (isLikelyStandaloneLatex(children)) {
    return (
      <span className={className}>
        <KaTeXRenderer formula={children.trim()} displayMode className="my-2" />
      </span>
    )
  }

  const tokens = tokenizeMathText(children)

  return (
    <span className={className}>
      {tokens.map((token, index) => {
        if (token.type === 'text') {
          return <TextWithBreaks key={index} value={token.value} />
        }
        if (token.type === 'blockMath') {
          return <KaTeXRenderer key={index} formula={token.value} displayMode className="my-2" />
        }
        return <KaTeXRenderer key={index} formula={token.value} />
      })}
    </span>
  )
}
