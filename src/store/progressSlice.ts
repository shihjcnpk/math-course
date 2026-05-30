import type { StateCreator } from 'zustand'
import type { LectureStatus, UserProgress, MasteryLevel } from '@/types'
import { DEFAULT_PROGRESS } from '@/types'

export interface ProgressSlice {
  progress: UserProgress
  markLectureStatus: (lectureId: number, status: LectureStatus) => void
  markConceptMastery: (conceptId: string, level: MasteryLevel) => void
  setLastStudied: (lectureId: number) => void
  addStudyTime: (minutes: number) => void
  resetProgress: () => void
}

export const createProgressSlice: StateCreator<ProgressSlice, [], [], ProgressSlice> = (set) => ({
  progress: DEFAULT_PROGRESS,

  markLectureStatus: (lectureId, status) =>
    set((state) => ({
      progress: {
        ...state.progress,
        lectureStatuses: { ...state.progress.lectureStatuses, [lectureId]: status },
        lastActivityAt: Date.now(),
      },
    })),

  markConceptMastery: (conceptId, level) =>
    set((state) => ({
      progress: {
        ...state.progress,
        conceptMastery: { ...state.progress.conceptMastery, [conceptId]: level },
        lastActivityAt: Date.now(),
      },
    })),

  setLastStudied: (lectureId) =>
    set((state) => ({
      progress: {
        ...state.progress,
        lastStudiedLectureId: lectureId,
        lastActivityAt: Date.now(),
      },
    })),

  addStudyTime: (minutes) =>
    set((state) => ({
      progress: {
        ...state.progress,
        totalStudyTimeMinutes: state.progress.totalStudyTimeMinutes + minutes,
        lastActivityAt: Date.now(),
      },
    })),

  resetProgress: () =>
    set({ progress: DEFAULT_PROGRESS }),
})
