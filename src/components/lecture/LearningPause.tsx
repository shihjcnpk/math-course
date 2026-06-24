interface Props {
  title: '暂停一下' | '检查一下' | '想一想' | '说一说'
  prompt: string
}

export default function LearningPause({ title, prompt }: Props) {
  return (
    <aside className="mb-8 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3" aria-label={title}>
      <p className="text-sm font-semibold text-cyan-900">【{title}】</p>
      <p className="mt-1 text-sm text-cyan-800">{prompt}</p>
    </aside>
  )
}
