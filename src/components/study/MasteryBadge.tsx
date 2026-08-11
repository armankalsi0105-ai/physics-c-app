'use client'

import { Award } from 'lucide-react'
import { computeDayMastery, MASTERY_LABEL } from '@/lib/mastery'
import type { MasteryLevel, ProgressState } from '@/lib/types'

export function MasteryBadge({
  day,
  state,
}: {
  day: number
  state: ProgressState
}) {
  const level: MasteryLevel = computeDayMastery(day, state)
  // "Unstarted" next to the hero's own completion status reads as a
  // contradiction; the badge only says something once mastery is under way.
  if (level === 'unstarted') return null
  return (
    <span
      className={`mastery-badge mastery-badge--${level}`}
      title="Khan-style skill mastery for this day"
    >
      <Award className="h-3.5 w-3.5" aria-hidden />
      {MASTERY_LABEL[level]}
    </span>
  )
}
