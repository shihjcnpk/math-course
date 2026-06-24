import type { StateCreator } from 'zustand'
import type { ErrorEntry, ReviewStage } from '@/types'

export interface ErrorSlice {
  errors: ErrorEntry[]
  addError: (entry: Omit<ErrorEntry, 'id' | 'timestamp' | 'resolved' | 'reMastered'>) => void
  updateDiagnosis: (errorId: string, diagnosis: ErrorEntry['diagnosis']) => void
  toggleResolved: (errorId: string) => void
  toggleReMastered: (errorId: string) => void
  markReviewStage: (errorId: string, stage: ReviewStage, outcome: 'correct' | 'needs-work') => void
  deleteError: (errorId: string) => void
  clearAllErrors: () => void
}

let errorIdCounter = 0

export const createErrorSlice: StateCreator<ErrorSlice, [], [], ErrorSlice> = (set) => ({
  errors: [],

  addError: (entry) =>
    set((state) => ({
      errors: [
        {
          ...entry,
          id: `err-${Date.now()}-${++errorIdCounter}`,
          timestamp: Date.now(),
          resolved: false,
          reMastered: false,
        },
        ...state.errors,
      ],
    })),

  updateDiagnosis: (errorId, diagnosis) =>
    set((state) => ({
      errors: state.errors.map((e) =>
        e.id === errorId ? { ...e, diagnosis } : e,
      ),
    })),

  toggleResolved: (errorId) =>
    set((state) => ({
      errors: state.errors.map((e) =>
        e.id === errorId ? { ...e, resolved: !e.resolved } : e,
      ),
    })),

  toggleReMastered: (errorId) =>
    set((state) => ({
      errors: state.errors.map((e) =>
        e.id === errorId ? { ...e, reMastered: !e.reMastered } : e,
      ),
    })),

  markReviewStage: (errorId, stage, outcome) =>
    set((state) => ({
      errors: state.errors.map((e) =>
        e.id === errorId
          ? {
              ...e,
              reviewRecords: {
                ...e.reviewRecords,
                [stage]: { completedAt: Date.now(), outcome },
              },
              reMastered: stage === 'D14' && outcome === 'correct' ? true : e.reMastered,
            }
          : e,
      ),
    })),

  deleteError: (errorId) =>
    set((state) => ({
      errors: state.errors.filter((e) => e.id !== errorId),
    })),

  clearAllErrors: () => set({ errors: [] }),
})
