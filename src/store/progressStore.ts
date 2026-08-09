'use client'

import { create } from 'zustand'
import { computeNewBadges, SET_XP_MULT, XP } from '@/lib/badges'
import { withMasteryUpdate } from '@/lib/mastery'
import {
  addDaysIso,
  createDefaultProgress,
  loadProgress,
  maxUnlockedDay,
  normalizeProgress,
  saveProgress,
  todayKey,
} from '@/lib/storage'
import type {
  KineticSetResult,
  LearnPhase,
  MasteryLevel,
  MisconceptionTag,
  PracticeSetKind,
  ProgressState,
  SrsItem,
  ThemeMode,
} from '@/lib/types'

const PERSIST_DEBOUNCE_MS = 280
const CHANNEL = 'ap-physics-progress-sync-v3'

function syncDailyXp(prev: ProgressState): ProgressState {
  const today = todayKey()
  if (prev.dailyXpDate === today) return prev
  return { ...prev, dailyXpDate: today, dailyXpEarned: 0 }
}

function withXp(prev: ProgressState, amount: number): ProgressState {
  const synced = syncDailyXp(prev)
  const next: ProgressState = {
    ...synced,
    xp: synced.xp + amount,
    dailyXpEarned: synced.dailyXpEarned + amount,
  }
  return { ...next, badges: computeNewBadges(next) }
}

type ProgressActions = {
  ready: boolean
  hydrate: () => void
  setState: (updater: (prev: ProgressState) => ProgressState) => void
  replaceProgress: (next: ProgressState) => void
  setActiveDay: (day: number) => void
  completeDay: (day: number, quizScore: number) => void
  setNote: (day: number, note: string) => void
  awardXp: (amount: number) => void
  recordProblemResult: (opts: {
    problemId: string
    day: number
    section: 'math' | 'physics' | 'quiz'
    prompt: string
    correct: boolean
    firstTry?: boolean
    setKind?: PracticeSetKind
    misconception?: MisconceptionTag
  }) => void
  markSrsReviewed: (problemId: string, correct: boolean) => void
  setTheme: (theme: ThemeMode) => void
  markFlashcard: (id: string, known: boolean) => void
  recordLearnResult: (opts: {
    cardId: string
    day: number
    correct: boolean
  }) => void
  bumpMastery: (day: number, level: MasteryLevel) => void
  completePracticeSet: (opts: {
    day: number
    setId: string
    problemId: string
    setKind: PracticeSetKind
    allSetProblemIds: string[]
    allDaySetIds: string[]
  }) => void
  setSandboxDt: (sandboxId: string, dt: number) => void
  setTeachBack: (day: number, text: string) => void
  setConfidence: (
    day: number,
    skillIndex: number,
    skillCount: number,
    value: number,
  ) => void
  setObjectiveCheck: (
    day: number,
    index: number,
    count: number,
    checked: boolean,
  ) => void
  recordKineticSet: (result: KineticSetResult) => void
  recordMisconception: (tag: MisconceptionTag) => void
  tickStudyTime: (seconds: number) => void
  setAudioEnabled: (enabled: boolean) => void
  addNotebookCard: (card: import('@/lib/types').NotebookCard) => void
  unlockHidden: (id: string) => void
  recordExam: (summary: import('@/lib/types').ExamSessionSummary) => void
  clearBoss: (bossId: string) => void
  recordSpeedrun: (dayKey: string, seconds: number) => void
  bumpQuest: (field: 'kineticSets' | 'srsReviews' | 'practiceCorrect') => void
  claimQuest: (questId: string) => void
}

export type ProgressStore = ProgressState & ProgressActions

let persistTimer: ReturnType<typeof setTimeout> | null = null
let broadcast: BroadcastChannel | null = null
let applyingRemote = false

