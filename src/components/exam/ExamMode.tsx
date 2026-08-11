'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Calculator, Timer } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { FrqPanel } from '@/components/exam/FrqPanel'
import { SciCalculator } from '@/components/study/SciCalculator'
import { isCorrect } from '@/components/practice/PracticeProblem'
import { MathText } from '@/components/MathInline'
import { useProgress } from '@/context/ProgressContext'
import { allFrqs } from '@/data/frqs'
import { curriculum } from '@/lib/curriculum'
import { predictedApScore } from '@/lib/frq/ecf'
import { seededShuffle } from '@/lib/shuffle'
import { maxUnlockedDay, todayKey } from '@/lib/storage'
import type { Problem } from '@/lib/types'

const EXAM_SECONDS = 45 * 60

/**
 * Draws the paper from every unlocked day. Seeded on the attempt number rather
 * than `Math.random()` so the server and the client agree during hydration —
 * each new attempt still gets a different set of questions.
 */
function pickMcqs(unlocked: number, n: number, attempt: number): Problem[] {
  const pool: Problem[] = []
  for (const day of curriculum.days) {
    if (day.day > unlocked) continue
    pool.push(...day.review.quiz)
  }
  return seededShuffle(pool, attempt * 31 + unlocked).slice(0, n)
}

export function ExamMode() {
  const { state, recordExam, ready } = useProgress()
  const unlocked = ready ? maxUnlockedDay(state) : 1
  const frq = useMemo(() => {
    const list = allFrqs().filter((f) => f.day <= unlocked)
    return list[list.length - 1] ?? allFrqs()[0]
  }, [unlocked])

  // Derived, not captured in state: `unlocked` is 1 until the store hydrates,
  // and a `useState` initialiser would have frozen the paper to day 1 only.
  const attempt = ready ? state.examHistory.length : 0
  const mcqs = useMemo(
    () => pickMcqs(unlocked, 5, attempt),
    [unlocked, attempt],
  )

  const [mcAnswers, setMcAnswers] = useState<Record<string, string>>({})
  const [left, setLeft] = useState(EXAM_SECONDS)
  const [calcOpen, setCalcOpen] = useState(false)
  const [frqNumeric, setFrqNumeric] = useState(0)
  const [frqMethod, setFrqMethod] = useState(0)
  const [frqMax, setFrqMax] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const id = window.setInterval(() => {
      setLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [done])

  const submit = () => {
    let mcCorrect = 0
    for (const q of mcqs) {
      if (isCorrect(q, mcAnswers[q.id] ?? '')) mcCorrect++
    }
    const predicted = predictedApScore(
      mcCorrect,
      mcqs.length,
      frqNumeric + frqMethod,
      frqMax || 1,
    )
    recordExam({
      id: `exam-${todayKey()}-${attempt + 1}`,
      completedAt: todayKey(),
      mcCorrect,
      mcTotal: mcqs.length,
      frqPoints: frqNumeric,
      frqMax: frqMax || 1,
      methodPoints: frqMethod,
      predictedScore: predicted,
      secondsUsed: EXAM_SECONDS - left,
    })
    setDone(true)
  }

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  return (
    <AppShell currentDay={state.activeDay}>
      <article className="exam-mode">
        <header className="exam-mode__head">
          <div>
            <h1>AP Exam Mode</h1>
            <p>Timed MCQ + one FRQ with error-carried-forward grading.</p>
          </div>
          <div className="exam-mode__timer">
            <Timer className="h-4 w-4" />
            {mm}:{ss}
          </div>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setCalcOpen((o) => !o)}
          >
            <Calculator className="h-4 w-4" />
            Calculator
          </button>
        </header>

        {calcOpen && (
          <div className="exam-mode__calc">
            <SciCalculator />
          </div>
        )}

        <section>
          <h2>Multiple choice</h2>
          {mcqs.map((q, i) => (
            <div key={q.id} className="exam-mcq">
              <p>
                <strong>{i + 1}.</strong> <MathText text={q.prompt} />
              </p>
              {q.type === 'mc' && q.options ? (
                <div className="option-list">
                  {q.options.map((opt) => (
                    <label key={opt} className="option-row">
                      <input
                        type="radio"
                        name={q.id}
                        checked={mcAnswers[q.id] === opt}
                        onChange={() =>
                          setMcAnswers((a) => ({ ...a, [q.id]: opt }))
                        }
                        disabled={done}
                      />
                      <MathText text={opt} />
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  className="answer-input"
                  value={mcAnswers[q.id] ?? ''}
                  disabled={done}
                  onChange={(e) =>
                    setMcAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
        </section>

        <section>
          <h2>Free response</h2>
          <FrqPanel
            frq={frq}
            onScored={(n, m, max) => {
              setFrqNumeric(n)
              setFrqMethod(m)
              setFrqMax(max)
            }}
          />
        </section>

        {!done ? (
          <button type="button" className="btn-primary" onClick={submit}>
            Submit exam
          </button>
        ) : (
          <div className="exam-done">
            <p>Exam saved to your analytics history.</p>
            <Link href="/analytics" className="btn-primary">
              View analytics
            </Link>
          </div>
        )}
      </article>
    </AppShell>
  )
}
