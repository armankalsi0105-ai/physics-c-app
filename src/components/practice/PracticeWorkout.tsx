'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, Dumbbell, Timer } from 'lucide-react'
import { PracticeProblem } from '@/components/practice/PracticeProblem'
import { useProgress } from '@/context/ProgressContext'
import { inferMisconception } from '@/lib/adaptive'
import { SET_XP_MULT, XP } from '@/lib/badges'
import { todayKey } from '@/lib/storage'
import type {
  KineticSetKind,
  MisconceptionTag,
  PracticeSetKind,
  Problem,
} from '@/lib/types'

type Props = {
  day: number
  problems: Problem[]
}

const KINETIC_SETS: {
  kind: KineticSetKind
  label: string
  hint: string
}[] = [
  {
    kind: 'warmup',
    label: 'Warm-Up',
    hint: 'Quick conceptual check — get moving.',
  },
  {
    kind: 'technique',
    label: 'Technique',
    hint: 'Focus on setup, units, and correct method.',
  },
  {
    kind: 'speed',
    label: 'Speed',
    hint: 'Same skills, less time — trust your pattern.',
  },
  {
    kind: 'challenge',
    label: 'Challenge',
    hint: 'Harder variant — connect multiple ideas.',
  },
  {
    kind: 'mastery',
    label: 'Mastery',
    hint: 'Prove fluency without hints.',
  },
  {
    kind: 'cooldown',
    label: 'Cooldown',
    hint: 'Light review — consolidate what stuck.',
  },
]

const REST_SECONDS = 30

function pickProblem(problems: Problem[], setIndex: number): Problem | null {
  if (!problems.length) return null
  return problems[setIndex % problems.length]
}

