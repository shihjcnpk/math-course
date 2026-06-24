import textbookChaptersJson from '../../data/textbook-chapters.json'
import type { TextbookChapter } from '@/types'

export const textbookChapters = textbookChaptersJson.chapters as TextbookChapter[]

export function getTextbookChapter(id: number): TextbookChapter | undefined {
  return textbookChapters.find((chapter) => chapter.id === id)
}

