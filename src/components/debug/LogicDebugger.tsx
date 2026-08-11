'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from 'lucide-react'
import { MathText } from '@/components/MathInline'
import { parseDebugSteps } from '@/lib/logicDebug'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type Props = {
  title: string
  steps: string[]
}

export function LogicDebugger({ title, steps }: Props) {
  const parsed = useMemo(() => parseDebugSteps(steps), [steps])
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const step = parsed[i]
  // Autoplay stops at the last step; treating that as derived state keeps the
  // effect to scheduling the tick instead of cascading a render.
  const atEnd = i >= parsed.length - 1
  const reducedMotion = usePrefersReducedMotion()
  const isPlaying = playing && !atEnd && !reducedMotion

  useEffect(() => {
    if (!isPlaying) return
    const id = window.setTimeout(() => setI((x) => x + 1), 1600)
    return () => window.clearTimeout(id)
  }, [isPlaying, i])

  if (!step) return null

  const prev = i > 0 ? parsed[i - 1] : null
  const next = i < parsed.length - 1 ? parsed[i + 1] : null

  return (
    <div className="logic-debugger" aria-label="Logic debugger">
      <div className="logic-debugger__head">
        <h3>Logic Debugger — {title}</h3>
        <span>
          Step {i + 1}/{parsed.length}
        </span>
      </div>

      <div className="logic-debugger__eq">
        <MathText text={step.equation} />
      </div>

      <div className="logic-debugger__grid">
        <div>
          <p className="logic-debugger__label">Action</p>
          <p>{step.action}</p>
        </div>
        <div>
          <p className="logic-debugger__label">Explanation</p>
          <p>{step.explanation}</p>
        </div>
        <div>
          <p className="logic-debugger__label">Common mistake</p>
          <p>{step.commonMistake}</p>
        </div>
        <div>
          <p className="logic-debugger__label">Variable memory</p>
          <ul className="logic-debugger__vars">
            {Object.keys(step.vars).length === 0 && <li>—</li>}
            {Object.entries(step.vars).map(([k, v]) => (
              <li key={k}>
                <code>{k}</code> {v}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="logic-debugger__label">Previous</p>
          <p className="logic-debugger__muted">
            {prev ? prev.equation : 'Start'}
          </p>
        </div>
        <div>
          <p className="logic-debugger__label">Next</p>
          <p className="logic-debugger__muted">
            {next ? next.equation : 'Done'}
          </p>
        </div>
      </div>

      <div className="logic-debugger__controls">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setI(0)}
          aria-label="Replay"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="btn-ghost"
          disabled={i === 0}
          onClick={() => setI((x) => Math.max(0, x - 1))}
          aria-label="Step back"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={reducedMotion}
          title={
            reducedMotion
              ? 'Auto play is off while your system asks for reduced motion'
              : undefined
          }
          onClick={() => {
            // Pressing Auto on the last step replays from the top.
            if (atEnd && !isPlaying) setI(0)
            setPlaying((p) => !p || atEnd)
          }}
          aria-label={isPlaying ? 'Pause auto play' : 'Auto play'}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? 'Pause' : 'Auto'}
        </button>
        <button
          type="button"
          className="btn-ghost"
          disabled={i >= parsed.length - 1}
          onClick={() => setI((x) => Math.min(parsed.length - 1, x + 1))}
          aria-label="Step forward"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setI(parsed.length - 1)}
          aria-label="Jump to end"
        >
          <SkipForward className="h-4 w-4" />
        </button>
        <label className="logic-debugger__jump">
          Jump
          <input
            type="range"
            min={0}
            max={parsed.length - 1}
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            aria-label="Jump to step"
          />
        </label>
      </div>
    </div>
  )
}
