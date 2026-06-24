import type { KnowledgeNetwork, KnowledgeThreadDefinition, ResolvedLessonSupport } from '@/types'
import MathText from '@/components/shared/MathText'

interface Props {
  support: ResolvedLessonSupport
  threads: KnowledgeThreadDefinition[]
  network?: KnowledgeNetwork
}

export default function AdhdLessonStart({ support, threads, network }: Props) {
  return (
    <section className="mb-8 space-y-4" aria-labelledby="lesson-start-title">
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
        <h2 id="lesson-start-title" className="text-lg font-semibold text-indigo-950">
          本节课在知识网络中的位置
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-700">
          <span className="mt-2 font-semibold text-indigo-900">所属知识主线：</span>
          {threads.map((thread) => (
            <span key={thread.id} className="mt-2 rounded-full bg-indigo-700 px-2 py-1 font-medium text-white">{thread.name}</span>
          ))}
          <span className="mt-2 rounded-full bg-white px-2 py-1 font-medium">{support.textbook_version}</span>
          <span>{support.grade_scope}</span>
          <span aria-hidden="true">·</span>
          <span>{support.textbook_chapters.join('；')}</span>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div><dt className="font-medium text-indigo-800">前置知识</dt><dd className="text-gray-700">{network?.fromWhere.slice(0, 2).map((item) => <span key={item} className="block"><MathText>{item}</MathText></span>) || '加载课程知识网络'}</dd></div>
          <div><dt className="font-medium text-indigo-800">后续关联</dt><dd className="text-gray-700">{network?.toWhere.slice(0, 2).map((item) => <span key={item} className="block"><MathText>{item}</MathText></span>) || '加载课程知识网络'}</dd></div>
          <div><dt className="font-medium text-indigo-800">本节核心问题</dt><dd className="text-indigo-950"><MathText>{support.core_question}</MathText></dd></div>
          <div><dt className="font-medium text-indigo-800">容易混淆或误用</dt><dd className="text-gray-700"><MathText>{support.attention_anchor.common_trap}</MathText></dd></div>
        </dl>
        <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm text-indigo-950">
          <span className="font-semibold">本节只解决一个关键问题：</span><MathText>{support.start.one_task}</MathText>
        </p>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-800">3分钟课前启动</h2>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">低门槛进入状态</span>
        </div>
        <p className="mt-3 text-sm font-medium text-gray-800">今天只做一件事</p>
        <p className="text-sm text-gray-600"><MathText>{support.start.one_task}</MathText></p>
        <div className="mt-3 rounded-lg bg-emerald-50 p-3">
          <p className="text-xs font-medium text-emerald-800">热身题</p>
          <p className="mt-1 text-sm text-gray-800"><MathText>{support.start.warmup_question}</MathText></p>
          <details className="mt-2 text-xs text-emerald-700">
            <summary className="cursor-pointer font-medium">完成后查看答案</summary>
            <p className="mt-1"><MathText>{support.start.warmup_answer}</MathText></p>
          </details>
        </div>
        <p className="mt-3 text-sm text-amber-700">
          <span className="font-medium">注意力提醒：</span>
          <MathText>{support.start.attention_reminder}</MathText>
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="text-lg font-semibold text-amber-900">注意力锚点</h2>
        <dl className="mt-2 space-y-2 text-sm">
          <div><dt className="inline font-medium text-amber-800">一句话抓重点：</dt><dd className="inline text-gray-700"> <MathText>{support.attention_anchor.key_point}</MathText></dd></div>
          <div><dt className="inline font-medium text-red-700">最容易错：</dt><dd className="inline text-gray-700"> <MathText>{support.attention_anchor.common_trap}</MathText></dd></div>
          <div><dt className="inline font-medium text-blue-700">做题前提醒：</dt><dd className="inline text-gray-700"> <MathText>{support.attention_anchor.before_action}</MathText></dd></div>
        </dl>
      </div>

      <details className="rounded-xl border border-gray-200 bg-white p-4">
        <summary className="cursor-pointer font-semibold text-gray-800">本讲短时学习单元</summary>
        <ol className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
          {support.short_units.map((unit, index) => (
            <li key={unit} className="rounded bg-gray-50 px-3 py-2">
              {index + 1}. {unit}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-gray-500">完成一个单元后可以暂停；超时不扣分，不需要一次连续学完。</p>
      </details>
    </section>
  )
}
