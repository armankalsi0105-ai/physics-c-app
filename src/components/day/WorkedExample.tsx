'use client'

import { useState } from 'react'
import { Calculator, Eye, EyeOff, Sparkles } from 'lucide-react'
import { MathText, StepList } from '@/components/MathText'
import { explainStep } from '@/lib/variants'

type Props = {
  prompt: string
  steps: string[]
}

/**
 * Progressive reveal — teacher models one step at a time (faded worked example).
 */
export function WorkedExample({ prompt, steps }: Props) {
  const [revealed, setRevealed] = useState(1)
  const [showAll, setShowAll] = useState(false)
  const [explainIdx, setExplainIdx] = useState<number | null>(null)
  const [explainMode, setExplainMode] = useState<'calc' | 'eli10'>('calc')
  const visible = showAll ? steps.length : revealed

  return (
    <div className="worked-example">
      <header className="worked-example__header">
        <span className="worked-example__icon" aria-hidden>
          <Calculator className="h-4 w-4" />
        </span>
        <div>
          <p>Guided example</p>
          <h3>Try to predict the next step before revealing it</h3>
        </div>
      </header>

      <div className="worked-example__problem">
        <span>Problem</span>
        <p>
          <MathText text={prompt} />
        </p>
      </div>

      <div className="worked-example__steps">
        <StepList steps={steps.slice(0, visible)} />
        {visible > 0 && (
          <div className="explain-step">
            <button
              type="button"
              className="btn-ghost"
              onClick={() =>
                setExplainIdx((i) => (i === visible - 1 ? null : visible - 1))
              }
            >
              <Sparkles className="h-4 w-4" />
              Explain this step
            </button>
            {explainIdx === visible - 1 && (
              <div className="explain-step__body">
                <div className="learn-mode-tabs" role="tablist">
                  <button
                    type="button"
                    className={`learn-tab ${explainMode === 'calc' ? 'is-active' : ''}`}
                    onClick={() => setExplainMode('calc')}
                  >
                    Break down the calculus
                  </button>
                  <button
                    type="button"
                    className={`learn-tab ${explainMode === 'eli10' ? 'is-active' : ''}`}
                    onClick={() => setExplainMode('eli10')}
                  >
                    Explain like I&apos;m 10
                  </button>
                </div>
                <p>{explainStep(steps[explainIdx], explainMode)}</p>
              </div>
            )}
          </div>
        )}
        {visible < steps.length && (
          <p className="worked-example__veil">
            {steps.length - visible} step{steps.length - visible === 1 ? '' : 's'}{' '}
            still covered — attempt it yourself first.
          </p>
        )}
      </div>

      <div className="worked-example__actions">
        {visible < steps.length && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => setRevealed((r) => Math.min(steps.length, r + 1))}
          >
            <Eye className="h-4 w-4" />
            Reveal next step
          </button>
        )}
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            if (visible >= steps.length) {
              setShowAll(false)
              setRevealed(1)
              setExplainIdx(null)
            } else {
              setShowAll(true)
              setRevealed(steps.length)
            }
          }}
        >
          {visible >= steps.length ? (
            <>
              <EyeOff className="h-4 w-4" />
              Cover steps again
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Show all steps
            </>
          )}
        </button>
      </div>
    </div>
  )
}
