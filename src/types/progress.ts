import type { LectureStatus } from './lecture'
import type { MasteryLevel } from './knowledge'

/** User learning progress state (persisted to localStorage) */
export interface UserProgress {
  /** Lecture ID → study status */
  lectureStatuses: Record<number, LectureStatus>
  /** Concept ID → mastery level */
  conceptMastery: Record<string, MasteryLevel>
  /** Lecture ID → completion-standard checkbox states */
  lessonCompletion: Record<number, boolean[]>
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
  lessonCompletion: {},
  lastStudiedLectureId: null,
  totalStudyTimeMinutes: 0,
  lastActivityAt: null,
}
