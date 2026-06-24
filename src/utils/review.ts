import { REVIEW_SCHEDULE, REVIEW_STAGES } from '@/data/adhd-support'
import type { ErrorEntry, ReviewStage } from '@/types'

export type ReviewBuckets = Record<ReviewStage, ErrorEntry[]>

function startOfLocalDay(timestamp: number): number {
  const date = new Date(timestamp)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function daysSince(timestamp: number, now = Date.now()): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return Math.max(0, Math.floor((startOfLocalDay(now) - startOfLocalDay(timestamp)) / millisecondsPerDay))
}

export function buildReviewQueue(errors: ErrorEntry[], now = Date.now()): ReviewBuckets {
  const buckets = Object.fromEntries(
    REVIEW_STAGES.map((stage) => [stage, [] as ErrorEntry[]]),
  ) as ReviewBuckets

  for (const error of errors) {
    if (error.reMastered) continue
    const age = daysSince(error.timestamp, now)
    const nextStageIndex = REVIEW_STAGES.findIndex(
      (stage) => error.reviewRecords?.[stage]?.outcome !== 'correct',
    )
    if (nextStageIndex === -1) continue

    const nextDue = REVIEW_STAGES[nextStageIndex]
    const previousStage = REVIEW_STAGES[nextStageIndex - 1]
    const previousCompletedAt = previousStage
      ? error.reviewRecords?.[previousStage]?.completedAt
      : undefined
    const previousWasCompletedToday = previousCompletedAt
      ? daysSince(previousCompletedAt, now) === 0
      : false

    if (
      age < REVIEW_SCHEDULE[nextDue].offset_days
      || previousWasCompletedToday
    ) {
      continue
    }

    buckets[nextDue].push(error)
  }

  return buckets
}
