import type { KnowledgeThreadDefinition } from '@/types'

interface Props {
  threads: KnowledgeThreadDefinition[]
}

export default function KnowledgeThreadSummary({ threads }: Props) {
  if (!threads.length) return null

  return (
    <section className="mb-6 rounded-xl border border-indigo-200 bg-white p-4" aria-labelledby="thread-summary-title">
      <h2 id="thread-summary-title" className="text-lg font-semibold text-gray-900">单元知识网络结构表</h2>
      <p className="mt-1 text-sm text-gray-600">先找到本单元在数学网中的位置，再进入具体课程。</p>
      <div className="mt-4 space-y-4">
        {threads.map((thread) => (
          <article key={thread.id} className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-4">
            <h3 className="font-semibold text-indigo-900">{thread.name}</h3>
            <p className="mt-1 text-sm text-gray-700">{thread.sequence.join(' → ')}</p>
            <div className="mt-3 grid grid-cols-1 gap-3 text-xs text-gray-700 md:grid-cols-2">
              <div><span className="font-semibold text-indigo-800">教材章节：</span>第{thread.textbook_chapter_ids.join('、')}章</div>
              <div><span className="font-semibold text-indigo-800">前置：</span>{thread.prerequisites.join('；')}</div>
              <div><span className="font-semibold text-indigo-800">后续：</span>{thread.followups.join('；')}</div>
              <div><span className="font-semibold text-indigo-800">高频题型：</span>{thread.high_frequency_question_types.join('；')}</div>
              <div><span className="font-semibold text-indigo-800">高频错因：</span>{thread.high_frequency_error_types.join('；')}</div>
              <div><span className="font-semibold text-indigo-800">容易混淆：</span>{thread.confusable_topics.join('；')}</div>
            </div>
            <p className="mt-3 rounded bg-white px-3 py-2 text-sm font-medium text-indigo-900">
              本单元最重要的做题动作：{thread.key_action}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
