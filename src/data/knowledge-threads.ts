import knowledgeThreadsJson from '../../data/knowledge-threads.json'
import type { KnowledgeThreadDefinition } from '@/types'

export const KNOWLEDGE_THREADS = knowledgeThreadsJson.threads as KnowledgeThreadDefinition[]

export function getKnowledgeThreadsForLecture(lectureId: number): KnowledgeThreadDefinition[] {
  return KNOWLEDGE_THREADS.filter((thread) => thread.lecture_ids.includes(lectureId))
}

export function getKnowledgeThreadsForLectures(lectureIds: number[]): KnowledgeThreadDefinition[] {
  return KNOWLEDGE_THREADS.filter((thread) =>
    thread.lecture_ids.some((lectureId) => lectureIds.includes(lectureId)),
  )
}
