'use client'

import { lazy, Suspense, useEffect, useState } from 'react'
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
  StudyPath,
  TeachBack,
} from '@/components/study/CoachPanels'
import { useProgress } from '@/context/ProgressContext'
import { getDay } from '@/lib/curriculum'
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

  useEffect(() => {
    if (!note) return
    setSavedFlash(true)
    const id = window.setTimeout(() => setSavedFlash(false), 900)
    return () => window.clearTimeout(id)
  }, [note])

  return (
    <article className="day-view">
      <header className="day-hero">
        <span className="day-hero__numeral" aria-hidden>
          {String(day.day).padStart(2, '0')}
        </span>
        <p className="day-hero__kicker">Day {day.day} of 20</p>
        <h1>
          <MathText text={day.title} />
        </h1>
        <div className="hero-chips">
          <MasteryBadge day={day.day} state={state} />
          <span className="hero-chip hero-chip--focus">
            <Target className="h-3.5 w-3.5" />
            {focusChip.text}
          </span>
          {completed ? (
            <span className="hero-chip hero-chip--status-done">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
              {typeof state.quizScores[String(day.day)] === 'number' &&
                ` · quiz ${state.quizScores[String(day.day)]}/3`}
            </span>
          ) : (
            <span className="hero-chip hero-chip--status-open">
              <CircleDot className="h-3.5 w-3.5" />
              In progress
            </span>
          )}
          <span className="hero-chip hero-chip--plain">
            <Clock3 className="h-3.5 w-3.5" />
            ~95 min
          </span>
        </div>
      </header>

      <StudyPath />

      <KnowledgeGraphPanel day={day.day} />

      <nav className="day-jump" aria-label="Jump to section">
        {JUMP.map((j) => (
          <a key={j.id} href={`#${j.id}`}>
            {j.label}
          </a>
        ))}
        {dueSrsItems.length > 0 && (
          <a href="#srs-review" className="day-jump__alert">
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
          onChange={(e) => setNote(day.day, e.target.value)}
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

      <Suspense fallback={null}>
        <FormulaExplorer
          open={formulaOpen || explorer.open}
          onClose={() => {
            setFormulaOpen(false)
            explorer.closeExplorer()
          }}
          initialQuery={explorer.query}
        />
      </Suspense>
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
