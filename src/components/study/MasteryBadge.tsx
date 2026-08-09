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
