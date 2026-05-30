import type { GradeLevel } from './knowledge'

/** Student's learning status for a lecture */
export type LectureStatus = 'not-started' | 'in-progress' | 'needs-review' | 'error-prone' | 'mastered'

/** Section types within a lecture */
export type SectionType = 'position' | 'knowledge-network' | 'concept' | 'method' | 'example' | 'exercise' | 'error-analysis' | 'connection' | 'oral-task' | 'error-card'

/** Module definition */
export interface ModuleInfo {
  id: number            // 1-8
  title: string         // e.g. '数与式'
  subtitle: string      // e.g. '模块二'
  description: string
  lectureRange: [number, number]  // inclusive
  color: string         // Tailwind color class
  gradeLevel: GradeLevel | 'both'
}

/** Lecture metadata */
export interface LectureMeta {
  id: number
  title: string
  moduleId: number
  orderInModule: number
  overview: string
  objectives: string[]
  durationMinutes: number
  oneLineMainIdea: string
  /** Knowledge node IDs covered in this lecture */
  conceptIds: string[]
  /** IDs of prerequisite lectures */
  prerequisiteLectureIds: number[]
  /** IDs of follow-up lectures that build on this one */
  followupLectureIds: number[]
  /** Is this one of the 5 priority full-content lectures? */
  isFullContent: boolean
}

/** Knowledge network navigation for a lecture */
export interface KnowledgeNetwork {
  /** What old knowledge this lecture depends on */
  fromWhere: string[]
  /** Core knowledge nodes covered here and their relationships */
  currentCore: string[]
  /** What future content this lecture enables */
  toWhere: string[]
  /** Legacy text description of the relationship diagram */
  relationDiagram: string
}

/** Concept explanation section */
export interface ConceptExplanation {
  title: string
  /** Life analogy or intuitive explanation first */
  everydayAnalogy: string
  /** Formal math description */
  formalDefinition: string
  /** KaTeX formula if applicable */
  formula?: string
  /** Related reminders */
  associationReminders: string[]
}

/** Problem-solving method */
export interface CoreMethod {
  name: string
  /** Where this method comes from (derivation) */
  derivation: string
  /** Step-by-step procedure */
  steps: string[]
  /** Visual explanation with KaTeX */
  visualExplanation?: string
}

/** Typical question type */
export interface TypicalQuestion {
  name: string
  /** Optional knowledge chain breakdown for complex examples */
  knowledgeChain?: string[]
  /** The essence of this question type */
  essence: string
  /** Step-by-step solution approach */
  solutionSteps: string[]
  /** Worked example */
  example: {
    problem: string
    stepByStepAnalysis: string[]
    answer: string
    commonMistake: string
  }
  /** Similar variation problems */
  variations: {
    problem: string
    hint: string
    answer: string
  }[]
  /** One-sentence summary */
  summary: string
}

/** Common mistake entry */
export interface LectureMistake {
  wrongExample: string
  wrongReason: string
  correctApproach: string
  relatedReminder: string
}

/** Exercise */
export interface LectureExercise {
  id: string
  question: string       // Markdown + KaTeX
  answer: string
  hint?: string
  difficulty: 'basic' | 'intermediate' | 'challenge' | 'transfer'
  /** Knowledge node IDs to flag if student gets this wrong */
  flaggedConceptIds: string[]
  /** Knowledge chain breakdown (for knowledge-transfer questions) */
  knowledgeChain?: string[]
}

/** Exercise section with tiered problems */
export interface ExerciseSection {
  basic: LectureExercise[]        // 60% of exercises
  intermediate: LectureExercise[] // 30%
  challenge: LectureExercise[]    // 10%
  knowledgeTransfer: LectureExercise[] // knowledge migration questions
}

/** Oral task for student self-explanation */
export interface OralTask {
  problem: string
  script: string[]
}

/** Error review card */
export interface ErrorCard {
  fields: {
    errorNumber: string
    errorType: string
    errorReason: string
    correctMethod: string
    similarPractice: string
    mastered: boolean
  }
}

/** Full lecture content */
export interface Lecture {
  meta: LectureMeta
  knowledgeNetwork: KnowledgeNetwork
  concepts: ConceptExplanation[]
  coreMethods: CoreMethod[]
  typicalQuestions: TypicalQuestion[]
  commonMistakes: LectureMistake[]
  exercises: ExerciseSection
  oralTask: OralTask
  errorCard: ErrorCard
  animationIds: string[]
}

/** Searchable lecture reference (for search index) */
export interface LectureRef {
  id: number
  title: string
  moduleId: number
  keywords: string[]
  conceptIds: string[]
  questionTypes: string[]
  mistakePatterns: string[]
}
