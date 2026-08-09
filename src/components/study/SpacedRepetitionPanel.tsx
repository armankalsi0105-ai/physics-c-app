'use client'

import Link from 'next/link'
import { Brain, CheckCircle2 } from 'lucide-react'
import { MathText } from '@/components/MathText'
import { useProgress } from '@/context/ProgressContext'
import { getDay } from '@/lib/curriculum'
import { todayKey } from '@/lib/storage'
import type { Problem } from '@/lib/types'
import { PracticeProblem } from '@/components/practice/PracticeProblem'

function findProblem(item: {
  day: number
  section: 'math' | 'physics' | 'quiz'
  problemId: string
}): Problem | null {
  const day = getDay(item.day)
  if (!day) return null
  const pool =
    item.section === 'math'
      ? day.math.problems
      : item.section === 'physics'
        ? day.physics.problems
        : day.review.quiz
  return pool.find((p) => p.id === item.problemId) ?? null
}

export function SpacedRepetitionPanel() {
  const { state, dueSrsItems } = useProgress()
  const today = todayKey()
  const upcoming = state.srsQueue.filter((s) => s.dueAt > today)

  if (!state.srsQueue.length) {
    return (
      <div className="srs-panel srs-panel--empty">
        <Brain className="h-5 w-5 text-[color:var(--accent)]" />
        <div>
          <h3>Spaced repetition</h3>
          <p>
            Missed practice problems appear here every 3 days. Nail a few
            problems to start your review queue.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="srs-panel">
      <div className="srs-panel__head">
        <Brain className="h-5 w-5 text-[color:var(--accent)]" />
        <div>
          <h3>Spaced repetition</h3>
          <p>
            {dueSrsItems.length} due today · {upcoming.length} scheduled
          </p>
        </div>
      </div>

      {dueSrsItems.length === 0 ? (
        <p className="srs-empty-msg">
          <CheckCircle2 className="h-4 w-4" />
          You&apos;re caught up. Next review in{' '}
          {upcoming[0] ? upcoming[0].dueAt : '—'}
        </p>
      ) : (
        <div className="stack-gap">
          {dueSrsItems.map((item) => {
            const problem = findProblem(item)
            if (!problem) {
              return (
                <div key={item.problemId} className="srs-orphan">
                  <MathText text={item.prompt} />
                  <Link href={`/day/${item.day}`} className="btn-ghost">
                    Open Day {item.day}
                  </Link>
                </div>
              )
            }
            return (
              <PracticeProblem
                key={item.problemId}
                problem={problem}
                index={0}
                day={item.day}
                section={item.section}
                srsMode
              />
            )
          })}
        </div>
      )}

      {upcoming.length > 0 && (
        <ul className="srs-upcoming">
          {upcoming.slice(0, 5).map((s) => (
            <li key={s.problemId}>
              <span>Day {s.day}</span>
              <span className="truncate">
                <MathText text={s.prompt.slice(0, 80)} />
              </span>
              <span className="srs-due">due {s.dueAt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