function schedulePersist(state: ProgressState) {
  if (typeof window === 'undefined') return
  if (persistTimer) clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    saveProgress(state)
    try {
      if (!broadcast) broadcast = new BroadcastChannel(CHANNEL)
      if (!applyingRemote) {
        broadcast.postMessage({ type: 'progress', state })
      }
    } catch {
      /* BroadcastChannel unavailable */
    }
  }, PERSIST_DEBOUNCE_MS)
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  ...createDefaultProgress(),
  ready: false,

  hydrate: () => {
    if (get().ready) return
    const loaded = loadProgress()
    const today = todayKey()
    let streak = loaded.streak
    if (loaded.lastStudyDate) {
      const last = new Date(loaded.lastStudyDate)
      const now = new Date(today)
      const diff = Math.round(
        (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
      )
      if (diff > 1) streak = 0
    }
    let next = syncDailyXp({
      ...loaded,
      streak,
      sessionStartedAt: Date.now(),
      theme: loaded.theme === 'light' ? 'light' : 'dark',
    })
    next = { ...next, badges: computeNewBadges(next) }
    set({ ...next, ready: true })
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = next.theme
    }
    try {
      if (!broadcast) broadcast = new BroadcastChannel(CHANNEL)
      broadcast.onmessage = (ev: MessageEvent) => {
        const data = ev.data as { type?: string; state?: ProgressState }
        if (data?.type === 'progress' && data.state) {
          applyingRemote = true
          set({
            ...normalizeProgress(data.state),
            ready: true,
            sessionStartedAt: get().sessionStartedAt,
          })
          applyingRemote = false
        }
      }
    } catch {
      /* ignore */
    }
  },

  setState: (updater) => {
    const prev = get()
    const dataPrev: ProgressState = {
      schemaVersion: prev.schemaVersion,
      completedDays: prev.completedDays,
      activeDay: prev.activeDay,
      streak: prev.streak,
      lastStudyDate: prev.lastStudyDate,
      totalSeconds: prev.totalSeconds,
      quizScores: prev.quizScores,
      notes: prev.notes,
      sessionStartedAt: prev.sessionStartedAt,
      xp: prev.xp,
      dailyGoalXp: prev.dailyGoalXp,
      dailyXpEarned: prev.dailyXpEarned,
      dailyXpDate: prev.dailyXpDate,
      badges: prev.badges,
      theme: prev.theme,
      srsQueue: prev.srsQueue,
      flashcards: prev.flashcards,
      solvedProblems: prev.solvedProblems,
      setReps: prev.setReps,
      sandboxPrefs: prev.sandboxPrefs,
      pedagogy: prev.pedagogy,
      skillMastery: prev.skillMastery,
      learnMode: prev.learnMode,
      kineticSessions: prev.kineticSessions,
      adaptive: prev.adaptive,
      examHistory: prev.examHistory,
      notebookCards: prev.notebookCards,
      audioEnabled: prev.audioEnabled,
      quests: prev.quests,
      bossClears: prev.bossClears,
      speedrunBest: prev.speedrunBest,
      hiddenAchievements: prev.hiddenAchievements,
    }
    const next = updater(dataPrev)
    if (next === dataPrev) return
    set(next)
    schedulePersist(next)
  },

  replaceProgress: (incoming) => {
    const next = {
      ...normalizeProgress(incoming),
      sessionStartedAt: Date.now(),
      badges: computeNewBadges(incoming),
    }
    set({ ...next, ready: true })
    schedulePersist(next)
  },

  setActiveDay: (day) => {
    get().setState((prev) => {
      const unlocked = maxUnlockedDay(prev)
      const next = Math.min(Math.max(1, day), unlocked)
      if (next === prev.activeDay) return prev
      return { ...prev, activeDay: next }
    })
  },

  completeDay: (day, quizScore) => {
    get().setState((prev) => {
      const alreadyDone = prev.completedDays.includes(day)
      const today = todayKey()
      let streak = prev.streak
      if (prev.lastStudyDate !== today) {
        if (!prev.lastStudyDate) streak = 1
        else {
          const last = new Date(prev.lastStudyDate)
          const now = new Date(today)
          const diff = Math.round(
            (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
          )
          streak = diff === 1 ? prev.streak + 1 : 1
        }
      }
      const completedDays = alreadyDone
        ? prev.completedDays
        : [...prev.completedDays, day].sort((a, b) => a - b)
      const prevScore = prev.quizScores[String(day)]
      const nextScore = alreadyDone
        ? Math.max(typeof prevScore === 'number' ? prevScore : 0, quizScore)
        : quizScore
      let next: ProgressState = {
        ...prev,
        completedDays,
        activeDay: Math.min(20, day + 1),
        streak,
        lastStudyDate: today,
        quizScores: { ...prev.quizScores, [String(day)]: nextScore },
      }
      if (!alreadyDone) {
        next = withXp(next, XP.dayComplete + quizScore * XP.quizQuestion)
      } else {
        next = { ...next, badges: computeNewBadges(next) }
      }
      const masteryBump: MasteryLevel =
        quizScore >= 3 ? 'mastered' : quizScore >= 2 ? 'level1' : 'practiced'
      return withMasteryUpdate(next, day, masteryBump)
    })
  },

  setNote: (day, note) => {
    get().setState((prev) => ({
      ...prev,
      notes: { ...prev.notes, [String(day)]: note },
    }))
  },

  awardXp: (amount) => {
    get().setState((prev) => withXp(prev, amount))
  },

  recordProblemResult: (opts) => {
    get().setState((prev) => {
      let next = { ...prev }
      if (!opts.correct && opts.misconception) {
        const counts = { ...next.adaptive.misconceptionCounts }
        counts[opts.misconception] = (counts[opts.misconception] ?? 0) + 1
        const ranked = (
          Object.entries(counts) as [MisconceptionTag, number][]
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([tag]) => tag)
        next = {
          ...next,
          adaptive: {
            ...next.adaptive,
            misconceptionCounts: counts,
            focusTags: ranked,
          },
        }
      }
      if (opts.correct) {
        const already = prev.solvedProblems.includes(opts.problemId)
        next = {
          ...next,
          srsQueue: next.srsQueue.filter((s) => s.problemId !== opts.problemId),
        }
        if (!already) {
          next = {
            ...next,
            solvedProblems: [...next.solvedProblems, opts.problemId],
          }
        }
        if (opts.section !== 'quiz' && !already) {
          let amount: number = XP.practiceCorrect
          if (opts.firstTry) amount += XP.practiceFirstTry
          if (opts.setKind && opts.setKind in SET_XP_MULT) {
            amount = Math.round(
              amount * (SET_XP_MULT[opts.setKind as keyof typeof SET_XP_MULT] ?? 1),
            )
          }
          next = withXp(next, amount)
        } else {
          next = { ...next, badges: computeNewBadges(next) }
        }
        return withMasteryUpdate(next, opts.day, 'practiced')
      }
      const dueAt = addDaysIso(todayKey(), 3)
      const existing = next.srsQueue.find((s) => s.problemId === opts.problemId)
      const item: SrsItem = {
        problemId: opts.problemId,
        day: opts.day,
        section: opts.section,
        prompt: opts.prompt,
        dueAt,
        wrongCount: (existing?.wrongCount ?? 0) + 1,
      }
      next = {
        ...next,
        srsQueue: [
          ...next.srsQueue.filter((s) => s.problemId !== opts.problemId),
          item,
        ],
      }
      return withMasteryUpdate(next, opts.day, 'practiced')
    })
  },

  markSrsReviewed: (problemId, correct) => {
    get().setState((prev) => {
      const inQueue = prev.srsQueue.some((s) => s.problemId === problemId)
      if (!inQueue) return prev
      if (correct) {
        let next = {
          ...prev,
          srsQueue: prev.srsQueue.filter((s) => s.problemId !== problemId),
        }
        next = withXp(next, XP.srsReview)
        const item = prev.srsQueue.find((s) => s.problemId === problemId)
        if (item) next = withMasteryUpdate(next, item.day, 'mastered')
        return next
      }
      const dueAt = addDaysIso(todayKey(), 3)
      return {
        ...prev,
        srsQueue: prev.srsQueue.map((s) =>
          s.problemId === problemId
            ? { ...s, dueAt, wrongCount: s.wrongCount + 1 }
            : s,
        ),
      }
    })
  },

  setTheme: (theme) => {
    get().setState((prev) => ({ ...prev, theme }))
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme
    }
  },

  markFlashcard: (id, known) => {
    get().setState((prev) => {
      const wasKnown = prev.flashcards[id]?.known === true
      let next: ProgressState = {
        ...prev,
        flashcards: {
          ...prev.flashcards,
          [id]: { known, lastSeen: todayKey() },
        },
      }
      if (known && !wasKnown) next = withXp(next, XP.flashcardKnown)
      const dayMatch = id.match(/^d(\d{1,2})/i)
      if (dayMatch) {
        next = withMasteryUpdate(next, Number(dayMatch[1]), 'practiced')
      }
      return next
    })
  },

  recordLearnResult: (opts) => {
    get().setState((prev) => {
      const cur = prev.learnMode[opts.cardId] ?? {
        phase: 'mcq' as LearnPhase,
        streak: 0,
        ease: 2.5,
        interval: 1,
        repetitions: 0,
        dueDate: null as string | null,
      }
      const phases: LearnPhase[] = ['mcq', 'fill', 'write', 'done']
      let phase = cur.phase
      let streak = cur.streak
      let ease = cur.ease
      let interval = cur.interval
      let repetitions = cur.repetitions
      let dueDate = cur.dueDate

      if (opts.correct) {
        streak += 1
        const idx = phases.indexOf(phase)
        if (idx < phases.length - 1) phase = phases[idx + 1]
        if (phase === 'done') {
          repetitions += 1
          ease = Math.max(1.3, ease + 0.1)
          interval = Math.max(1, Math.round(interval * ease))
          dueDate = addDaysIso(todayKey(), interval)
        }
      } else {
        streak = 0
        ease = Math.max(1.3, ease - 0.2)
        if (phase !== 'mcq') {
          const idx = phases.indexOf(phase)
          phase = phases[Math.max(0, idx - 1)]
        }
        dueDate = todayKey()
      }

      let next: ProgressState = {
        ...prev,
        learnMode: {
          ...prev.learnMode,
          [opts.cardId]: {
            phase,
            streak,
            ease,
            interval,
            repetitions,
            dueDate,
          },
        },
        flashcards: {
          ...prev.flashcards,
          [opts.cardId]: {
            known: phase === 'done',
            lastSeen: todayKey(),
          },
        },
      }
      if (opts.correct) next = withXp(next, XP.flashcardKnown)
      return withMasteryUpdate(next, opts.day, 'practiced')
    })
  },

  bumpMastery: (day, level) => {
    get().setState((prev) => withMasteryUpdate(prev, day, level))
  },

  completePracticeSet: (opts) => {
    get().setState((prev) => {
      const key = `${opts.day}:${opts.setId}`
      const existing = prev.setReps.setCompletions[key] ?? []
      if (existing.includes(opts.problemId)) return prev

      const updated = [...existing, opts.problemId]
      const setJustCleared = opts.allSetProblemIds.every((id) =>
        updated.includes(id),
      )

      let next: ProgressState = {
        ...prev,
        setReps: {
          ...prev.setReps,
          setCompletions: {
            ...prev.setReps.setCompletions,
            [key]: updated,
          },
          setStreak: {
            ...prev.setReps.setStreak,
            [key]: (prev.setReps.setStreak[key] ?? 0) + 1,
          },
        },
      }

      if (!setJustCleared) {
        return { ...next, badges: computeNewBadges(next) }
      }

      next = withXp(next, XP.setClear)

      const everySetDone = opts.allDaySetIds.every((setId) => {
        const k = `${opts.day}:${setId}`
        const done = next.setReps.setCompletions[k] ?? []
        return done.length > 0
      })
      const dayWorkoutKey = `workout:${opts.day}`
      const already =
        prev.setReps.setCompletions[dayWorkoutKey]?.includes('done')

      if (everySetDone && !already) {
        next = {
          ...next,
          setReps: {
            ...next.setReps,
            workoutsCompleted: next.setReps.workoutsCompleted + 1,
            setCompletions: {
              ...next.setReps.setCompletions,
              [dayWorkoutKey]: ['done'],
            },
          },
        }
        next = withXp(next, XP.workoutComplete)
      }

      return { ...next, badges: computeNewBadges(next) }
    })
  },

  setSandboxDt: (sandboxId, dt) => {
    get().setState((prev) => ({
      ...prev,
      sandboxPrefs: { ...prev.sandboxPrefs, [sandboxId]: { dt } },
    }))
  },

  setTeachBack: (day, text) => {
    get().setState((prev) => ({
      ...prev,
      pedagogy: {
        ...prev.pedagogy,
        teachBack: { ...prev.pedagogy.teachBack, [String(day)]: text },
      },
    }))
  },

  setConfidence: (day, skillIndex, skillCount, value) => {
    get().setState((prev) => {
      const key = String(day)
      const curr = [
        ...(prev.pedagogy.confidence[key] ?? Array(skillCount).fill(0)),
      ]
      while (curr.length < skillCount) curr.push(0)
      curr[skillIndex] = value
      return {
        ...prev,
        pedagogy: {
          ...prev.pedagogy,
          confidence: { ...prev.pedagogy.confidence, [key]: curr },
        },
      }
    })
  },

  setObjectiveCheck: (day, index, count, checked) => {
    get().setState((prev) => {
      const key = String(day)
      const curr = [
        ...(prev.pedagogy.objectivesChecked[key] ?? Array(count).fill(false)),
      ]
      while (curr.length < count) curr.push(false)
      curr[index] = checked
      return {
        ...prev,
        pedagogy: {
          ...prev.pedagogy,
          objectivesChecked: {
            ...prev.pedagogy.objectivesChecked,
            [key]: curr,
          },
        },
      }
    })
  },

  recordKineticSet: (result) => {
    get().setState((prev) => {
      let next = {
        ...prev,
        kineticSessions: [...prev.kineticSessions, result].slice(-200),
      }
      if (result.xpEarned > 0) next = withXp(next, result.xpEarned)
      const weekKey = weekKeyNow()
      const q =
        next.quests.weekKey === weekKey
          ? next.quests
          : {
              weekKey,
              kineticSets: 0,
              srsReviews: 0,
              practiceCorrect: 0,
              claimed: [],
            }
      next = {
        ...next,
        quests: { ...q, kineticSets: q.kineticSets + 1 },
      }
      for (const tag of result.mistakes) {
        const counts = { ...next.adaptive.misconceptionCounts }
        counts[tag] = (counts[tag] ?? 0) + 1
        next = {
          ...next,
          adaptive: {
            ...next.adaptive,
            misconceptionCounts: counts,
            focusTags: (
              Object.entries(counts) as [MisconceptionTag, number][]
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([t]) => t),
          },
        }
      }
      return next
    })
  },

  recordMisconception: (tag) => {
    get().setState((prev) => {
      const counts = { ...prev.adaptive.misconceptionCounts }
      counts[tag] = (counts[tag] ?? 0) + 1
      return {
        ...prev,
        adaptive: {
          ...prev.adaptive,
          misconceptionCounts: counts,
          focusTags: (Object.entries(counts) as [MisconceptionTag, number][])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([t]) => t),
        },
      }
    })
  },

  tickStudyTime: (seconds) => {
    get().setState((prev) => ({
      ...prev,
      totalSeconds: prev.totalSeconds + seconds,
    }))
  },

  setAudioEnabled: (enabled) => {
    get().setState((prev) => ({ ...prev, audioEnabled: enabled }))
  },

  addNotebookCard: (card) => {
    get().setState((prev) => {
      let next = {
        ...prev,
        notebookCards: [...prev.notebookCards, card].slice(-100),
      }
      next = withXp(next, 3)
      return next
    })
  },

  unlockHidden: (id) => {
    get().setState((prev) => {
      if (prev.hiddenAchievements.includes(id)) return prev
      let next = {
        ...prev,
        hiddenAchievements: [...prev.hiddenAchievements, id],
      }
      return { ...next, badges: computeNewBadges(next) }
    })
  },

  recordExam: (summary) => {
    get().setState((prev) => {
      let next = {
        ...prev,
        examHistory: [...prev.examHistory, summary].slice(-50),
      }
      if (summary.methodPoints >= 2) {
        next = {
          ...next,
          hiddenAchievements: next.hiddenAchievements.includes('ecf-thinker')
            ? next.hiddenAchievements
            : [...next.hiddenAchievements, 'ecf-thinker'],
        }
      }
      next = withXp(next, 15 + Math.round(summary.frqPoints + summary.methodPoints))
      return { ...next, badges: computeNewBadges(next) }
    })
  },

  clearBoss: (bossId) => {
    get().setState((prev) => {
      if (prev.bossClears.includes(bossId)) return prev
      let next = {
        ...prev,
        bossClears: [...prev.bossClears, bossId],
      }
      next = withXp(next, 40)
      return { ...next, badges: computeNewBadges(next) }
    })
  },

  recordSpeedrun: (dayKey, seconds) => {
    get().setState((prev) => {
      const best = prev.speedrunBest[dayKey]
      if (best != null && seconds >= best) return prev
      let next = {
        ...prev,
        speedrunBest: { ...prev.speedrunBest, [dayKey]: seconds },
      }
      return { ...next, badges: computeNewBadges(next) }
    })
  },

  bumpQuest: (field) => {
    get().setState((prev) => {
      const weekKey = weekKeyNow()
      const q =
        prev.quests.weekKey === weekKey
          ? prev.quests
          : {
              weekKey,
              kineticSets: 0,
              srsReviews: 0,
              practiceCorrect: 0,
              claimed: [],
            }
      return {
        ...prev,
        quests: { ...q, [field]: (q[field] as number) + 1 },
      }
    })
  },

  claimQuest: (questId) => {
    get().setState((prev) => {
      if (prev.quests.claimed.includes(questId)) return prev
      let next = {
        ...prev,
        quests: {
          ...prev.quests,
          claimed: [...prev.quests.claimed, questId],
        },
      }
      next = withXp(next, 25)
      return { ...next, badges: computeNewBadges(next) }
    })
  },
}))

function weekKeyNow() {
  const d = new Date()
  const onejan = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(
    ((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7,
  )
  return `${d.getFullYear()}-W${week}`
}
