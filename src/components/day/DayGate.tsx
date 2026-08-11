'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { useProgress } from '@/context/ProgressContext'
import { maxUnlockedDay } from '@/lib/storage'

/** Blocks viewing a locked day and sends the student back to their furthest unlocked day. */
export function DayGate({
  day,
  children,
}: {
  day: number
  children: ReactNode
}) {
  const { ready, dayStatus, state } = useProgress()
  const router = useRouter()
  const status = ready ? dayStatus(day) : 'in-progress'
  const locked = ready && status === 'locked'
  // Read the target here so the redirect effect depends on a number rather than
  // the whole progress object, which changes on every study tick.
  const unlocked = ready ? maxUnlockedDay(state) : 1

  useEffect(() => {
    if (!locked) return
    router.replace(`/day/${unlocked}`)
  }, [locked, unlocked, router])

  if (!ready) return <>{children}</>

  if (locked) {
    return (
      <div className="day-locked" role="status">
        <Lock className="h-5 w-5 text-[color:var(--accent)]" aria-hidden />
        <h2>Day {day} is locked</h2>
        <p>
          Finish Day {Math.max(1, unlocked)} first — complete its
          daily quiz to unlock Day {day}. Days open one at a time so the math
          and physics stay connected.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
