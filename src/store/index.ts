import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createProgressSlice, type ProgressSlice } from './progressSlice'
import { createErrorSlice, type ErrorSlice } from './errorSlice'
import { createSearchSlice, type SearchSlice } from './searchSlice'
import { createGraphSlice, type GraphSlice } from './graphSlice'
import { DEFAULT_PROGRESS } from '@/types'

export type AppStore = ProgressSlice & ErrorSlice & SearchSlice & GraphSlice

export const useStore = create<AppStore>()(
  persist(
    (...args) => ({
      ...createProgressSlice(...args),
      ...createErrorSlice(...args),
      ...createSearchSlice(...args),
      ...createGraphSlice(...args),
    }),
    {
      name: 'math-course-store',
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppStore>
        return {
          ...state,
          progress: {
            ...DEFAULT_PROGRESS,
            ...(state.progress || {}),
            lessonCompletion: state.progress?.lessonCompletion || {},
          },
        } as AppStore
      },
      partialize: (state) => ({
        // Only persist progress and errors, not transient UI state
        progress: state.progress,
        errors: state.errors,
      }),
    },
  ),
)
