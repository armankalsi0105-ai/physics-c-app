import type { MasteryLevel, ProgressState } from './types'

export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  unstarted: 'Unstarted',
  practiced: 'Practiced',
  level1: 'Level 1',
  mastered: 'Mastered',
}

export const MASTERY_ORDER: MasteryLevel[] = [
  'unstarted',
  'practiced',
  'level1',
  'mastered',
]

export function masteryRank(level: MasteryLevel): number {
  return MASTERY_ORDER.indexOf(level)
}

export function maxMastery(a: MasteryLevel, b: MasteryLevel): MasteryLevel {
  return masteryRank(a) >= masteryRank(b) ? a : b
}

/** Derive mastery for a day from progress signals. */
export function computeDayMastery(
  day: number,
  state: ProgressState,
): MasteryLevel {
  const key = String(day)
  const stored = state.skillMastery[key]
  const quiz = state.quizScores[key]
  const practiced =
    state.solvedProblems.some((id) => id.startsWith(`d${day}-`)) ||
    Object.keys(state.flashcards).some((id) => id.startsWith(`d${day}-`))

  let level: MasteryLevel = 'unstarted'
  if (practiced || typeof quiz === 'number') level = 'practiced'
  if (typeof quiz === 'number' && quiz >= 2) level = 'level1'
  if (typeof quiz === 'number' && quiz >= 3) level = 'mastered'

  // SRS clear for a day problem counts toward mastered if already level1
  const srsClear =
    level === 'level1' &&
    !state.srsQueue.some((s) => s.day === day) &&
    state.solvedProblems.some((id) => id.startsWith(`d${day}-`))
  if (srsClear) level = 'mastered'

  if (stored) return maxMastery(stored, level)
  return level
}

export function withMasteryUpdate(
  state: ProgressState,
  day: number,
  bump?: MasteryLevel,
): ProgressState {
  const key = String(day)
  const computed = computeDayMastery(day, state)
  const next = bump ? maxMastery(computed, bump) : computed
  if (state.skillMastery[key] === next) return state
  return {
    ...state,
    skillMastery: { ...state.skillMastery, [key]: next },
  }
}
