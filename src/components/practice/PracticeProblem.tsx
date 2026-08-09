'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCircle2,
  Compass,
  Lightbulb,
  RotateCcw,
  Shuffle,
  XCircle,
} from 'lucide-react'
import { Latex, tryLatex } from '@/components/Latex'
import {
  looksLikeFormula,
  MathText,
  RichText,
  StepList,
} from '@/components/MathText'
import { getProgressiveHints } from '@/lib/hints'
import { buildPracticeAid } from '@/lib/practiceAid'
import { makeProblemVariant, socraticPrompt } from '@/lib/variants'
import type { PracticeSetKind, Problem } from '@/lib/types'
import { useProgress } from '@/context/ProgressContext'
import { inferMisconception } from '@/lib/adaptive'
import { SET_XP_MULT, XP } from '@/lib/badges'

type Props = {
  problem: Problem
  index: number
  day: number
  section: 'math' | 'physics' | 'quiz'
  onResult?: (correct: boolean) => void
  /** When true, awards spaced-repetition XP instead of practice XP. */
  srsMode?: boolean
  setKind?: PracticeSetKind
}

export function isCorrect(problem: Problem, value: string) {
  if (problem.type === 'mc') {
    return value.trim() === String(problem.answer).trim()
  }
  const num = Number(value)
  const ans = Number(problem.answer)
  const tol = problem.tolerance ?? Math.max(0.05, Math.abs(ans) * 0.02)
  return Number.isFinite(num) && Math.abs(num - ans) <= tol
}

function FormulaLine({ text }: { text: string }) {
  const latex = tryLatex(text)
  if (latex) return <Latex latex={latex} display />
  return <MathText text={text} />
}

