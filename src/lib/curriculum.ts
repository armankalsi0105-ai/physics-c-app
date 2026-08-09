import curriculumJson from '@/data/curriculum.json'
import type { Curriculum, DayContent } from './types'

export const curriculum = curriculumJson as Curriculum

export function getDay(day: number): DayContent | undefined {
  return curriculum.days.find((d) => d.day === day)
}

export function youtubeId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/)
  return m?.[1] ?? ''
}
