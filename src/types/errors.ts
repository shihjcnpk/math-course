/** Diagnosis result for an error — which prerequisite concepts are the real breakpoints */
export interface BreakpointDiagnosis {
  /** The surface-level concept where the error occurred */
  surfaceConceptId: string
  /** The surface concept name */
  surfaceConceptName: string
  /** Weak prerequisite concepts identified as root causes */
  identifiedBreakpoints: {
    conceptId: string
    conceptName: string
    reason: string
    confidence: 'high' | 'medium' | 'low'
    /** Which lecture to review to fix this breakpoint */
    reviewLectureId: number
  }[]
}

/** A single error entry in the error notebook */
export interface ErrorEntry {
  id: string
  timestamp: number
  lectureId: number
  lectureTitle: string
  /** The problem description */
  problemDescription: string
  /** User's incorrect answer */
  wrongAnswer: string
  /** The correct answer */
  correctAnswer: string
  /** Knowledge node ID where the error occurred */
  conceptId: string
  conceptName: string
  /** User-selected error type */
  errorType: string
  /** User's self-identified error reason */
  userNote: string
  /** System-generated breakpoint diagnosis */
  diagnosis?: BreakpointDiagnosis
  /** Has the user marked this as resolved? */
  resolved: boolean
  /** User-tagged: have they re-practiced and confirmed mastery? */
  reMastered: boolean
}
