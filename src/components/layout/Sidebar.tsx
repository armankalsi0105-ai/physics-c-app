'use client'

import Link from 'next/link'
import { Check, Lock } from 'lucide-react'
import { useProgress } from '@/context/ProgressContext'
import { curriculum } from '@/lib/curriculum'
import { maxUnlockedDay } from '@/lib/storage'
import { SciCalculator } from '@/components/study/SciCalculator'
import { ProgressBackup } from '@/components/study/ProgressBackup'
import { QuestCard } from '@/components/study/QuestCard'
import { BADGE_META } from '@/lib/badges'

const PHASES: { label: string; days: number[] }[] = [
  { label: 'Derivatives & Kinematics', days: [1, 2, 3, 4, 5] },
  { label: 'Vectors & Products', days: [6, 7, 8] },
  { label: 'Integration', days: [9, 10] },
  { label: 'Dynamics & Work', days: [11, 12, 13] },
  { label: 'Energy & Momentum', days: [14, 15, 16] },
  { label: 'Rotation & Oscillation', days: [17, 18, 19] },
  { label: 'Final Review', days: [20] },
]

type Props = {
  currentDay: number
  open: boolean
  onClose: () => void
}

export function Sidebar({ currentDay, open, onClose }: Props) {
  const { state, ready, dayStatus, dueSrsItems, dailyGoalProgress } =
    useProgress()
  const completedDays = ready ? state.completedDays : []
  const unlocked = ready ? maxUnlockedDay(state) : 1
  const upNext = unlocked
  const goalPct = ready ? Math.round(dailyGoalProgress * 100) : 0
  const dailyEarned = ready ? state.dailyXpEarned : 0
  const streak = ready ? state.streak : 0
  const badges = ready ? state.badges : []
  const dueCount = ready ? dueSrsItems.length : 0

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#101f2e]/40 transition lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`sidebar-panel fixed inset-y-0 left-0 z-50 w-[min(20rem,92vw)] overflow-y-auto px-3 py-4 transition-transform lg:sticky lg:top-[4.2rem] lg:z-0 lg:h-[calc(100vh-4.2rem)] lg:w-auto lg:translate-x-0 lg:px-0 lg:py-4 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="sidebar-dash">
          <p className="phase-label" style={{ marginTop: 0 }}>
            Today&apos;s goal
          </p>
          <div className="goal-track">
            <div className="goal-track__fill" style={{ width: `${goalPct}%` }} />
          </div>
          <p className="sidebar-dash__meta">
            {dailyEarned} / {state.dailyGoalXp} XP · {streak} day streak
          </p>
          {dueCount > 0 && (
            <a href="#srs-review" className="srs-link" onClick={onClose}>
              {dueCount} review due
            </a>
          )}
          {badges.length > 0 && (
            <div className="badge-row">
              {badges.slice(-3).map((id) => (
                <span key={id} className="badge-pill" title={BADGE_META[id].description}>
                  {BADGE_META[id].title}
                </span>
              ))}
            </div>
          )}
        </div>

        <QuestCard />
        <SciCalculator collapsed />
        <ProgressBackup />

        <nav aria-label="20-day syllabus">
          {PHASES.map((phase) => (
            <div key={phase.label}>
              <p className="phase-label">{phase.label}</p>
              <ul className="m-0 list-none space-y-0.5 p-0">
                {phase.days.map((n) => {
                  const d = curriculum.days.find((x) => x.day === n)
                  if (!d) return null
                  const done = completedDays.includes(n)
                  const active = n === currentDay
                  const locked = ready && dayStatus(n) === 'locked'
                  const score = ready ? state.quizScores[String(n)] : undefined

                  if (locked) {
                    return (
                      <li key={n}>
                        <span
                          className="day-nav-link is-locked"
                          aria-disabled="true"
                          title="Finish earlier days to unlock"
                        >
                          <span className="day-num day-num--locked">
                            <Lock className="h-3 w-3" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                            {d.title}
                          </span>
                          <span className="locked-chip">Locked</span>
                        </span>
                      </li>
                    )
                  }

                  return (
                    <li key={n}>
                      <Link
                        href={`/day/${n}`}
                        onClick={onClose}
                        className={`day-nav-link ${active ? 'is-active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span
                          className={`day-num ${done ? 'day-num--done' : ''}`}
                        >
                          {done ? <Check className="h-3.5 w-3.5" /> : n}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[color:var(--ink)]">
                          {d.title}
                        </span>
                        {done && typeof score === 'number' && (
                          <span className="score-chip">{score}/3</span>
                        )}
                        {!done && n === upNext && (
                          <span className="upnext-chip">Up next</span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
