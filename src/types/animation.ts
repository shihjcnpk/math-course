/** Playback state for animation controls */
export type AnimationPlaybackState = 'stopped' | 'playing' | 'paused'

/** Metadata for an animation */
export interface AnimationMeta {
  id: string
  title: string
  description: string
  /** Which lecture this animation belongs to */
  lectureId: number
  /** Conceptual phases the animation walks through */
  phases: string[]
  /** Optional voice-over copy for each phase */
  narration?: string[]
  /** Estimated total duration at default speed */
  durationSeconds: number
}

/** Props passed to the AnimationPlayer */
export interface AnimationPlayerProps {
  animationId: string
  /** Additional config for the specific SVG component */
  config?: Record<string, unknown>
}