export function PracticeWorkout({ day, problems }: Props) {
  const { state, completePracticeSet, recordKineticSet } = useProgress()
  const [active, setActive] = useState(0)
  const [phase, setPhase] = useState<'work' | 'rest'>('work')
  const [restLeft, setRestLeft] = useState(REST_SECONDS)
  const [reflection, setReflection] = useState('')
  const [confidence, setConfidence] = useState(3)
  const [setResults, setSetResults] = useState<boolean[]>([])
  // Stamped on mount by the effect below — `Date.now()` during render is impure.
  const setStartRef = useRef(0)
  const mistakesRef = useRef<MisconceptionTag[]>([])

  const sets = useMemo(
    () =>
      KINETIC_SETS.map((s, i) => ({
        ...s,
        id: `d${day}-kinetic-${s.kind}`,
        problem: pickProblem(problems, i),
      })).filter((s) => s.problem != null),
    [day, problems],
  )

  const firstOpen = sets.findIndex((s) => {
    const key = `${day}:${s.id}`
    const done = state.setReps.setCompletions[key] ?? []
    return !s.problem || !done.includes(s.problem.id)
  })

  useEffect(() => {
    if (phase !== 'rest') return
    const id = window.setInterval(() => {
      setRestLeft((r) => {
        if (r <= 1) {
          window.setTimeout(() => {
            setPhase('work')
            setRestLeft(REST_SECONDS)
            setActive((a) => (a < sets.length - 1 ? a + 1 : a))
          }, 0)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [phase, sets.length])

  // Follow the first unfinished set as progress is recorded. Adjusting during
  // render rather than in an effect avoids a pass showing the stale set.
  const [lastFirstOpen, setLastFirstOpen] = useState(firstOpen)
  if (lastFirstOpen !== firstOpen) {
    setLastFirstOpen(firstOpen)
    if (firstOpen >= 0) setActive(firstOpen)
  }

  // Every set/phase change starts with a blank reflection and neutral confidence.
  const stage = `${active}:${phase}`
  const [lastStage, setLastStage] = useState(stage)
  if (lastStage !== stage) {
    setLastStage(stage)
    setReflection('')
    setConfidence(3)
  }

  useEffect(() => {
    setStartRef.current = Date.now()
    mistakesRef.current = []
  }, [active, phase])

  const current = sets[active]
  const allDone = sets.every((s) => {
    if (!s.problem) return true
    const k = `${day}:${s.id}`
    const done = state.setReps.setCompletions[k] ?? []
    return done.includes(s.problem.id)
  })

  const finishSet = useCallback(
    (correct: boolean, problem: Problem) => {
      if (!current?.problem) return

      setSetResults((prev) => [...prev, correct])
      if (!correct) {
        mistakesRef.current.push(inferMisconception(day, problem.prompt))
      }

      if (correct) {
        completePracticeSet({
          day,
          setId: current.id,
          problemId: problem.id,
          setKind: current.kind as PracticeSetKind,
          allSetProblemIds: [problem.id],
          allDaySetIds: sets.map((s) => s.id),
        })
      }

      const seconds = Math.round((Date.now() - setStartRef.current) / 1000)
      const accuracy = correct ? 1 : 0
      const mult = SET_XP_MULT[current.kind] ?? 1
      const xpEarned = correct
        ? Math.round(XP.practiceCorrect * mult)
        : 0

      recordKineticSet({
        day,
        setKind: current.kind,
        setId: current.id,
        accuracy,
        seconds,
        confidence,
        xpEarned,
        mistakes: [...mistakesRef.current],
        completedAt: todayKey(),
      })

      setPhase('rest')
      setRestLeft(REST_SECONDS)
    },
    [confidence, completePracticeSet, current, day, recordKineticSet, sets],
  )

  if (!current?.problem) return null

  const setKey = `${day}:${current.id}`
  const completedIds = state.setReps.setCompletions[setKey] ?? []
  const setDone = completedIds.includes(current.problem.id)

  return (
    <div className="workout workout--kinetic">
      <div className="workout__head">
        <Dumbbell className="h-4 w-4 text-[color:var(--accent)]" />
        <div>
          <h3>Kinetic progression</h3>
          <p>Warm-Up → Technique → Speed → Challenge → Mastery → Cooldown</p>
        </div>
        {allDone && <span className="workout__badge">Workout clear</span>}
      </div>

      <div className="workout__pills" role="tablist" aria-label="Kinetic sets">
        {sets.map((s, i) => {
          const k = `${day}:${s.id}`
          const done = s.problem
            ? (state.setReps.setCompletions[k] ?? []).includes(s.problem.id)
            : false
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`workout-pill ${i === active ? 'is-active' : ''} ${
                done ? 'is-done' : ''
              }`}
              onClick={() => {
                setActive(i)
                setPhase('work')
              }}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : null}
              {s.label}
            </button>
          )
        })}
      </div>

      {phase === 'rest' ? (
        <div className="kinetic-rest">
          <Timer className="h-5 w-5 text-[color:var(--accent)]" />
          <p className="kinetic-rest__timer">{restLeft}s rest</p>
          <label className="kinetic-rest__label" htmlFor={`reflect-${day}`}>
            Reflect on this set
          </label>
          <textarea
            id={`reflect-${day}`}
            className="notes-field kinetic-rest__reflect"
            rows={3}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What clicked? What still feels fuzzy?"
          />
          <fieldset className="kinetic-rest__confidence">
            <legend>Confidence (1–5)</legend>
            <div className="confidence__dots">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`confidence__dot${confidence === n ? ' is-on' : ''}`}
                  onClick={() => setConfidence(n)}
                  aria-pressed={confidence === n}
                >
                  {n}
                </button>
              ))}
            </div>
          </fieldset>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setRestLeft(0)
            }}
          >
            Skip rest
          </button>
        </div>
      ) : (
        <>
          <p className="workout__hint">{current.hint}</p>
          {setResults.length > 0 && (
            <p className="kinetic-stats">
              Session accuracy:{' '}
              {Math.round(
                (setResults.filter(Boolean).length / setResults.length) * 100,
              )}
              %
            </p>
          )}
          <div className="stack-gap">
            <PracticeProblem
              key={`${current.id}-${current.problem.id}`}
              problem={current.problem}
              index={0}
              day={day}
              section="physics"
              setKind={current.kind as PracticeSetKind}
              onResult={(correct) => {
                if (setDone) return
                finishSet(correct, current.problem!)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
