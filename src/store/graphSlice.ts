import type { StateCreator } from 'zustand'
import type { ConceptCategory } from '@/types'

export interface GraphSlice {
  selectedNodeId: string | null
  categoryFilter: ConceptCategory[]
  searchNodeQuery: string
  selectNode: (id: string | null) => void
  setCategoryFilter: (cats: ConceptCategory[]) => void
  toggleCategory: (cat: ConceptCategory) => void
  setSearchNodeQuery: (q: string) => void
  clearGraphState: () => void
}

export const createGraphSlice: StateCreator<GraphSlice, [], [], GraphSlice> = (set) => ({
  selectedNodeId: null,
  categoryFilter: [],
  searchNodeQuery: '',

  selectNode: (id) => set({ selectedNodeId: id }),
  setCategoryFilter: (cats) => set({ categoryFilter: cats }),

  toggleCategory: (cat) =>
    set((state) => ({
      categoryFilter: state.categoryFilter.includes(cat)
        ? state.categoryFilter.filter((c) => c !== cat)
        : [...state.categoryFilter, cat],
    })),

  setSearchNodeQuery: (q) => set({ searchNodeQuery: q }),
  clearGraphState: () => set({ selectedNodeId: null, categoryFilter: [], searchNodeQuery: '' }),
})
