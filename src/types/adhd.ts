export type ReviewStage = 'D0' | 'D1' | 'D3' | 'D7' | 'D14'

export interface ReviewScheduleRule {
  name: string
  task: string
  purpose: string
  offset_days: number
  output_slot: string
}

export interface ErrorTypeDefinition {
  id: string
  name: string
  category: string
  description: string
  typical_behaviors: string[]
  correction_action: string
  reminder_sentence: string
  related_topics: string[]
  related_knowledge_thread: string[]
  parent_guidance: string
}

export type KnowledgeThreadId =
  | 'number-expression'
  | 'equation-inequality'
  | 'function'
  | 'geometry-reasoning'
  | 'data-statistics'

export interface KnowledgeThreadDefinition {
  id: KnowledgeThreadId
  name: string
  core_question: string
  sequence: string[]
  textbook_chapter_ids: number[]
  lecture_ids: number[]
  prerequisites: string[]
  followups: string[]
  high_frequency_question_types: string[]
  high_frequency_error_types: string[]
  confusable_topics: string[]
  key_action: string
}

export interface LessonStartSupport {
  one_task: string
  warmup_question: string
  warmup_answer: string
  attention_reminder: string
}

export interface AttentionAnchor {
  key_point: string
  common_trap: string
  before_action: string
}

export interface ParentGuidance {
  avoid: string
  say: string
  one_habit: string
}

export interface LessonSupportRecord {
  lecture_id: number
  grade_scope: string
  textbook_chapters: string[]
  core_question: string
  start: LessonStartSupport
  attention_anchor: AttentionAnchor
  variant_task: string
  parent_guidance: ParentGuidance
  priority: 'high' | 'normal'
  alignment_status: 'aligned' | 'integrated-review' | 'manual-review'
  manual_review_notes?: string[]
}

export interface ResolvedLessonSupport extends LessonSupportRecord {
  textbook_version: string
  five_second_brake: string[]
  error_four_questions: string[]
  review_schedule: ReviewStage[]
  short_units: string[]
  completion_standard: string[]
}

export interface TextbookChapter {
  id: number
  grade: 7 | 8
  volume: '上册' | '下册'
  edition: string
  title: string
  lecture_ids: number[]
  coverage: 'complete' | 'partial'
  missing_topics: string[]
}