export function PracticeProblem({
  problem: baseProblem,
  index,
  day,
  section,
  onResult,
  srsMode = false,
  setKind,
}: Props) {
  const { recordProblemResult, markSrsReviewed, state, bumpQuest } =
    useProgress()
  const [variantIndex, setVariantIndex] = useState(0)
  const problem = useMemo(
    () => makeProblemVariant(baseProblem, variantIndex),
    [baseProblem, variantIndex],
  )
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hintTier, setHintTier] = useState(0)
  const [showAid, setShowAid] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [socratic, setSocratic] = useState<string | null>(null)
  const attempted = useRef(false)

  const hints = useMemo(() => getProgressiveHints(problem), [problem])
  const aid = useMemo(() => buildPracticeAid(problem), [problem])
  const correct = submitted && isCorrect(problem, value)
  const alreadySolved = state.solvedProblems.includes(baseProblem.id)

  useEffect(() => {
    setValue('')
    setSubmitted(false)
    setHintTier(0)
    setShowAid(false)
    setXpEarned(0)
    setSocratic(null)
    attempted.current = false
  }, [problem.id])

  const onCheck = () => {
    if (!value.trim()) return
    const ok = isCorrect(problem, value)
    setSubmitted(true)
    const firstTry = !attempted.current && hintTier === 0
    attempted.current = true

    if (!ok) {
      setSocratic(socraticPrompt(problem, value))
    } else {
      setSocratic(null)
    }

    if (srsMode) {
      markSrsReviewed(problem.id, ok)
      setXpEarned(ok ? XP.srsReview : 0)
      if (ok) bumpQuest('srsReviews')
    } else {
      recordProblemResult({
        problemId: baseProblem.id,
        day,
        section,
        prompt: problem.prompt,
        correct: ok,
        firstTry,
        setKind,
        misconception: ok ? undefined : inferMisconception(day, problem.prompt),
      })
      if (ok) bumpQuest('practiceCorrect')
      if (ok && !alreadySolved && section !== 'quiz') {
        let amount = XP.practiceCorrect + (firstTry ? XP.practiceFirstTry : 0)
        if (setKind) amount = Math.round(amount * SET_XP_MULT[setKind])
        setXpEarned(amount)
      } else {
        setXpEarned(0)
      }
    }
    onResult?.(ok)
  }

  const onReset = () => {
    setSubmitted(false)
    setValue('')
    setHintTier(0)
    setXpEarned(0)
  }

  const revealNextHint = () => {
    setHintTier((t) => Math.min(3, t + 1))
  }

  return (
    <div className="practice-card">
      <div className="practice-card__head">
        <p className="card-kicker">Practice {index + 1}</p>
        {alreadySolved && !submitted && (
          <span className="solved-chip">Solved before</span>
        )}
      </div>
      <p
        className={`card-prompt ${
          looksLikeFormula(problem.prompt) ? 'card-prompt--formula' : ''
        }`}
      >
        <MathText text={problem.prompt} />
      </p>

      <div className="think-first">
        <button
          type="button"
          className="think-first__toggle"
          onClick={() => setShowAid((v) => !v)}
          aria-expanded={showAid}
        >
          <Compass className="h-4 w-4" />
          Think first
          <span className="think-first__chev">{showAid ? 'Hide' : 'Show'}</span>
        </button>
        {showAid && (
          <div className="think-first__body">
            <div className="think-grid">
              <div>
                <p className="think-label">Given</p>
                <ul className="think-list">
                  {aid.given.map((g) => (
                    <li key={g}>
                      <MathText text={g} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="think-label">Find</p>
                <p className="think-find">
                  <MathText text={aid.find} />
                  {aid.units && (
                    <span className="think-units"> · expect {aid.units}</span>
                  )}
                </p>
              </div>
            </div>
            <p className="think-bridge">
              <MathText text={aid.bridge} />
            </p>
            <p className="think-pitfall">
              <strong>Watch out:</strong> {aid.pitfall}
            </p>
          </div>
        )}
      </div>

      {problem.type === 'mc' && problem.options ? (
        <div className="option-stack" role="radiogroup" aria-label={`Options for practice ${index + 1}`}>
          {problem.options.map((opt) => (
            <label
              key={opt}
              className={`option-row ${value === opt ? 'is-picked' : ''} ${
                submitted ? 'is-locked' : ''
              }`}
            >
              <input
                type="radio"
                name={problem.id}
                value={opt}
                checked={value === opt}
                onChange={() => setValue(opt)}
                disabled={submitted}
                className="accent-[#0b6e78]"
              />
              <span>
                <MathText text={opt} />
              </span>
            </label>
          ))}
        </div>
      ) : (
        <input
          type="text"
          inputMode="decimal"
          value={value}
          disabled={submitted}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim() && !submitted) {
              e.preventDefault()
              onCheck()
            }
          }}
          placeholder={
            aid.units ? `Enter your answer (${aid.units})` : 'Enter your answer'
          }
          className="answer-input"
          aria-label={`Answer for practice ${index + 1}`}
        />
      )}

      <div className="action-row">
        {!submitted ? (
          <>
            <button
              type="button"
              onClick={onCheck}
              disabled={!value.trim()}
              className="btn-primary"
            >
              Check answer
            </button>
            <button
              type="button"
              onClick={revealNextHint}
              disabled={hintTier >= 3}
              className="btn-ghost"
            >
              <Lightbulb className="h-4 w-4" />
              {hintTier === 0
                ? 'Hint 1: Concept'
                : hintTier === 1
                  ? 'Hint 2: Formula'
                  : hintTier === 2
                    ? 'Hint 3: Setup'
                    : 'All hints shown'}
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onReset} className="btn-ghost">
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setVariantIndex((v) => v + 1)
                setSubmitted(false)
                setValue('')
                setSocratic(null)
                setHintTier(0)
                attempted.current = false
              }}
            >
              <Shuffle className="h-4 w-4" />
              Try a variant
            </button>
          </>
        )}
      </div>

      {socratic && submitted && !correct && (
        <aside className="socratic-ask" aria-live="polite">
          <p className="socratic-ask__label">Pause — think before the solution</p>
          <p>{socratic}</p>
        </aside>
      )}

      {hintTier >= 1 && !submitted && (
        <div className="hint-ladder" aria-live="polite">
          {hintTier >= 1 && (
            <div className="hint-tier">
              <span className="hint-tier__label">1 · Concept</span>
              <RichText text={hints.concept} steps />
            </div>
          )}
          {hintTier >= 2 && (
            <div className="hint-tier">
              <span className="hint-tier__label">2 · Formula</span>
              <span className="formula-answer">
                <FormulaLine text={hints.formula} />
              </span>
            </div>
          )}
          {hintTier >= 3 && (
            <div className="hint-tier">
              <span className="hint-tier__label">3 · Setup</span>
              <RichText text={hints.setup} steps />
            </div>
          )}
        </div>
      )}

      {submitted && (
        <div
          className={`feedback ${correct ? 'feedback--good' : 'feedback--bad'}`}
          role="status"
        >
          <p className="feedback-title">
            {correct ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Correct
                {xpEarned > 0 && (
                  <span className="xp-pill">+{xpEarned} XP</span>
                )}
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" /> Not quite — queued for review in
                3 days
              </>
            )}
          </p>
          {!correct && (
            <p className="think-pitfall" style={{ marginTop: '0.5rem' }}>
              <strong>Watch out:</strong> {aid.pitfall}
            </p>
          )}
          <p className="feedback-label">Step-by-step</p>
          <StepList steps={problem.steps} />
          <p className="feedback-solution">
            <span className="feedback-label">Solution</span>
            <span className="formula-answer">
              <FormulaLine text={problem.solution} />
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
