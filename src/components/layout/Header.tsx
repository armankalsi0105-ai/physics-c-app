'use client'

import {
  Award,
  BarChart3,
  Flame,
  Menu,
  Moon,
  Sun,
  Timer,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useProgress } from '@/context/ProgressContext'
import { curriculum } from '@/lib/curriculum'
import { BADGE_META } from '@/lib/badges'
import { FormulaSheetButton } from '@/components/study/FormulaSheetDrawer'

type Props = {
  currentDay: number
  onToggleNav: () => void
  onOpenFormulas: () => void
}

export function Header({ currentDay, onToggleNav, onOpenFormulas }: Props) {
  const {
    completedCount,
    state,
    ready,
    formattedTime,
    dailyGoalProgress,
    setTheme,
  } = useProgress()
  // Keep SSR/first paint on defaults until localStorage hydrates (avoids mismatch).
  const xp = ready ? state.xp : 0
  const streak = ready ? state.streak : 0
  const dailyEarned = ready ? state.dailyXpEarned : 0
  const timeLabel = ready ? formattedTime : '0s'
  const pct = Math.round(
    ((ready ? completedCount : 0) / curriculum.totalDays) * 100,
  )
  const goalPct = ready ? Math.round(dailyGoalProgress * 100) : 0
  const latestBadge = ready ? state.badges[state.badges.length - 1] : undefined

  return (
    <header className="topbar">
      <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggleNav}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-[color:var(--line-strong)] bg-[color:var(--panel)] lg:hidden"
          aria-label="Open syllabus"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="brand-mark text-[1.35rem] text-[color:var(--ink)] sm:text-[1.55rem]">
            Mastery C
          </p>
          <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--muted)]">
            AP Physics C & Pre-Calc · 20-Day Plan
          </p>
        </div>

        <div className="flex flex-none flex-wrap items-center justify-end gap-2">
          <span className="stat-chip" title="Progress">
            <strong>Day {currentDay}</strong>
            <span aria-hidden>/</span>
            {curriculum.totalDays}
            <span className="text-[color:var(--accent)]">· {pct}%</span>
          </span>
          <span className="stat-chip" title="XP and daily goal">
            <Zap className="h-3.5 w-3.5 text-[color:var(--signal)]" />
            <strong suppressHydrationWarning>{xp}</strong>
            <span className="hidden sm:inline">XP</span>
            <span className="goal-bar hidden sm:inline-block" aria-hidden>
              <span style={{ width: `${goalPct}%` }} />
            </span>
            <span className="hidden lg:inline text-[color:var(--muted)]">
              {dailyEarned}/{state.dailyGoalXp}
            </span>
          </span>
          <span className="stat-chip" title="Daily streak">
            <Flame className="h-3.5 w-3.5 text-[color:var(--signal)]" />
            <strong suppressHydrationWarning>{streak}</strong>
            <span className="hidden md:inline">streak</span>
          </span>
          {latestBadge && (
            <span
              className="stat-chip hidden xl:inline-flex"
              title={BADGE_META[latestBadge].description}
            >
              <Award className="h-3.5 w-3.5 text-[color:var(--accent)]" />
              {BADGE_META[latestBadge].title}
            </span>
          )}
          <span className="stat-chip hidden md:inline-flex" title="Total time studied">
            <Timer className="h-3.5 w-3.5 text-[color:var(--accent)]" />
            <strong suppressHydrationWarning>{timeLabel}</strong>
          </span>
          <FormulaSheetButton onClick={onOpenFormulas} />
          <Link
            href="/exam"
            className="stat-chip"
            title="AP Exam Mode"
            aria-label="Open exam mode"
          >
            <Timer className="h-3.5 w-3.5 text-[color:var(--signal)]" />
            <span className="hidden sm:inline">Exam</span>
          </Link>
          <Link
            href="/analytics"
            className="stat-chip"
            title="Learning analytics"
            aria-label="Open analytics"
          >
            <BarChart3 className="h-3.5 w-3.5 text-[color:var(--accent)]" />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
          <button
            type="button"
            className="stat-chip"
            onClick={() =>
              setTheme(state.theme === 'dark' ? 'light' : 'dark')
            }
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {ready && state.theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <div className="topbar__rail" aria-hidden>
          <div className="topbar__rail-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </header>
  )
}
