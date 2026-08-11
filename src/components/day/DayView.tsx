'use client'

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleDot,
  Clock3,
  Target,
} from 'lucide-react'
import { InteractiveGraph } from '@/components/graphs/InteractiveGraph'
import { DailyQuiz } from '@/components/practice/DailyQuiz'
import { MathText, RichText, StepList } from '@/components/MathText'
import { PracticeProblem } from '@/components/practice/PracticeProblem'
import { VideoList } from '@/components/day/VideoList'
import { WorkedExample } from '@/components/day/WorkedExample'
import { FlashcardDeck } from '@/components/study/FlashcardDeck'
import { MasteryBadge } from '@/components/study/MasteryBadge'
import { EquationMatch } from '@/components/study/EquationMatch'
import { SpacedRepetitionPanel } from '@/components/study/SpacedRepetitionPanel'
import { PracticeWorkout } from '@/components/practice/PracticeWorkout'
import { KnowledgeGraphPanel } from '@/components/study/KnowledgeGraphPanel'
import { SandboxHost } from '@/components/sims/SandboxHost'
import { BossBattle } from '@/components/practice/BossBattle'
import { HighlightNotebook } from '@/components/notebook/HighlightNotebook'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { getTodaysFocusChip } from '@/lib/adaptive'
import { useFormulaExplorer } from '@/context/FormulaExplorerContext'
import {
  CoachOpen,
  ConfidenceCheck,
  IntuitionCallout,
  LearningObjectives,
  MathPhysicsBridge,
  MisconceptionPanel,
  RealWorldPanel,
  ReflectionPrompts,
  ConnectBack,
  TeachBack,
} from '@/components/study/CoachPanels'
import { useProgress } from '@/context/ProgressContext'
import { curriculum, getDay } from '@/lib/curriculum'
import { getDayStatus } from '@/lib/storage'
import type { DayContent } from '@/lib/types'

const FormulaExplorer = lazy(() =>
  import('@/components/study/FormulaExplorer').then((m) => ({
    default: m.FormulaExplorer,
  })),
)

const LogicDebugger = lazy(() =>
  import('@/components/debug/LogicDebugger').then((m) => ({
    default: m.LogicDebugger,
  })),
)

const JUMP = [
  { id: 'sec-overview', label: 'Overview' },
  { id: 'sec-real', label: 'Real world' },
  { id: 'sec-math', label: 'Math' },
  { id: 'sec-physics', label: 'Physics' },
  { id: 'sec-teach', label: 'Teach back' },
  { id: 'sec-quiz', label: 'Quiz' },
  { id: 'sec-notes', label: 'Reflect' },
] as const

