'use client'

import { useEffect, useMemo, useState } from 'react'
import { Timer, Trophy } from 'lucide-react'
import { MathText } from '@/components/MathText'
import { flashcardsForDay } from '@/data/flashcards'
import { useProgress } from '@/context/ProgressContext'
import { seededShuffle, shuffle } from '@/lib/shuffle'

type Pair = { id: string; left: string; right: string }

// The opening board is seeded off the day so the server and the client lay out
// the same tiles. Re-shuffles after a wrong match are post-interaction, where
// true randomness is safe.
const openingBoard = (ids: string[], day: number, column: number) =>
  seededShuffle(ids, day * 2 + column)

export function EquationMatch({ day }: { day: number }) {
  const cards = useMemo(() => flashcardsForDay(day).slice(0, 4), [day])
  const { awardXp } = useProgress()
  const pairs: Pair[] = useMemo(
    () => cards.map((c) => ({ id: c.id, left: c.front, right: c.back })),
    [cards],
  )

  const [leftOrder] = useState(() =>
    openingBoard(
      pairs.map((p) => p.id),
      day,
      0,
    ),
  )
  const [rightOrder, setRightOrder] = useState(() =>
    openingBoard(
      pairs.map((p) => p.id),
      day,
      1,
    ),
  )
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [started, setStarted] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!started || done) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [started, done])

  if (pairs.length < 2) return null

  const byId = Object.fromEntries(pairs.map((p) => [p.id, p]))

  const onPickLeft = (id: string) => {
    if (matched.includes(id)) return
    if (!started) setStarted(true)
    setSelectedLeft(id)
  }

  const onPickRight = (id: string) => {
    if (!selectedLeft || matched.includes(id)) return
    if (selectedLeft === id) {
      const next = [...matched, id]
      setMatched(next)
      setSelectedLeft(null)
      if (next.length >= pairs.length) {
        setDone(true)
        awardXp(8)
      }
    } else {
      setSelectedLeft(null)
      setRightOrder(shuffle(pairs.map((p) => p.id)))
    }
  }

  return (
    <div className="match-panel">
      <div className="match-panel__head">
        <Trophy className="h-4 w-4 text-[color:var(--accent)]" />
        <h3>Equation Match</h3>
        <span className="match-timer">
          <Timer className="h-3.5 w-3.5" />
          {seconds}s
        </span>
      </div>
      <p className="match-lead">
        Tap a concept, then its formula. Clear the board as fast as you can.
      </p>
      <div className="match-grid">
        <div className="match-col">
          {leftOrder.map((id) => (
            <button
              key={`L-${id}`}
              type="button"
              className={`match-tile ${selectedLeft === id ? 'is-picked' : ''} ${
                matched.includes(id) ? 'is-matched' : ''
              }`}
              disabled={matched.includes(id)}
              onClick={() => onPickLeft(id)}
            >
              <MathText text={byId[id].left} />
            </button>
          ))}
        </div>
        <div className="match-col">
          {rightOrder.map((id) => (
            <button
              key={`R-${id}`}
              type="button"
              className={`match-tile ${matched.includes(id) ? 'is-matched' : ''}`}
              disabled={matched.includes(id)}
              onClick={() => onPickRight(id)}
            >
              <MathText text={byId[id].right} />
            </button>
          ))}
        </div>
      </div>
      {done && (
        <p className="match-done">Board cleared in {seconds}s · +8 XP</p>
      )}
    </div>
  )
}
