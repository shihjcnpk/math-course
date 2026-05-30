import type { LectureStatus } from './lecture'
import type { MasteryLevel } from './knowledge'

/** User learning progress state (persisted to localStorage) */
export interface UserProgress {
  /** Lecture ID → study status */
  lectureStatuses: Record<number, LectureStatus>
  /** Concept ID → mastery level */
  conceptMastery: Record<string, MasteryLevel>
  /** Last lecture the student was studying */
  lastStudiedLectureId: number | null
  /** Total accumulated study time in minutes */
  totalStudyTimeMinutes: number
  /** Timestamp of last activity */
  lastActivityAt: number | null
}

/** Default progress state */
export const DEFAULT_PROGRESS: UserProgress = {
  lectureStatuses: {},
  conceptMastery: {},
  lastStudiedLectureId: null,
  totalStudyTimeMinutes: 0,
  lastActivityAt: null,
}
