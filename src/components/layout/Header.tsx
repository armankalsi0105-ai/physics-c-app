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
  navOpen: boolean
  onToggleNav: () => void
  onOpenFormulas: () => void
}

export function Header({
  currentDay,
  navOpen,
  onToggleNav,
  onOpenFormulas,
}: Props) {
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
  const dailyGoal = ready ? state.dailyGoalXp : 0
  const timeLabel = ready ? formattedTime : '0s'
  const pct = Math.round(
    ((ready ? completedCount : 0) / curriculum.totalDays) * 100,
  )
  const goalPct = ready ? Math.round(dailyGoalProgress * 100) : 0
  const latestBadge = ready ? state.badges[state.badges.length - 1] : undefined

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <button
          type="button"
          onClick={onToggleNav}
          className="icon-btn topbar__menu hide-from-lg"
          aria-label="Open syllabus"
          aria-haspopup="dialog"
          aria-controls="syllabus-drawer"
          aria-expanded={navOpen}
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="topbar__brand">
          <span className="brand-mark topbar__wordmark">Mastery C</span>
          <span className="topbar__tagline">
            AP Physics C &amp; Pre-Calc · 20-Day Plan
          </span>
        </Link>

        <div className="topbar__stats">
          <span className="stat-chip show-from-lg" title="Progress">
            <strong>Day {currentDay}</strong>
            <span aria-hidden>/</span>
            {curriculum.totalDays}
            <span className="text-[color:var(--accent)]">· {pct}%</span>
          </span>
          <span
            className="stat-chip"
            title={`${xp} XP · daily goal ${dailyEarned}/${dailyGoal}`}
          >
            <Zap className="h-3.5 w-3.5 text-[color:var(--signal)]" />
            <strong suppressHydrationWarning>{xp}</strong>
            <span className="hidden lg:inline">XP</span>
            <span className="goal-bar hidden lg:inline-block" aria-hidden>
              <span style={{ width: `${goalPct}%` }} />
            </span>
            <span className="hidden lg:inline text-[color:var(--muted)]">
              <span suppressHydrationWarning>{dailyEarned}</span>/
              <span suppressHydrationWarning>{dailyGoal}</span>
            </span>
          </span>
          <span className="stat-chip" title="Daily streak">
            <Flame className="h-3.5 w-3.5 text-[color:var(--signal)]" />
            <strong suppressHydrationWarning>{streak}</strong>
            <span className="hidden lg:inline">streak</span>
          </span>
          {latestBadge && (
            <span
              className="stat-chip show-from-xl"
              title={BADGE_META[latestBadge].description}
            >
              <Award className="h-3.5 w-3.5 text-[color:var(--accent)]" />
              {BADGE_META[latestBadge].title}
            </span>
          )}
          <span className="stat-chip show-from-lg" title="Total time studied">
            <Timer className="h-3.5 w-3.5 text-[color:var(--accent)]" />
            <strong suppressHydrationWarning>{timeLabel}</strong>
          </span>
          {/* Formulas / Exam / Analytics move into the syllabus drawer below `md`. */}
          <FormulaSheetButton onClick={onOpenFormulas} />
          <Link
            href="/exam"
            className="stat-chip show-from-md"
            title="AP Exam Mode"
          >
            <Timer className="h-3.5 w-3.5 text-[color:var(--signal)]" />
            <span className="hidden lg:inline">Exam</span>
          </Link>
          <Link
            href="/analytics"
            className="stat-chip show-from-md"
            title="Learning analytics"
          >
            <BarChart3 className="h-3.5 w-3.5 text-[color:var(--accent)]" />
            <span className="hidden lg:inline">Analytics</span>
          </Link>
          <button
            type="button"
            className="stat-chip stat-chip--icon"
            onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
            aria-label={
              ready && state.theme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            title="Toggle dark mode"
          >
            {ready && state.theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="topbar__rail" aria-hidden>
        <div className="topbar__rail-fill" style={{ width: `${pct}%` }} />
      </div>
    </header>
  )
}
