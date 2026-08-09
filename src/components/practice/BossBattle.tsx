'use client'

import { useEffect, useMemo, useState } from 'react'
import { Swords } from 'lucide-react'
import { PracticeProblem } from '@/components/practice/PracticeProblem'
import { useProgress } from '@/context/ProgressContext'
import { getDay } from '@/lib/curriculum'

const BOSS_DAYS = new Set([5, 10, 15, 20])
const BOSS_SECONDS = 180

export function BossBattle({ day }: { day: number }) {
  const { state, clearBoss } = useProgress()
  const bossId = `boss-d${day}`
  const cleared = state.bossClears.includes(bossId)
  const [active, setActive] = useState(false)
  const [left, setLeft] = useState(BOSS_SECONDS)
  const [correctCount, setCorrectCount] = useState(0)

  const problems = useMemo(() => {
    const d = getDay(day)
    if (!d) return []
    return [...d.math.problems, ...d.physics.problems].slice(0, 3)
  }, [day])

  useEffect(() => {
    if (!active || cleared) return
    const id = window.setInterval(() => {
      setLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [active, cleared])

  useEffect(() => {
    if (correctCount >= problems.length && problems.length > 0 && active) {
      clearBoss(bossId)
      setActive(false)
    }
  }, [correctCount, problems.length, active, bossId, clearBoss])

  if (!BOSS_DAYS.has(day) || problems.length === 0) return null

  return (
    <div className="boss-battle">
      <div className="boss-battle__head">
        <Swords className="h-4 w-4" />
        <div>
          <h3>Boss battle — Day {day}</h3>
          <p>Clear {problems.length} problems before the timer hits zero.</p>
        </div>
        {cleared ? (
          <span className="workout__badge">Cleared</span>
        ) : active ? (
          <span className="boss-battle__timer">{left}s</span>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setActive(true)
              setLeft(BOSS_SECONDS)
              setCorrectCount(0)
            }}
          >
            Fight
          </button>
        )}
      </div>
      {active && !cleared && left > 0 && (
        <div className="stack-gap">
          {problems.map((p, i) => (
            <PracticeProblem
              key={p.id}
              problem={p}
              index={i}
              day={day}
              section="physics"
              onResult={(ok) => {
                if (ok) setCorrectCount((c) => c + 1)
              }}
            />
          ))}
        </div>
      )}
      {active && left === 0 && !cleared && (
        <p className="helper-text">Time’s up — try again.</p>
      )}
    </div>
  )
}
