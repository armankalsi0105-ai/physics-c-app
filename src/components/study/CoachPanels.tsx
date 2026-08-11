'use client'

import { useState } from 'react'
import {
  ArrowRight,
  Brain,
  GraduationCap,
  Lightbulb,
  MapPin,
  MessageCircle,
  Sparkles,
  Target,
  AlertTriangle,
} from 'lucide-react'
import { MathText } from '@/components/MathText'
import { getDayPedagogy } from '@/lib/pedagogy'
import { getDayRealWorld } from '@/lib/realWorld'
import { useProgress } from '@/context/ProgressContext'

export function LearningObjectives({ day }: { day: number }) {
  const ped = getDayPedagogy(day)
  const { state, setObjectiveCheck } = useProgress()
  const checks = state.pedagogy.objectivesChecked[String(day)] ?? []

  return (
    <div className="coach-card">
      <div className="coach-card__head">
        <Target className="h-4 w-4" />
        <h3>Today&apos;s learning goals</h3>
      </div>
      <p className="coach-card__lead">
        Check these off as you go — like a teacher&apos;s exit criteria.
      </p>
      <ul className="coach-objectives">
        {ped.objectives.map((obj, i) => {
          const on = Boolean(checks[i])
          return (
            <li key={obj}>
              <label className={on ? 'is-on' : ''}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(e) =>
                    setObjectiveCheck(day, i, ped.objectives.length, e.target.checked)
                  }
                />
                <span>
                  <MathText text={obj} />
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function CoachOpen({ day }: { day: number }) {
  const ped = getDayPedagogy(day)
  return (
    <aside className="coach-aside" aria-label="Teacher tip">
      <GraduationCap className="h-5 w-5 flex-none text-[color:var(--accent)]" />
      <div>
        <p className="coach-aside__label">Teacher note</p>
        <p>
          <MathText text={ped.coachOpen} />
        </p>
      </div>
    </aside>
  )
}

export function MathPhysicsBridge({ day }: { day: number }) {
  const ped = getDayPedagogy(day)
  return (
    <div className="bridge-card">
      <p className="bridge-card__kicker">Math → Physics transfer</p>
      <div className="bridge-card__grid">
        <div>
          <span>Math</span>
          <p>
            <MathText text={ped.bridge.math} />
          </p>
        </div>
        <ArrowRight className="bridge-card__arrow" aria-hidden />
        <div>
          <span>Physics</span>
          <p>
            <MathText text={ped.bridge.physics} />
          </p>
        </div>
      </div>
      <p className="bridge-card__transfer">
        <Lightbulb className="h-4 w-4" />
        <MathText text={ped.bridge.transfer} />
      </p>
    </div>
  )
}

export function MisconceptionPanel({ day }: { day: number }) {
  const ped = getDayPedagogy(day)
  return (
    <div className="myth-panel">
      <div className="coach-card__head">
        <AlertTriangle className="h-4 w-4 text-[color:var(--signal)]" />
        <h3>Trap alerts</h3>
      </div>
      <ul>
        {ped.misconceptions.map((m) => (
          <li key={m.myth}>
            <p className="myth-panel__myth">
              <span>Myth</span> <MathText text={m.myth} />
            </p>
            <p className="myth-panel__truth">
              <span>Truth</span> <MathText text={m.truth} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TeachBack({ day }: { day: number }) {
  const ped = getDayPedagogy(day)
  const { state, setTeachBack } = useProgress()
  const saved = state.pedagogy.teachBack[String(day)] ?? ''
  const [text, setText] = useState(saved)
  const [flash, setFlash] = useState(false)

  // Reload the draft when the student moves to another day. Deliberately not
  // synced on every store change — that would overwrite what they are typing.
  const [lastDay, setLastDay] = useState(day)
  if (lastDay !== day) {
    setLastDay(day)
    setText(saved)
  }

  return (
    <div className="teachback">
      <div className="coach-card__head">
        <MessageCircle className="h-4 w-4" />
        <h3>Teach it back</h3>
      </div>
      <p className="coach-card__lead">
        If you can explain it simply, you own it. Write as if tutoring a peer.
      </p>
      <p className="teachback__prompt">
        <MathText text={ped.teachBack} />
      </p>
      <textarea
        className="notes-field"
        rows={3}
        value={text}
        placeholder="Type your explanation…"
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          setTeachBack(day, text)
          setFlash(true)
          window.setTimeout(() => setFlash(false), 800)
        }}
        aria-label="Teach-back explanation"
      />
      <p className={`notes-saved ${flash ? 'is-on' : ''}`}>
        {flash ? 'Saved' : 'Saves when you leave the box'}
      </p>
    </div>
  )
}

export function ConfidenceCheck({ day }: { day: number }) {
  const ped = getDayPedagogy(day)
  const { state, setConfidence } = useProgress()
  const scores = state.pedagogy.confidence[String(day)] ?? []

  return (
    <div className="confidence">
      <div className="coach-card__head">
        <Target className="h-4 w-4" />
        <h3>Confidence check</h3>
      </div>
      <p className="coach-card__lead">
        Before the quiz: rate yourself honestly (1 = shaky, 5 = exam-ready).
      </p>
      <ul className="confidence__list">
        {ped.skills.map((skill, i) => (
          <li key={skill}>
            <span>
              <MathText text={skill} />
            </span>
            <div className="confidence__dots" role="group" aria-label={skill}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`confidence__dot ${
                    (scores[i] ?? 0) >= n ? 'is-on' : ''
                  }`}
                  onClick={() =>
                    setConfidence(day, i, ped.skills.length, n)
                  }
                  aria-label={`${skill}: ${n} of 5`}
                >
                  {n}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ReflectionPrompts({ day }: { day: number }) {
  const ped = getDayPedagogy(day)
  return (
    <ul className="reflect-prompts">
      {ped.reflect.map((r) => (
        <li key={r}>
          <MathText text={r} />
        </li>
      ))}
    </ul>
  )
}

export function RealWorldPanel({ day }: { day: number }) {
  const rw = getDayRealWorld(day)
  return (
    <div className="real-world" id="sec-real">
      <div className="coach-card__head">
        <MapPin className="h-4 w-4" />
        <h3>Why this shows up in real life</h3>
      </div>
      <p className="real-world__hook">
        <MathText text={rw.hook} />
      </p>
      <ul className="real-world__scenes">
        {rw.scenes.map((s) => (
          <li key={s.scene}>
            <p className="real-world__scene-label">{s.scene}</p>
            <p className="real-world__story">
              <MathText text={s.story} />
            </p>
            <p className="real-world__takeaway">
              <Sparkles className="h-3.5 w-3.5 flex-none" aria-hidden />
              <span>
                <MathText text={s.takeaway} />
              </span>
            </p>
          </li>
        ))}
      </ul>
      <div className="real-world__try">
        <p className="real-world__try-label">Try this in your head</p>
        <p>
          <MathText text={rw.tryThis} />
        </p>
      </div>
    </div>
  )
}

export function IntuitionCallout({ day }: { day: number }) {
  const rw = getDayRealWorld(day)
  return (
    <aside className="intuition-callout" aria-label="Plain-language intuition">
      <Brain className="h-5 w-5 flex-none" aria-hidden />
      <div>
        <p className="intuition-callout__label">Before the symbols</p>
        <p>
          <MathText text={rw.intuition} />
        </p>
      </div>
    </aside>
  )
}

export function ConnectBack({ day }: { day: number }) {
  const rw = getDayRealWorld(day)
  const scene = rw.scenes[0]?.scene ?? 'today’s example'
  return (
    <aside className="connect-back" aria-label="Connect back to real life">
      <Lightbulb className="h-4 w-4 flex-none" aria-hidden />
      <div>
        <p className="connect-back__label">Lock it in</p>
        <p>
          In one sentence, how does today&apos;s math explain the{' '}
          <strong>{scene}</strong> scene? If you can answer without looking up,
          you&apos;re ready for the teach-back.
        </p>
      </div>
    </aside>
  )
}

