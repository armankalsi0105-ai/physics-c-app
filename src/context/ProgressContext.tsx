'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react'
import { useShallow } from 'zustand/react/shallow'
import { formatDuration, getDayStatus, todayKey } from '@/lib/storage'
import { useProgressStore } from '@/store/progressStore'
import type {
  BadgeId,
  DayStatus,
  KineticSetResult,
  MasteryLevel,
  MisconceptionTag,
  PracticeSetKind,
  ProgressState,
  SrsItem,
  ThemeMode,
} from '@/lib/types'

type ProgressContextValue = {
  state: ProgressState
  ready: boolean
  dayStatus: (day: number) => DayStatus
  completedCount: number
  setActiveDay: (day: number) => void
  completeDay: (day: number, quizScore: number) => void
  setNote: (day: number, note: string) => void
  touchStudyTick: () => void
  formattedTime: string
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
  replaceProgress: (next: ProgressState) => void
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
  dueSrsItems: SrsItem[]
  dailyGoalProgress: number
  setAudioEnabled: (enabled: boolean) => void
  addNotebookCard: (card: import('@/lib/types').NotebookCard) => void
  unlockHidden: (id: string) => void
  recordExam: (summary: import('@/lib/types').ExamSessionSummary) => void
  clearBoss: (bossId: string) => void
  recordSpeedrun: (dayKey: string, seconds: number) => void
  bumpQuest: (field: 'kineticSets' | 'srsReviews' | 'practiceCorrect') => void
  claimQuest: (questId: string) => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

/** Stable snapshot of progress data (no action fns) — required for useSyncExternalStore. */
function pickProgressState(): ProgressState {
  const s = useProgressStore.getState()
  return {
    schemaVersion: s.schemaVersion,
    completedDays: s.completedDays,
    activeDay: s.activeDay,
    streak: s.streak,
    lastStudyDate: s.lastStudyDate,
    totalSeconds: s.totalSeconds,
    quizScores: s.quizScores,
    notes: s.notes,
    sessionStartedAt: s.sessionStartedAt,
    xp: s.xp,
    dailyGoalXp: s.dailyGoalXp,
    dailyXpEarned: s.dailyXpEarned,
    dailyXpDate: s.dailyXpDate,
    badges: s.badges,
    theme: s.theme,
    srsQueue: s.srsQueue,
    flashcards: s.flashcards,
    solvedProblems: s.solvedProblems,
    setReps: s.setReps,
    sandboxPrefs: s.sandboxPrefs,
    pedagogy: s.pedagogy,
    skillMastery: s.skillMastery,
    learnMode: s.learnMode,
    kineticSessions: s.kineticSessions,
    adaptive: s.adaptive,
    examHistory: s.examHistory,
    notebookCards: s.notebookCards,
    audioEnabled: s.audioEnabled,
    quests: s.quests,
    bossClears: s.bossClears,
    speedrunBest: s.speedrunBest,
    hiddenAchievements: s.hiddenAchievements,
  }
}

/**
 * Thin facade over the Zustand progress store — keeps existing `useProgress()`
 * consumers stable while persistence lives in one place at the app root.
 */
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const ready = useProgressStore((s) => s.ready)
  const storeState = useProgressStore(
    useShallow((s) => ({
      schemaVersion: s.schemaVersion,
      completedDays: s.completedDays,
      activeDay: s.activeDay,
      streak: s.streak,
      lastStudyDate: s.lastStudyDate,
      totalSeconds: s.totalSeconds,
      quizScores: s.quizScores,
      notes: s.notes,
      sessionStartedAt: s.sessionStartedAt,
      xp: s.xp,
      dailyGoalXp: s.dailyGoalXp,
      dailyXpEarned: s.dailyXpEarned,
      dailyXpDate: s.dailyXpDate,
      badges: s.badges,
      theme: s.theme,
      srsQueue: s.srsQueue,
      flashcards: s.flashcards,
      solvedProblems: s.solvedProblems,
      setReps: s.setReps,
      sandboxPrefs: s.sandboxPrefs,
      pedagogy: s.pedagogy,
      skillMastery: s.skillMastery,
      learnMode: s.learnMode,
      kineticSessions: s.kineticSessions,
      adaptive: s.adaptive,
      examHistory: s.examHistory,
      notebookCards: s.notebookCards,
      audioEnabled: s.audioEnabled,
      quests: s.quests,
      bossClears: s.bossClears,
      speedrunBest: s.speedrunBest,
      hiddenAchievements: s.hiddenAchievements,
    })),
  )

  const actions = useProgressStore(
    useShallow((s) => ({
      hydrate: s.hydrate,
      setActiveDay: s.setActiveDay,
      completeDay: s.completeDay,
      setNote: s.setNote,
      awardXp: s.awardXp,
      recordProblemResult: s.recordProblemResult,
      markSrsReviewed: s.markSrsReviewed,
      setTheme: s.setTheme,
      markFlashcard: s.markFlashcard,
      recordLearnResult: s.recordLearnResult,
      replaceProgress: s.replaceProgress,
      bumpMastery: s.bumpMastery,
      completePracticeSet: s.completePracticeSet,
      setSandboxDt: s.setSandboxDt,
      setTeachBack: s.setTeachBack,
      setConfidence: s.setConfidence,
      setObjectiveCheck: s.setObjectiveCheck,
      recordKineticSet: s.recordKineticSet,
      tickStudyTime: s.tickStudyTime,
      setState: s.setState,
      setAudioEnabled: s.setAudioEnabled,
      addNotebookCard: s.addNotebookCard,
      unlockHidden: s.unlockHidden,
      recordExam: s.recordExam,
      clearBoss: s.clearBoss,
      recordSpeedrun: s.recordSpeedrun,
      bumpQuest: s.bumpQuest,
      claimQuest: s.claimQuest,
    })),
  )

  useEffect(() => {
    actions.hydrate()
  }, [actions.hydrate])

  useEffect(() => {
    if (!ready) return
    const TICK = 15
    const id = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return
      actions.tickStudyTime(TICK)
    }, TICK * 1000)
    return () => window.clearInterval(id)
  }, [ready, actions.tickStudyTime])

  const dueSrsItems = useMemo(() => {
    const today = todayKey()
    return storeState.srsQueue.filter((s) => s.dueAt <= today)
  }, [storeState.srsQueue])

  const dailyGoalProgress = useMemo(() => {
    const today = todayKey()
    const earned =
      storeState.dailyXpDate === today ? storeState.dailyXpEarned : 0
    return Math.min(1, earned / Math.max(1, storeState.dailyGoalXp))
  }, [
    storeState.dailyXpDate,
    storeState.dailyXpEarned,
    storeState.dailyGoalXp,
  ])

  const value = useMemo<ProgressContextValue>(
    () => ({
      state: storeState,
      ready,
      dayStatus: (day) => getDayStatus(day, storeState),
      completedCount: storeState.completedDays.length,
      setActiveDay: actions.setActiveDay,
      completeDay: actions.completeDay,
      setNote: actions.setNote,
      touchStudyTick: () => {
        actions.setState((prev) => {
          const nextDate = prev.lastStudyDate ?? todayKey()
          if (prev.lastStudyDate === nextDate) return prev
          return { ...prev, lastStudyDate: nextDate }
        })
      },
      formattedTime: formatDuration(storeState.totalSeconds),
      awardXp: actions.awardXp,
      recordProblemResult: actions.recordProblemResult,
      markSrsReviewed: actions.markSrsReviewed,
      setTheme: actions.setTheme,
      markFlashcard: actions.markFlashcard,
      recordLearnResult: actions.recordLearnResult,
      replaceProgress: actions.replaceProgress,
      bumpMastery: actions.bumpMastery,
      completePracticeSet: actions.completePracticeSet,
      setSandboxDt: actions.setSandboxDt,
      setTeachBack: actions.setTeachBack,
      setConfidence: actions.setConfidence,
      setObjectiveCheck: actions.setObjectiveCheck,
      recordKineticSet: actions.recordKineticSet,
      dueSrsItems,
      dailyGoalProgress,
      setAudioEnabled: actions.setAudioEnabled,
      addNotebookCard: actions.addNotebookCard,
      unlockHidden: actions.unlockHidden,
      recordExam: actions.recordExam,
      clearBoss: actions.clearBoss,
      recordSpeedrun: actions.recordSpeedrun,
      bumpQuest: actions.bumpQuest,
      claimQuest: actions.claimQuest,
    }),
    [
      storeState,
      ready,
      actions,
      dueSrsItems,
      dailyGoalProgress,
    ],
  )

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}

/** Subscribe only to study-time formatting (isolates Header ticker rerenders). */
export function useFormattedStudyTime() {
  return useSyncExternalStore(
    useProgressStore.subscribe,
    () => formatDuration(useProgressStore.getState().totalSeconds),
    () => '0s',
  )
}

export type { BadgeId }
export { pickProgressState }
