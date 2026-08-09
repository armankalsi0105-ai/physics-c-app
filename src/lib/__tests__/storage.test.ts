import { describe, expect, it } from 'vitest'
import {
  createDefaultProgress,
  maxUnlockedDay,
  migrateCompletedDays,
  normalizeProgress,
} from '@/lib/storage'

describe('normalizeProgress', () => {
  it('fills missing fields with defaults', () => {
    const partial = { xp: 42, completedDays: [1] }
    const result = normalizeProgress(partial)
    expect(result.xp).toBe(42)
    expect(result.completedDays).toContain(1)
    expect(result.schemaVersion).toBe(3)
    expect(result.adaptive.focusTags).toEqual([])
    expect(result.kineticSessions).toEqual([])
  })

  it('merges nested setReps and adaptive state', () => {
    const partial = {
      setReps: {
        setCompletions: { '1:warmup': ['p1'] },
        setStreak: { '1:warmup': 2 },
        workoutsCompleted: 0,
      },
      adaptive: {
        misconceptionCounts: { units: 3 as const },
        focusTags: ['units' as const],
        lastRecommendedDay: null,
      },
    }
    const result = normalizeProgress(partial)
    expect(result.setReps.setCompletions['1:warmup']).toEqual(['p1'])
    expect(result.setReps.setStreak['1:warmup']).toBe(2)
    expect(result.adaptive.misconceptionCounts.units).toBe(3)
    expect(result.adaptive.focusTags).toEqual(['units'])
  })
})

describe('maxUnlockedDay', () => {
  it('returns 1 when no days completed', () => {
    const state = createDefaultProgress()
    expect(maxUnlockedDay(state)).toBe(1)
  })

  it('unlocks day after highest completed', () => {
    const state = createDefaultProgress()
    state.completedDays = [1, 2, 3]
    expect(maxUnlockedDay(state)).toBe(4)
  })

  it('caps at day 20', () => {
    const state = createDefaultProgress()
    state.completedDays = Array.from({ length: 20 }, (_, i) => i + 1)
    expect(maxUnlockedDay(state)).toBe(20)
  })
})

describe('migrateCompletedDays', () => {
  it('backfills from quiz scores', () => {
    const state = createDefaultProgress()
    state.quizScores = { '2': 3, '3': 2 }
    const migrated = migrateCompletedDays(state)
    expect(migrated.completedDays).toContain(2)
    expect(migrated.completedDays).toContain(3)
  })

  it('credits days before activeDay', () => {
    const state = createDefaultProgress()
    state.activeDay = 5
    state.completedDays = []
    const migrated = migrateCompletedDays(state)
    expect(migrated.completedDays).toContain(1)
    expect(migrated.completedDays).toContain(4)
    expect(migrated.completedDays).not.toContain(5)
  })

  it('legacy grace unlocks days 1–2 from XP/time', () => {
    const state = createDefaultProgress()
    state.xp = 15
    state.completedDays = []
    const migrated = migrateCompletedDays(state)
    expect(migrated.completedDays).toContain(1)
    expect(migrated.completedDays).toContain(2)
  })
})
