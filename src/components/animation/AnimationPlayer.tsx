import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { getAnimationById } from '@/data/animation-registry'
import { ANIMATION_COMPONENTS } from './animation-components'
import type { AnimationPlaybackState } from '@/types'

interface Props {
  animationId: string
}

function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

export default function AnimationPlayer({ animationId }: Props) {
  const meta = getAnimationById(animationId)
  const [phase, setPhase] = useState(0)
  const [playState, setPlayState] = useState<AnimationPlaybackState>('stopped')
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const totalPhases = meta?.phases.length || 1
  const Component = ANIMATION_COMPONENTS[animationId]
  const speechSupported = canSpeak()

  const narrationFor = useCallback((index: number) => {
    if (!meta) return ''
    return meta.narration?.[index] || meta.phases[index] || meta.description
  }, [meta])

  const speakPhase = useCallback((index: number) => {
    if (!speechSupported) return
    const text = narrationFor(index)
    if (!text) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.92
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }, [narrationFor, speechSupported])

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
      }
      if (canSpeak()) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (voiceEnabled) {
      speakPhase(phase)
    }
  }, [phase, speakPhase, voiceEnabled])

  function clearTimer() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function play() {
    clearTimer()
    setPlayState('playing')
    if (voiceEnabled) {
      speakPhase(phase)
    }
    intervalRef.current = window.setInterval(() => {
      setPhase((p) => {
        if (p >= totalPhases - 1) {
          clearTimer()
          setPlayState('stopped')
          return p
        }
        return p + 1
      })
    }, 3500)
  }

  function pause() {
    clearTimer()
    if (speechSupported) {
      window.speechSynthesis.cancel()
    }
    setPlayState('paused')
  }

  function reset() {
    clearTimer()
    if (speechSupported) {
      window.speechSynthesis.cancel()
    }
    setPlayState('stopped')
    setPhase(0)
  }

  function stepForward() {
    clearTimer()
    setPlayState('paused')
    setPhase((p) => Math.min(p + 1, totalPhases - 1))
  }

  function stepBack() {
    clearTimer()
    setPlayState('paused')
    setPhase((p) => Math.max(p - 1, 0))
  }

  function toggleVoice() {
    if (!speechSupported) return
    const nextEnabled = !voiceEnabled
    setVoiceEnabled(nextEnabled)
    if (nextEnabled) {
      speakPhase(phase)
    } else {
      window.speechSynthesis.cancel()
    }
  }

  if (!meta || !Component) {
    return (
      <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
        图示元数据已登记，但 SVG 组件尚未实现：{animationId}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 min-h-[280px] flex items-center justify-center">
        <Suspense fallback={<div className="text-gray-400">加载中...</div>}>
          <Component phase={phase} playing={playState === 'playing'} />
        </Suspense>
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">{meta.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{meta.description}</p>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">
            阶段 {phase + 1}/{totalPhases}
          </span>
        </div>

        <div className="flex justify-center gap-1.5 mb-2">
          {meta.phases.map((p, i) => (
            <button
              key={i}
              onClick={() => { setPhase(i); setPlayState('paused') }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === phase ? 'bg-primary-500 w-4' :
                i < phase ? 'bg-primary-300' : 'bg-gray-300'
              }`}
              title={p}
              aria-label={`跳到阶段${i + 1}：${p}`}
            />
          ))}
        </div>
        <p className="text-xs font-medium text-primary-700 text-center mb-2">{meta.phases[phase]}</p>

        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={reset} className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50">
            重置
          </button>
          <button onClick={stepBack} className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50">
            上一步
          </button>
          <button
            onClick={playState === 'playing' ? pause : play}
            className="px-3 py-1 text-xs rounded bg-primary-500 text-white hover:bg-primary-600"
          >
            {playState === 'playing' ? '暂停' : '播放'}
          </button>
          <button onClick={stepForward} className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50">
            下一步
          </button>
          <button
            onClick={toggleVoice}
            disabled={!speechSupported}
            className={`px-2 py-1 text-xs rounded border ${
              voiceEnabled
                ? 'border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700'
                : 'border-gray-200 hover:bg-gray-50'
            } disabled:cursor-not-allowed disabled:text-gray-400`}
            title={speechSupported ? '开启后会朗读当前动画阶段讲解' : '当前浏览器不支持语音合成'}
          >
            {voiceEnabled ? '关闭配音' : '开启配音'}
          </button>
        </div>
      </div>
    </div>
  )
}
