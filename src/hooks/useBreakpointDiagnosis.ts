import { useCallback } from 'react'
import { useStore } from '@/store'
import { diagnoseBreakpoint } from '@/utils/breakpoint'
import type { BreakpointDiagnosis } from '@/types'

/**
 * Hook for breakpoint diagnosis — identifies root-cause prerequisite
 * weaknesses when a student makes an error on a given concept.
 *
 * Usage:
 *   const { runDiagnosis, diagnoseAll, getDiagnosis } = useBreakpointDiagnosis()
 *
 *   // Diagnose a single error
 *   runDiagnosis(errorId, conceptId)
 *
 *   // Diagnose all unresolved, undiagnosed errors
 *   diagnoseAll()
 *
 *   // Compute diagnosis without storing (for preview)
 *   const preview = getDiagnosis(conceptId)
 */
export function useBreakpointDiagnosis() {
  const conceptMastery = useStore((s) => s.progress.conceptMastery)
  const errors = useStore((s) => s.errors)
  const updateDiagnosis = useStore((s) => s.updateDiagnosis)

  /** Get weak concept IDs from current mastery state */
  const getWeakConceptIds = useCallback((): string[] => {
    return Object.entries(conceptMastery)
      .filter(([, level]) => level === 'weak')
      .map(([id]) => id)
  }, [conceptMastery])

  /**
   * Compute diagnosis for a concept without updating the store.
   * Useful for previewing before the error is saved.
   */
  const getDiagnosis = useCallback(
    (conceptId: string): BreakpointDiagnosis => {
      const weakConceptIds = getWeakConceptIds()
      return diagnoseBreakpoint(conceptId, weakConceptIds)
    },
    [getWeakConceptIds],
  )

  /**
   * Run diagnosis for a specific error and persist it to the store.
   */
  const runDiagnosis = useCallback(
    (errorId: string, conceptId: string): BreakpointDiagnosis => {
      const weakConceptIds = getWeakConceptIds()
      const diagnosis = diagnoseBreakpoint(conceptId, weakConceptIds)
      updateDiagnosis(errorId, diagnosis)
      return diagnosis
    },
    [getWeakConceptIds, updateDiagnosis],
  )

  /**
   * Diagnose all unresolved errors that don't yet have a diagnosis.
   * Returns the count of errors that were diagnosed.
   */
  const diagnoseAll = useCallback((): number => {
    const weakConceptIds = getWeakConceptIds()
    let count = 0

    for (const error of errors) {
      if (!error.resolved && !error.diagnosis && error.conceptId) {
        const diagnosis = diagnoseBreakpoint(error.conceptId, weakConceptIds)
        updateDiagnosis(error.id, diagnosis)
        count++
      }
    }

    return count
  }, [errors, getWeakConceptIds, updateDiagnosis])

  return { runDiagnosis, diagnoseAll, getDiagnosis, getWeakConceptIds }
}

export default useBreakpointDiagnosis
