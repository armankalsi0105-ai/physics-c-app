'use client'

import type { DayStatus, ProgressState } from './types'

const KEY = 'ap-physics-mastery-progress-v2'
const LEGACY_KEY = 'ap-physics-mastery-progress-v1'

export const createDefaultProgress = (): ProgressState => ({
  schemaVersion: 3,
  completedDays: [],
  activeDay: 1,
  streak: 0,
  lastStudyDate: null,
  totalSeconds: 0,
  quizScores: {},
  notes: {},
  sessionStartedAt: null,
  xp: 0,
  dailyGoalXp: 50,
  dailyXpEarned: 0,
  dailyXpDate: null,
  badges: [],
  theme: 'dark',
  srsQueue: [],
  flashcards: {},
  solvedProblems: [],
  setReps: {
    setCompletions: {},
    setStreak: {},
    workoutsCompleted: 0,
  },
  sandboxPrefs: {},
  pedagogy: {
    teachBack: {},
    confidence: {},
    objectivesChecked: {},
  },
  skillMastery: {},
  learnMode: {},
  kineticSessions: [],
  adaptive: {
    misconceptionCounts: {},
    focusTags: [],
    lastRecommendedDay: null,
  },
  examHistory: [],
  notebookCards: [],
  audioEnabled: false,
  quests: {
    weekKey: '',
    kineticSets: 0,
    srsReviews: 0,
    practiceCorrect: 0,
    claimed: [],
  },
  bossClears: [],
  speedrunBest: {},
  hiddenAchievements: [],
})

function asDayNum(v: unknown): number | null {
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isInteger(n) || n < 1 || n > 20) return null
  return n
}

/** Infer day numbers that show clear study activity (quiz / practice / notes). */
export function inferActiveDays(state: ProgressState): number[] {
  const days = new Set<number>()
  for (const key of Object.keys(state.quizScores ?? {})) {
    const d = asDayNum(key)
    if (d != null && typeof state.quizScores[key] === 'number') days.add(d)
  }
  for (const key of Object.keys(state.notes ?? {})) {
    const d = asDayNum(key)
    if (d != null && (state.notes[key] ?? '').trim().length > 0) days.add(d)
  }
  for (const key of Object.keys(state.pedagogy?.teachBack ?? {})) {
    const d = asDayNum(key)
    if (d != null && (state.pedagogy.teachBack[key] ?? '').trim().length > 0) {
      days.add(d)
    }
  }
  for (const key of Object.keys(state.pedagogy?.objectivesChecked ?? {})) {
    const d = asDayNum(key)
    if (d != null && (state.pedagogy.objectivesChecked[key] ?? []).some(Boolean)) {
      days.add(d)
    }
  }
  for (const id of state.solvedProblems ?? []) {
    const m = String(id).match(/^d(\d{1,2})[-_]/i)
    if (m) {
      const d = asDayNum(m[1])
      if (d != null) days.add(d)
    }
  }
  for (const id of Object.keys(state.flashcards ?? {})) {
    const m = String(id).match(/^d(\d{1,2})[-_]/i)
    if (m) {
      const d = asDayNum(m[1])
      if (d != null) days.add(d)
    }
  }
  for (const item of state.srsQueue ?? []) {
    const d = asDayNum(item.day)
    if (d != null) days.add(d)
  }
  return [...days].sort((a, b) => a - b)
}

/**
 * Backfill completedDays from quiz scores, prior activeDay, and study activity
 * so students who studied before sequential locks aren't stuck on Day 1.
 */
export function migrateCompletedDays(state: ProgressState): ProgressState {
  const completed = new Set<number>()
  for (const raw of state.completedDays ?? []) {
    const d = asDayNum(raw)
    if (d != null) completed.add(d)
  }

  for (const key of Object.keys(state.quizScores ?? {})) {
    const d = asDayNum(key)
    if (d != null && typeof state.quizScores[key] === 'number') completed.add(d)
  }

  const active = asDayNum(state.activeDay) ?? 1
  // If they had progressed past day 1 before locks, credit prior days as done.
  for (let d = 1; d < active; d++) completed.add(d)

  const activity = inferActiveDays(state)
  if (activity.length) {
    // Activity on day K means they already worked through K — credit 1..K so K+1 unlocks.
    const maxActivity = Math.max(...activity)
    for (let d = 1; d <= maxActivity; d++) completed.add(d)
  }

  // Legacy grace: students who studied before sequential locks often have XP/time
  // but empty completedDays. Credit Days 1–2 so Day 3 opens.
  if (
    completed.size === 0 &&
    ((state.xp ?? 0) >= 10 || (state.totalSeconds ?? 0) >= 180)
  ) {
    completed.add(1)
    completed.add(2)
  }

  const completedDays = [...completed].sort((a, b) => a - b)
  return { ...state, completedDays, activeDay: active }
}

