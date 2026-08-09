'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Timer, Trophy, XCircle } from 'lucide-react'
import { Latex, tryLatex } from '@/components/Latex'
import {
  looksLikeFormula,
  MathText,
  RichText,
  StepList,
} from '@/components/MathText'
import { useProgress } from '@/context/ProgressContext'
import type { Problem } from '@/lib/types'
import { isCorrect } from './PracticeProblem'

type Props = {
  quiz: Problem[]
  takeaways: string[]
  day: number
  alreadyComplete: boolean
  onComplete: (score: number) => void
}

export function DailyQuiz({
  quiz,
  takeaways,
  day,
  alreadyComplete,
  onComplete,
}: Props) {
  const { recordProblemResult, recordSpeedrun, state } = useProgress()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [speedrun, setSpeedrun] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startedAt = useRef<number | null>(null)
  const storedScore = state.quizScores[String(day)]
  const best = state.speedrunBest[String(day)]

  useEffect(() => {
    if (!speedrun || submitted || startedAt.current == null) return
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current!) / 1000))
    }, 250)
    return () => window.clearInterval(id)
  }, [speedrun, submitted])

  const score = useMemo(() => {
    if (!submitted) return 0
    return quiz.reduce(
      (acc, q) => acc + (isCorrect(q, answers[q.id] ?? '') ? 1 : 0),
      0,
    )
  }, [answers, quiz, submitted])

  const completionScore = submitted
    ? score
    : typeof storedScore === 'number'
      ? storedScore
      : 0

  const allAnswered = quiz.every((q) => answers[q.id]?.trim())

  const submit = () => {
    setSubmitted(true)
    quiz.forEach((q) => {
      const ok = isCorrect(q, answers[q.id] ?? '')
      recordProblemResult({
        problemId: q.id,
        day,
        section: 'quiz',
        prompt: q.prompt,
        correct: ok,
        firstTry: true,
      })
    })
    if (speedrun && startedAt.current != null) {
      const seconds = Math.max(
        1,
        Math.round((Date.now() - startedAt.current) / 1000),
      )
      recordSpeedrun(String(day), seconds)
      setElapsed(seconds)
    }
  }

  return (
    <div className="quiz-wrap">
      <div className="quiz-wrap__tools">
        <button
          type="button"
          className={`btn-ghost ${speedrun ? 'is-active' : ''}`}
          disabled={submitted}
          onClick={() => {
            if (submitted) return
            const next = !speedrun
            setSpeedrun(next)
            if (next) {
              startedAt.current = Date.now()
              setElapsed(0)
            } else {
              startedAt.current = null
              setElapsed(0)
            }
          }}
        >
          <Timer className="h-4 w-4" />
          {speedrun ? `Speedrun ${elapsed}s` : 'Speedrun mode'}
        </button>
        {typeof best === 'number' && (
          <span className="helper-text">Best: {best}s</span>
        )}
      </div>
      <div className="stack-gap">
        {quiz.map((q, i) => (
          <QuizItem
            key={q.id}
            problem={q}
            index={i}
            value={answers[q.id] ?? ''}
            submitted={submitted}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
            onEnter={() => {
              if (allAnswered) submit()
            }}
          />
        ))}
      </div>

      {!submitted ? (
        <button
          type="button"
          disabled={!allAnswered}
          onClick={submit}
          className="btn-primary"
        >
          Submit daily quiz
        </button>
      ) : (
        <div className="feedback feedback--good">
          <p className="feedback-title text-base">
            <Trophy className="h-5 w-5" />
            Score: {score}/{quiz.length}
          </p>
          <div className="stack-gap mt-3">
            {quiz.map((q) => {
              const right = isCorrect(q, answers[q.id] ?? '')
              return (
                <div key={q.id} className="quiz-review">
                  <p className="quiz-review__prompt">
                    {right ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[color:var(--ok)]" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 flex-none text-[color:var(--signal)]" />
                    )}
                    <MathText text={q.prompt} />
                  </p>
                  <StepList steps={q.steps} />
                  <p className="feedback-solution">
                    <span className="feedback-label">Solution</span>
                    <span className="formula-answer">
                      {tryLatex(q.solution) ? (
                        <Latex latex={tryLatex(q.solution)!} display />
                      ) : (
                        <MathText text={q.solution} />
                      )}
                    </span>
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <h4 className="takeaways-title">Key takeaways</h4>
        <ul className="takeaways-list">
          {takeaways.map((t) => (
            <li key={t}>
              <RichText text={t} steps />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          type="button"
          disabled={!submitted && !alreadyComplete}
          onClick={() => onComplete(completionScore)}
          className="btn-signal w-full sm:w-auto"
        >
          {alreadyComplete
            ? `Day ${day} completed — continue to next day`
            : `Complete Day ${day} & Unlock Next Day`}
        </button>
        {!submitted && !alreadyComplete && (
          <p className="helper-text">
            Submit the quiz first to unlock the complete-day action.
          </p>
        )}
      </div>
    </div>
  )
}

function QuizItem({
  problem,
  index,
  value,
  submitted,
  onChange,
  onEnter,
}: {
  problem: Problem
  index: number
  value: string
  submitted: boolean
  onChange: (v: string) => void
  onEnter?: () => void
}) {
  return (
    <div className="quiz-card">
      <p className="card-kicker card-kicker--signal">Quiz {index + 1}</p>
      <p
        className={`card-prompt ${
          looksLikeFormula(problem.prompt) ? 'card-prompt--formula' : ''
        }`}
      >
        <MathText text={problem.prompt} />
      </p>
      {problem.type === 'mc' && problem.options ? (
        <div className="option-stack">
          {problem.options.map((opt) => (
            <label
              key={opt}
              className={`option-row ${
                value === opt ? 'is-picked is-picked--signal' : ''
              } ${submitted ? 'is-locked' : ''}`}
            >
              <input
                type="radio"
                name={`quiz-${problem.id}`}
                checked={value === opt}
                disabled={submitted}
                onChange={() => onChange(opt)}
                className="accent-[#b8500f]"
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
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim() && !submitted) {
              e.preventDefault()
              onEnter?.()
            }
          }}
          className="answer-input"
          placeholder="Your answer"
          aria-label={`Answer for quiz question ${index + 1}`}
        />
      )}
    </div>
  )
}
