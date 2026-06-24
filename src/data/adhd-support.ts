import lessonSupportJson from '../../data/adhd-lesson-support.json'
import errorTypesJson from '../../data/error-types.json'
import reviewScheduleJson from '../../data/review-schedule.json'
import type {
  ErrorTypeDefinition,
  LessonSupportRecord,
  ResolvedLessonSupport,
  ReviewScheduleRule,
  ReviewStage,
} from '@/types'

const supportDefaults = lessonSupportJson.defaults
const lessonRecords = lessonSupportJson.lessons as LessonSupportRecord[]

export const ERROR_TYPES = errorTypesJson.error_types as ErrorTypeDefinition[]
export const REVIEW_STAGES: ReviewStage[] = ['D0', 'D1', 'D3', 'D7', 'D14']

export const REVIEW_SCHEDULE = Object.fromEntries(
  REVIEW_STAGES.map((stage) => [
    stage,
    reviewScheduleJson[stage] as ReviewScheduleRule,
  ]),
) as Record<ReviewStage, ReviewScheduleRule>

export const FIVE_SECOND_BRAKE = [...supportDefaults.five_second_brake]
export const ERROR_FOUR_QUESTIONS = [...supportDefaults.error_four_questions]

export function getLessonSupport(lectureId: number): ResolvedLessonSupport | undefined {
  const lesson = lessonRecords.find((item) => item.lecture_id === lectureId)
  if (!lesson) return undefined

  return {
    ...lesson,
    textbook_version: supportDefaults.textbook_version,
    five_second_brake: [...supportDefaults.five_second_brake],
    error_four_questions: [...supportDefaults.error_four_questions],
    review_schedule: [...supportDefaults.review_schedule] as ReviewStage[],
    short_units: [...supportDefaults.short_units],
    completion_standard: [...supportDefaults.completion_standard],
  }
}

export function getAllLessonSupports(): ResolvedLessonSupport[] {
  return lessonRecords
    .map((lesson) => getLessonSupport(lesson.lecture_id))
    .filter((lesson): lesson is ResolvedLessonSupport => Boolean(lesson))
}

