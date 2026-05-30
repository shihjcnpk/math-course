import { useState } from 'react'
import type { OralTask } from '@/types'
import MathText from '@/components/shared/MathText'

interface Props { task: OralTask }

export default function OralTaskSection({ task }: Props) {
  const [revealed, setRevealed] = useState(false)
  if (!task.problem) return null

  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speakScript = () => {
    if (!canSpeak) return
    window.speechSynthesis.cancel()
    const fullText = `这道题考的是：${task.script.join('。')}`
    const utterance = new SpeechSynthesisUtterance(fullText)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">口头讲题任务</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="font-medium text-gray-900 mb-2">请把这道题讲出来：</p>
        <p className="text-sm text-gray-700 mb-4 p-3 bg-gray-50 rounded leading-relaxed"><MathText>{task.problem}</MathText></p>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setRevealed(!revealed)}
            className="text-sm px-3 py-1 rounded border border-primary-200 text-primary-700 hover:bg-primary-50"
          >
            {revealed ? '隐藏讲题提纲' : '查看讲题提纲'}
          </button>
          {canSpeak && revealed && (
            <button onClick={speakScript} className="text-sm px-3 py-1 rounded border border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50">
              语音朗读提纲
            </button>
          )}
        </div>

        {revealed && (
          <div className="p-3 bg-indigo-50 rounded border border-indigo-100">
            <p className="text-xs font-medium text-indigo-700 mb-2">讲题格式：</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              {task.script.map((line, i) => (
                <li key={i}><MathText>{line}</MathText></li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
