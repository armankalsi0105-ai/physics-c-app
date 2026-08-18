'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Flame,
  Lock,
  RotateCcw,
  Timer,
  Zap,
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHero } from '@/components/ui/PageHero'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { useProgress } from '@/context/ProgressContext'
import { curriculum } from '@/lib/curriculum'
import { maxUnlockedDay } from '@/lib/storage'

const PHASES: { label: string; days: number[] }[] = [
  { label: 'Derivatives & kinematics', days: [1, 2, 3, 4, 5] },
  { label: 'Vectors & products', days: [6, 7, 8] },
  { label: 'Integration', days: [9, 10] },
  { label: 'Dynamics & work', days: [11, 12, 13] },
  { label: 'Energy & momentum', days: [14, 15, 16] },
  { label: 'Rotation & oscillation', days: [17, 18, 19] },
  { label: 'Final review', days: [20] },
]

export function HomeDashboard() {
  const { state, ready, completedCount, dueSrsItems, dailyGoalProgress } =
    useProgress()

  // Everything below stays on defaults until localStorage hydrates, so the
  // server pass and the first client render agree.
  const done = ready ? completedCount : 0
  const streak = ready ? state.streak : 0
  const xp = ready ? state.xp : 0
  const unlocked = ready ? maxUnlockedDay(state) : 1
  const goalPct = ready ? Math.round(dailyGoalProgress * 100) : 0
  const dueCount = ready ? dueSrsItems.length : 0
  const completedDays = ready ? state.completedDays : []

  // Where "Continue" goes: the day they were last on, if it is still open.
  const active = ready ? state.activeDay : 1
  const resumeDay =
    Number.isInteger(active) && active >= 1 && active <= unlocked
      ? active
      : unlocked
  const resume = curriculum.days.find((d) => d.day === resumeDay)
  const isFresh = done === 0 && resumeDay === 1

  return (
    <AppShell currentDay={resumeDay}>
      <div className="home">
        <PageHero
          eyebrow="Mission control"
          title={isFresh ? 'Start the 20-day run' : 'Welcome back'}
          watermark={String(curriculum.totalDays)}
          aside={
            <ProgressRing
              value={done}
              max={curriculum.totalDays}
              size={64}
              stroke={5}
              label={`${done} of ${curriculum.totalDays} days complete`}
            />
          }
          meta={[
            <>
              <Zap className="h-3.5 w-3.5" />
              <span suppressHydrationWarning>{xp}</span> XP
            </>,
            <>
              <Flame className="h-3.5 w-3.5" />
              <span suppressHydrationWarning>{streak}</span> day streak
            </>,
            <>
              <span suppressHydrationWarning>{done}</span> of{' '}
              {curriculum.totalDays} days
            </>,
          ]}
        >
          <Link href={`/day/${resumeDay}`} className="btn-primary">
            {isFresh ? 'Begin Day 1' : `Continue Day ${resumeDay}`}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/exam" className="btn-ghost">
            <Timer className="h-4 w-4" />
            Practice exam
          </Link>
          <Link href="/analytics" className="btn-ghost">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
        </PageHero>

        <section className="home-next">
          <p className="subhead">Up next</p>
          <Link href={`/day/${resumeDay}`} className="home-next__card">
            <span className="home-next__num">
              {String(resumeDay).padStart(2, '0')}
            </span>
            <span className="home-next__body">
              <span className="home-next__title">
                {resume?.title ?? 'Your next lesson'}
              </span>
              <span className="home-next__meta">
                ~95 min · 7 sections
                {dueCount > 0 && ` · ${dueCount} review due`}
              </span>
            </span>
            <ArrowRight className="home-next__go h-5 w-5" aria-hidden />
          </Link>

          <div className="home-today">
            <div className="home-today__row">
              <span>Today&apos;s goal</span>
              <strong suppressHydrationWarning>
                {goalPct}% of {ready ? state.dailyGoalXp : 50} XP
              </strong>
            </div>
            <div className="goal-track">
              <div
                className="goal-track__fill"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            {dueCount > 0 && (
              <Link href={`/day/${resumeDay}#srs-review`} className="srs-link">
                <RotateCcw className="h-3.5 w-3.5" />
                {dueCount} spaced-repetition {dueCount === 1 ? 'card' : 'cards'}{' '}
                due
              </Link>
            )}
          </div>
        </section>

        {/* The whole course at a glance — a map you can steer by, rather than
            the sidebar's scrolling list. */}
        <section className="home-map">
          <p className="subhead">The 20-day arc</p>
          <ol className="home-map__phases">
            {PHASES.map((phase) => (
              <li key={phase.label} className="home-map__phase">
                <p className="home-map__phase-label">{phase.label}</p>
                <div className="home-map__nodes">
                  {phase.days.map((n) => {
                    const isDone = completedDays.includes(n)
                    const isLocked = ready && n > unlocked
                    const isCurrent = n === resumeDay && !isDone
                    const d = curriculum.days.find((x) => x.day === n)
                    const cls = [
                      'home-node',
                      isDone && 'is-done',
                      isLocked && 'is-locked',
                      isCurrent && 'is-current',
                    ]
                      .filter(Boolean)
                      .join(' ')

                    if (isLocked) {
                      return (
                        <span
                          key={n}
                          className={cls}
                          aria-disabled="true"
                          title={`Day ${n} — finish earlier days to unlock`}
                        >
                          <Lock className="h-3 w-3" aria-hidden />
                        </span>
                      )
                    }
                    return (
                      <Link
                        key={n}
                        href={`/day/${n}`}
                        className={cls}
                        title={`Day ${n}: ${d?.title ?? ''}`}
                        aria-current={isCurrent ? 'step' : undefined}
                      >
                        {n}
                      </Link>
                    )
                  })}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </AppShell>
  )
}