export function DayView({ day }: { day: DayContent }) {
  const router = useRouter()
  const { completeDay, setActiveDay, setNote, state, dueSrsItems } =
    useProgress()
  const completed = state.completedDays.includes(day.day)
  const completedCount = state.completedDays.length
  const note = state.notes[String(day.day)] ?? ''
  const prev = getDay(day.day - 1)
  const next = getDay(day.day + 1)
  const [savedFlash, setSavedFlash] = useState(false)
  const [formulaOpen, setFormulaOpen] = useState(false)
  const explorer = useFormulaExplorer()
  const showSrs = dueSrsItems.length > 0 || state.srsQueue.length > 0
  const focusChip = getTodaysFocusChip(day.day, state)

  useEffect(() => {
    setActiveDay(day.day)
  }, [day.day, setActiveDay])

  // The flash is a response to the user typing, not to `note` changing — driving
  // it from the change handler keeps it out of an effect and off the render path.
  const flashTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(flashTimer.current), [])

  const onNoteChange = (value: string) => {
    setNote(day.day, value)
    setSavedFlash(true)
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setSavedFlash(false), 900)
  }

  return (
    <article className="day-view">
      {/* Full-bleed editorial band: arriving at a day should feel like opening
          a chapter, so the number, title and progress get the top of the page. */}
      <header className="day-hero">
        <span className="day-hero__numeral" aria-hidden>
          {String(day.day).padStart(2, '0')}
        </span>

        <div className="day-hero__top">
          <p className="day-hero__kicker">
            Day {String(day.day).padStart(2, '0')}{' '}
            <span aria-hidden>/</span> {curriculum.totalDays}
          </p>
          <ProgressRing
            value={completedCount}
            max={curriculum.totalDays}
            size={54}
            stroke={4}
            label={`${completedCount} of ${curriculum.totalDays} days complete`}
            className="day-hero__ring"
          />
        </div>

        <h1>
          <MathText text={day.title} />
        </h1>

        <p className="day-hero__meta">
          <span>~95 min</span>
          <span aria-hidden>·</span>
          <span>{JUMP.length} sections</span>
          <span aria-hidden>·</span>
          <span className={completed ? 'is-done' : 'is-open'}>
            {completed ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Completed
                {typeof state.quizScores[String(day.day)] === 'number' &&
                  ` · quiz ${state.quizScores[String(day.day)]}/3`}
              </>
            ) : (
              <>
                <CircleDot className="h-3.5 w-3.5" />
                In progress
              </>
            )}
          </span>
        </p>

        <div className="hero-chips">
          <MasteryBadge day={day.day} state={state} />
          <span className="hero-chip hero-chip--focus">
            <Target className="h-3.5 w-3.5" />
            {focusChip.text}
          </span>
        </div>
      </header>

      <KnowledgeGraphPanel day={day.day} />

      {/* One numbered arc replaces the old static StudyPath strip plus a
          separate pill row — same sequence, but every step is a jump link. */}
      <nav className="arc-nav" aria-label="Lesson sections">
        <ol className="arc-nav__list">
          {JUMP.map((j, i) => (
            <li key={j.id}>
              <a href={`#${j.id}`}>
                <span className="arc-nav__num" aria-hidden>
                  {i + 1}
                </span>
                {j.label}
              </a>
            </li>
          ))}
        </ol>
        {dueSrsItems.length > 0 && (
          <a href="#srs-review" className="arc-nav__alert">
            Review ({dueSrsItems.length})
          </a>
        )}
      </nav>

      <section className="section-block" id="sec-overview">
        <SectionHead n={1} title="Overview & Connection" mins={8} />
        <RichText text={day.overview} className="lead" />
        <RealWorldPanel day={day.day} />
        <IntuitionCallout day={day.day} />
        <LearningObjectives day={day.day} />
        <CoachOpen day={day.day} />
      </section>

      <section className="section-block" id="sec-math">
        <SectionHead n={2} title="Math Foundation" mins={40} />
        <p className="section-coach">
          You just pictured where this idea lives in the real world. Now build
          the math tool carefully — predict each worked-example step before you
          reveal it.
        </p>
        <RichText text={day.math.lesson} />

        {day.math.example && (
          <WorkedExample
            prompt={day.math.example.prompt}
            steps={day.math.example.steps}
          />
        )}

        <p className="subhead">Watch</p>
        <VideoList videos={day.math.videos} />

        <p className="subhead">Explore</p>
        <InteractiveGraph config={day.math.graph} />

        <p className="subhead">Practice</p>
        <div className="stack-gap">
          {day.math.problems.map((p, i) => (
            <PracticeProblem
              key={p.id}
              problem={p}
              index={i}
              day={day.day}
              section="math"
            />
          ))}
        </div>

        <FlashcardDeck day={day.day} />
        <EquationMatch day={day.day} />
        <MisconceptionPanel day={day.day} />
      </section>

      <section className="section-block" id="sec-physics">
        <SectionHead n={3} title="AP Physics C Application" mins={40} />
        <MathPhysicsBridge day={day.day} />
        <p className="section-coach">
          Translate the math into physics language. Keep today&apos;s real-world
          scenes in mind — the symbols are just compressed versions of those
          stories.
        </p>
        <RichText text={day.physics.lesson} />

        {day.physics.derivation && (
          <div className="panel panel--derive">
            <h3>{day.physics.derivation.title}</h3>
            <StepList steps={day.physics.derivation.steps} />
            <Suspense fallback={<p className="helper-text">Loading debugger…</p>}>
              <LogicDebugger
                title={day.physics.derivation.title}
                steps={day.physics.derivation.steps}
              />
            </Suspense>
          </div>
        )}

        <p className="subhead">Watch</p>
        <VideoList videos={day.physics.videos} />

        <p className="subhead">Explore</p>
        <InteractiveGraph config={day.physics.graph} />
        <SandboxHost day={day.day} />
        <BossBattle day={day.day} />

        <p className="subhead">Practice — kinetic progression</p>
        <PracticeWorkout day={day.day} problems={day.physics.problems} />
        <ConnectBack day={day.day} />
      </section>

      <HighlightNotebook day={day.day} />

      <section className="section-block" id="sec-teach">
        <SectionHead n={null} title="Explain it like a tutor" mins={5} />
        <TeachBack day={day.day} />
      </section>

      {showSrs && (
        <section className="section-block" id="srs-review">
          <SectionHead n={null} title="Spaced Repetition" mins={5} />
          <SpacedRepetitionPanel />
        </section>
      )}

      <section className="section-block" id="sec-quiz">
        <SectionHead n={4} title="Daily Review & Quiz" mins={10} />
        <ConfidenceCheck day={day.day} />
        <DailyQuiz
          quiz={day.review.quiz}
          takeaways={day.review.takeaways}
          day={day.day}
          alreadyComplete={completed}
          onComplete={(score) => {
            completeDay(day.day, score)
            if (day.day < 20) router.push(`/day/${day.day + 1}`)
          }}
        />
      </section>

      <section className="section-block" id="sec-notes">
        <div className="notes-head">
          <label className="notes-label" htmlFor="notes">
            Reflect &amp; notes
          </label>
          <span
            className={`notes-saved ${savedFlash ? 'is-on' : ''}`}
            aria-live="polite"
          >
            {savedFlash ? 'Saved' : 'Autosaves on this device'}
          </span>
        </div>
        <p className="helper-text" style={{ marginTop: 0 }}>
          Use the prompts below — this is the part that turns studying into
          lasting knowledge.
        </p>
        <ReflectionPrompts day={day.day} />
        <textarea
          id="notes"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={5}
          placeholder="Answer the reflection prompts in your own words…"
          className="notes-field"
        />
      </section>

      <nav className="day-footer-nav" aria-label="Day navigation">
        {prev ? (
          <Link href={`/day/${prev.day}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="truncate">Day {prev.day}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && getDayStatus(next.day, state) !== 'locked' ? (
          <Link href={`/day/${next.day}`} className="is-next">
            <span className="truncate">
              Day {next.day}
              <span className="nav-title"> · {next.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 flex-none" />
          </Link>
        ) : next ? (
          <span className="day-footer-nav__locked" title="Complete this day to unlock">
            Day {next.day} locked
          </span>
        ) : null}
      </nav>

      <button
        type="button"
        className="btn-ghost formula-explorer-trigger"
        onClick={() => setFormulaOpen(true)}
      >
        <BookOpen className="h-4 w-4" />
        Formula explorer
      </button>

      {/* Mounted only while open: the explorer then starts from a clean slate
          each time, and its chunk is not fetched until a student asks for it. */}
      {(formulaOpen || explorer.open) && (
        <Suspense fallback={null}>
          <FormulaExplorer
            onClose={() => {
              setFormulaOpen(false)
              explorer.closeExplorer()
            }}
            initialQuery={explorer.query}
          />
        </Suspense>
      )}
    </article>
  )
}

function SectionHead({
  n,
  title,
  mins,
}: {
  n: number | null
  title: string
  mins: number
}) {
  return (
    <div className="section-head">
      {n != null ? <span className="section-head__num">{n}</span> : null}
      <h2>{title}</h2>
      <span className="section-head__time">
        <Clock3 className="h-3.5 w-3.5" />
        {mins} min
      </span>
    </div>
  )
}
