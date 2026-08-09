'use client'

import { masteryRank } from '@/lib/mastery'
import type { MasteryLevel } from '@/lib/types'

const MASTERY_PCT: Record<MasteryLevel, number> = {
  unstarted: 0,
  practiced: 33,
  level1: 66,
  mastered: 100,
}

type Props = {
  level: MasteryLevel
  label?: string
  showPercent?: boolean
}

export function MasteryMeter({ level, label, showPercent = true }: Props) {
  const pct = MASTERY_PCT[level]
  const rank = masteryRank(level)

  return (
    <div className="mastery-meter">
      {label && <span className="mastery-meter__label">{label}</span>}
      <div className="mastery-meter__track">
        <div
          className="mastery-meter__fill"
          style={{ width: `${pct}%` }}
          data-level={level}
        />
      </div>
      {showPercent && (
        <span className="mastery-meter__pct">
          {pct}% · L{rank}
        </span>
      )}
    </div>
  )
}
