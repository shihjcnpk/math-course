import type { StateCreator } from 'zustand'
import type { SearchFilters, SearchFilterType } from '@/types'

export interface SearchSlice {
  query: string
  filters: SearchFilters
  setQuery: (q: string) => void
  setFilterType: (type: SearchFilterType) => void
  setFilterModule: (moduleId?: number) => void
  clearSearch: () => void
}

export const createSearchSlice: StateCreator<SearchSlice, [], [], SearchSlice> = (set) => ({
  query: '',
  filters: { type: 'all' },

  setQuery: (q) => set({ query: q }),
  setFilterType: (type) => set((state) => ({ filters: { ...state.filters, type } })),
  setFilterModule: (moduleId) => set((state) => ({ filters: { ...state.filters, moduleId } })),
  clearSearch: () => set({ query: '', filters: { type: 'all' } }),
})
