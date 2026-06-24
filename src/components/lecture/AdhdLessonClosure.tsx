import { REVIEW_SCHEDULE } from '@/data/adhd-support'
import type { ResolvedLessonSupport } from '@/types'
import MathText from '@/components/shared/MathText'
import { useStore } from '@/store'

interface Props {
  support: ResolvedLessonSupport
  lectureId: number
}

export default function AdhdLessonClosure({ support, lectureId }: Props) {
  const savedCompletedItems = useStore((state) => state.progress.lessonCompletion[lectureId])
  const completedItems = savedCompletedItems ?? []
  const setLessonCompletionItem = useStore((state) => state.setLessonCompletionItem)
  const completedCount = support.completion_standard.filter((_, index) => completedItems[index]).length
  return (
    <section className="mb-8 space-y-4" aria-labelledby="lesson-closure-title">
      <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
        <h2 id="lesson-closure-title" className="text-lg font-semibold text-purple-900">间隔复习任务</h2>
        <p className="mt-1 text-sm text-purple-700">不是重复抄答案，每一次都要从记忆中重新提取。</p>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-5">
          {support.review_schedule.map((stage) => {
            const rule = REVIEW_SCHEDULE[stage]
            return (
              <div key={stage} className="rounded-lg border border-purple-100 bg-white p-3">
                <p className="text-xs font-bold text-purple-700">{stage} · {rule.name}</p>
                <p className="mt-1 text-xs text-gray-600">{rule.task}</p>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-sm text-purple-900">
          <span className="font-medium">本讲变式任务：</span>
          <MathText>{support.variant_task}</MathText>
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-800">本节课完成标准</h2>
        <p className="mt-1 text-xs text-blue-700">已达到 {completedCount}/{support.completion_standard.length} 项；勾选结果会保存在本机。</p>
        <ul className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
          {support.completion_standard.map((item, index) => (
            <li key={item}>
              <label className="flex cursor-pointer items-start gap-2 rounded p-1 hover:bg-blue-50">
                <input
                  type="checkbox"
                  checked={Boolean(completedItems[index])}
                  onChange={(event) => setLessonCompletionItem(lectureId, index, event.target.checked)}
                  className="mt-0.5 accent-blue-600"
                />
                <span className={completedItems[index] ? 'text-gray-400 line-through' : ''}>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
        <h2 className="text-lg font-semibold text-teal-900">家长陪伴提示</h2>
        <div className="mt-2 space-y-2 text-sm">
          <p><span className="font-medium text-red-700">不要说：</span>“{support.parent_guidance.avoid}”</p>
          <p><span className="font-medium text-green-700">可以说：</span>“{support.parent_guidance.say}”</p>
          <p><span className="font-medium text-teal-800">今天只盯一个习惯：</span>{support.parent_guidance.one_habit}</p>
        </div>
        <p className="mt-2 text-xs text-teal-700">每次陪伴不超过20分钟；只描述行为，不评价人格；优先肯定孩子自己发现错误。</p>
      </div>
    </section>
  )
}
