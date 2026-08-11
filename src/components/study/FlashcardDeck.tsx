'use client'

import { useMemo, useState } from 'react'
import { Layers, RotateCcw } from 'lucide-react'
import { MathText } from '@/components/MathText'
import { flashcardsForDay, type Flashcard } from '@/data/flashcards'
import { useProgress } from '@/context/ProgressContext'
import { hashSeed, seededShuffle } from '@/lib/shuffle'
import type { LearnPhase } from '@/lib/types'

function normalizeAnswer(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[·•]/g, '*')
    .replace(/−/g, '-')
}

function fillPrompt(card: Flashcard): { prompt: string; answer: string } {
  const back = card.back
  const token = back.split(/[=;]/)[0]?.trim().slice(0, 16) || back.slice(0, 12)
  return {
    prompt: `From memory, write a key fragment of the answer (hint starts like “${token}…”).`,
    answer: token,
  }
}

const PHASE_LABEL: Record<LearnPhase, string> = {
  mcq: 'Phase 1 · Multiple choice',
  fill: 'Phase 2 · Fill in the blank',
  write: 'Phase 3 · Write the formula',
  done: 'Mastered card',
}

type DeckMode = 'flip' | 'learn' | 'mine'

export function FlashcardDeck({ day }: { day: number }) {
  const curriculumCards = useMemo(() => flashcardsForDay(day), [day])
  const { markFlashcard, recordLearnResult, state } = useProgress()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [mode, setMode] = useState<DeckMode>('learn')
  const [choice, setChoice] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const myCards = useMemo(
    () =>
      state.notebookCards
        .filter((c) => c.day === day)
        .map(
          (c): Flashcard => ({
            id: c.id,
            day,
            front: c.front,
            back: c.back,
            category: 'concept',
          }),
        ),
    [day, state.notebookCards],
  )

  const cards = mode === 'mine' ? myCards : curriculumCards
  const card = cards.length ? cards[index % cards.length] : null
  const phase: LearnPhase = card
    ? (state.learnMode[card.id]?.phase ?? 'mcq')
    : 'mcq'

  // Seeded on the card id: the option order has to survive hydration, and it
  // should stay put if the component re-renders mid-question. Distractors are
  // trimmed *before* the final shuffle so the answer can never be sliced off.
  const mcqOptions = useMemo(() => {
    if (!card) return []
    const seed = hashSeed(card.id)
    const distractors = seededShuffle(
      cards.filter((c) => c.id !== card.id).map((c) => c.back),
      seed,
    ).slice(0, 3)
    return seededShuffle([card.back, ...distractors], seed + 1)
  }, [card, cards])

  const fill = useMemo(() => (card ? fillPrompt(card) : null), [card])

  const progress = card ? state.flashcards[card.id] : undefined

  const advance = () => {
    setFlipped(false)
    setChoice(null)
    setTyped('')
    setFeedback(null)
    setIndex((i) => (cards.length ? (i + 1) % cards.length : 0))
  }

  if (mode !== 'mine' && (!card || !curriculumCards.length)) return null

  const submitLearn = (correct: boolean) => {
    if (!card) return
    recordLearnResult({ cardId: card.id, day, correct })
    setFeedback(correct ? 'Correct — advancing phase.' : 'Not yet — stay on this phase.')
    window.setTimeout(advance, 700)
  }

  return (
    <div className="flashcard-panel">
      <div className="flashcard-panel__head">
        <Layers className="h-4 w-4 text-[color:var(--accent)]" />
        <h3>Flashcards</h3>
        <span className="flashcard-panel__count">
          {cards.length ? `${(index % cards.length) + 1}/${cards.length}` : '0'}
        </span>
      </div>

      <div className="learn-mode-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={`learn-tab ${mode === 'learn' ? 'is-active' : ''}`}
          aria-selected={mode === 'learn'}
          onClick={() => {
            setMode('learn')
            setIndex(0)
            setFlipped(false)
          }}
        >
          Learn Mode
        </button>
        <button
          type="button"
          role="tab"
          className={`learn-tab ${mode === 'flip' ? 'is-active' : ''}`}
          aria-selected={mode === 'flip'}
          onClick={() => {
            setMode('flip')
            setIndex(0)
            setFlipped(false)
          }}
        >
          Classic flip
        </button>
        <button
          type="button"
          role="tab"
          className={`learn-tab ${mode === 'mine' ? 'is-active' : ''}`}
          aria-selected={mode === 'mine'}
          onClick={() => {
            setMode('mine')
            setIndex(0)
            setFlipped(false)
          }}
        >
          My cards ({myCards.length})
        </button>
      </div>

      {mode === 'mine' && !myCards.length ? (
        <p className="helper-text">
          Highlight lesson text and save a notebook card to build this deck.
        </p>
      ) : !card ? null : mode === 'mine' || mode === 'flip' ? (
        <>
          <button
            type="button"
            className={`flashcard ${flipped ? 'is-flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? 'Show front' : 'Show back'}
          >
            <span className="flashcard__cat">{card.category}</span>
            <span className="flashcard__face">
              <MathText text={flipped ? card.back : card.front} />
            </span>
            <span className="flashcard__hint">
              {flipped ? 'Tap to flip back' : 'Tap to reveal'}
            </span>
          </button>
          <div className="flashcard-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                markFlashcard(card.id, false)
                advance()
              }}
            >
              Still learning
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                markFlashcard(card.id, true)
                advance()
              }}
            >
              {progress?.known ? 'Still got it' : 'Got it (+XP)'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setFlipped(false)
                setIndex(0)
              }}
              aria-label="Restart deck"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="learn-panel">
          <p className="learn-phase">{PHASE_LABEL[phase]}</p>
          <p className="learn-prompt">
            <MathText text={card.front} />
          </p>

          {phase === 'mcq' && (
            <div className="option-stack">
              {mcqOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`option-row ${choice === opt ? 'is-picked' : ''}`}
                  onClick={() => setChoice(opt)}
                >
                  <MathText text={opt} />
                </button>
              ))}
              <button
                type="button"
                className="btn-primary"
                disabled={!choice}
                onClick={() => submitLearn(choice === card.back)}
              >
                Check
              </button>
            </div>
          )}

          {phase === 'fill' && fill && (
            <div className="learn-write">
              <p className="learn-hint">{fill.prompt}</p>
              <input
                className="answer-input"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Key symbol or fragment"
                aria-label="Fill in the blank"
              />
              <button
                type="button"
                className="btn-primary"
                disabled={!typed.trim()}
                onClick={() =>
                  submitLearn(
                    normalizeAnswer(typed).includes(normalizeAnswer(fill.answer)) ||
                      normalizeAnswer(card.back).includes(normalizeAnswer(typed)),
                  )
                }
              >
                Check
              </button>
            </div>
          )}

          {(phase === 'write' || phase === 'done') && (
            <div className="learn-write">
              <p className="learn-hint">
                {phase === 'done'
                  ? 'Card mastered — rewrite once more to reinforce.'
                  : 'Write the formula / definition from memory.'}
              </p>
              <textarea
                className="notes-field"
                rows={3}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Type the full answer"
                aria-label="Write formula"
              />
              <button
                type="button"
                className="btn-primary"
                disabled={!typed.trim()}
                onClick={() => {
                  const ok =
                    normalizeAnswer(typed).length >= 4 &&
                    (normalizeAnswer(card.back).includes(
                      normalizeAnswer(typed).slice(0, 8),
                    ) ||
                      normalizeAnswer(typed).includes(
                        normalizeAnswer(card.back).slice(0, 8),
                      ))
                  submitLearn(ok)
                }}
              >
                Check
              </button>
            </div>
          )}

          {feedback && <p className="flashcard-status">{feedback}</p>}
        </div>
      )}
    </div>
  )
}
