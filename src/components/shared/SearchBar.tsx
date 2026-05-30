import { useState, useCallback } from 'react'

interface Props {
  placeholder?: string
  onSearch: (query: string) => void
  large?: boolean
}

export default function SearchBar({ placeholder = '搜索知识点、题型、易错点...', onSearch, large = false }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSearch(value.trim())
    },
    [value, onSearch],
  )

  const handleClear = useCallback(() => {
    setValue('')
    onSearch('')
  }, [onSearch])

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent pl-10 pr-8 ${
          large ? 'text-lg py-3' : 'text-sm py-2'
        }`}
      />
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </form>
  )
}
