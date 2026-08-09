'use client'

import { useMemo, useState } from 'react'
import { MathText } from '@/components/MathInline'
import { scoreFrq } from '@/lib/frq/ecf'
import type { FRQ } from '@/lib/types'

type Props = {
  frq: FRQ
  onScored?: (numeric: number, method: number, max: number) => void
}

export function FrqPanel({ frq, onScored }: Props) {
  const [answers, setAnswers] = useState<
    Record<string, { value: string; method: string }>
  >({})
  const [scored, setScored] = useState<ReturnType<typeof scoreFrq> | null>(null)

  const resultMap = useMemo(() => {
    if (!scored) return {}
    return Object.fromEntries(scored.results.map((r) => [r.partId, r]))
  }, [scored])

  return (
    <div className="frq-panel">
      <h3>{frq.title}</h3>
      {frq.parts.map((part) => {
        const r = resultMap[part.id]
        return (
          <div key={part.id} className="frq-part">
            <p className="frq-part__prompt">
              <strong>({part.id})</strong> [{part.points} pts]{' '}
              <MathText text={part.prompt} />
            </p>
            <label>
              Numeric answer
              <input
                className="answer-input"
                value={answers[part.id]?.value ?? ''}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [part.id]: {
                      value: e.target.value,
                      method: prev[part.id]?.method ?? '',
                    },
                  }))
                }
              />
            </label>
            <label>
              Method / reasoning (keywords earn method XP)
              <textarea
                className="notes-field"
                rows={2}
                value={answers[part.id]?.method ?? ''}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [part.id]: {
                      value: prev[part.id]?.value ?? '',
                      method: e.target.value,
                    },
                  }))
                }
                placeholder={part.methodRubric.slice(0, 3).join(', ')}
              />
            </label>
            {r && (
              <div className="frq-result">
                <p>
                  Numeric: {r.numericCorrect ? '✓' : '✗'} ({r.numericPoints.toFixed(1)} pts) ·
                  Method: {r.methodPoints.toFixed(1)} pts
                  {r.usedEcf && ' · ECF applied'}
                </p>
                {r.divergence && <p className="frq-divergence">{r.divergence}</p>}
                <div className="frq-compare">
                  <div>
                    <span>Official</span>
                    <p>{part.solution}</p>
                  </div>
                  <div>
                    <span>Your universe</span>
                    <p>
                      {r.studentUniverseAnswer != null
                        ? `Expected ≈ ${r.studentUniverseAnswer.toFixed(3)}`
                        : part.officialAnswer}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
      <button
        type="button"
        className="btn-primary"
        onClick={() => {
          const s = scoreFrq(frq, answers)
          setScored(s)
          onScored?.(s.numericTotal, s.methodTotal, s.maxPoints)
        }}
      >
        Grade with ECF
      </button>
    </div>
  )
}