/** Furthest day the student may open (sequential unlock). */
export function maxUnlockedDay(state: ProgressState): number {
  const nums = (state.completedDays ?? [])
    .map(asDayNum)
    .filter((n): n is number => n != null)
  const maxCompleted = nums.length ? Math.max(...nums) : 0
  return Math.min(20, Math.max(1, maxCompleted + 1))
}

export function getDayStatus(day: number, state: ProgressState): DayStatus {
  const nums = (state.completedDays ?? [])
    .map(asDayNum)
    .filter((n): n is number => n != null)
  if (nums.includes(day)) return 'completed'
  return day <= maxUnlockedDay(state) ? 'in-progress' : 'locked'
}

/** Keep activeDay inside the sequential unlock window. */
export function clampProgress(state: ProgressState): ProgressState {
  const unlocked = maxUnlockedDay(state)
  const activeDay = Math.min(Math.max(1, asDayNum(state.activeDay) ?? 1), unlocked)
  if (activeDay === state.activeDay && Array.isArray(state.completedDays)) {
    return state
  }
  return { ...state, activeDay }
}

export function normalizeProgress(partial: Partial<ProgressState>): ProgressState {
  const base = createDefaultProgress()
  const merged: ProgressState = {
    ...base,
    ...partial,
    schemaVersion: 3,
    setReps: {
      ...base.setReps,
      ...(partial.setReps ?? {}),
      setCompletions: {
        ...base.setReps.setCompletions,
        ...(partial.setReps?.setCompletions ?? {}),
      },
      setStreak: {
        ...base.setReps.setStreak,
        ...(partial.setReps?.setStreak ?? {}),
      },
    },
    sandboxPrefs: {
      ...base.sandboxPrefs,
      ...(partial.sandboxPrefs ?? {}),
    },
    pedagogy: {
      ...base.pedagogy,
      ...(partial.pedagogy ?? {}),
      teachBack: {
        ...base.pedagogy.teachBack,
        ...(partial.pedagogy?.teachBack ?? {}),
      },
      confidence: {
        ...base.pedagogy.confidence,
        ...(partial.pedagogy?.confidence ?? {}),
      },
      objectivesChecked: {
        ...base.pedagogy.objectivesChecked,
        ...(partial.pedagogy?.objectivesChecked ?? {}),
      },
    },
    skillMastery: {
      ...base.skillMastery,
      ...(partial.skillMastery ?? {}),
    },
    learnMode: {
      ...base.learnMode,
      ...(partial.learnMode ?? {}),
    },
    kineticSessions: partial.kineticSessions ?? base.kineticSessions,
    adaptive: {
      ...base.adaptive,
      ...(partial.adaptive ?? {}),
      misconceptionCounts: {
        ...base.adaptive.misconceptionCounts,
        ...(partial.adaptive?.misconceptionCounts ?? {}),
      },
      focusTags: partial.adaptive?.focusTags ?? base.adaptive.focusTags,
    },
    examHistory: partial.examHistory ?? base.examHistory,
    notebookCards: partial.notebookCards ?? base.notebookCards,
    audioEnabled: partial.audioEnabled ?? base.audioEnabled,
    quests: {
      ...base.quests,
      ...(partial.quests ?? {}),
      claimed: partial.quests?.claimed ?? base.quests.claimed,
    },
    bossClears: partial.bossClears ?? base.bossClears,
    speedrunBest: {
      ...base.speedrunBest,
      ...(partial.speedrunBest ?? {}),
    },
    hiddenAchievements:
      partial.hiddenAchievements ?? base.hiddenAchievements,
  }
  return clampProgress(migrateCompletedDays(merged))
}

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return createDefaultProgress()
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY)
    if (!raw) return createDefaultProgress()
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return normalizeProgress(parsed)
  } catch {
    return createDefaultProgress()
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function exportProgressJson(state: ProgressState): string {
  // The in-flight session clock is device state, not progress worth exporting.
  const { sessionStartedAt: _sessionStartedAt, ...rest } = state
  return JSON.stringify(
    {
      version: 2,
      exportedAt: new Date().toISOString(),
      progress: rest,
    },
    null,
    2,
  )
}

export function importProgressJson(raw: string): ProgressState {
  const data = JSON.parse(raw) as {
    progress?: Partial<ProgressState>
  } & Partial<ProgressState>
  const partial = data.progress ?? data
  if (!partial || typeof partial !== 'object') {
    throw new Error('Invalid progress file')
  }
  return normalizeProgress(partial)
}

export function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  if (totalSeconds < 60) return `${totalSeconds}s`
  return `${m}m`
}

export function addDaysIso(isoDate: string, days: number) {
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(y, (m || 1) - 1, d || 1)
  date.setDate(date.getDate() + days)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}
