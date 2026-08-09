'use client'

import { getConceptNeighbors } from '@/data/knowledgeGraph'
import { computeDayMastery } from '@/lib/mastery'
import { useProgress } from '@/context/ProgressContext'
import { AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react'
import { ProgressRing } from '@/components/ui/ProgressRing'

const MASTERY_TO_PCT = {
  unstarted: 0,
  practiced: 33,
  level1: 66,
  mastered: 100,
} as const

const TAG_LABEL: Record<string, string> = {
  chain_rule: 'Chain rule',
  sign_error: 'Sign errors',
  fbd: 'Free-body diagrams',
  units: 'Units',
  product_rule: 'Product rule',
  limits: 'Limits',
  energy: 'Energy',
  momentum: 'Momentum',
  rotation: 'Rotation',
  vectors: 'Vectors',
  integrals: 'Integrals',
  general: 'General',
}

type Props = { day: number }

export function KnowledgeGraphPanel({ day }: Props) {
  const { state } = useProgress()
  const { current, prev, next } = getConceptNeighbors(day)
  const mastery = computeDayMastery(day, state)
  const masteryPct = MASTERY_TO_PCT[mastery]
  const weakTags = state.adaptive.focusTags.slice(0, 2)

  if (!current) return null

  return (
    <div className="kg-panel" aria-label="Knowledge graph">
      <div className="kg-panel__head">
        <h3>Concept map</h3>
        <ProgressRing value={masteryPct} size={40} stroke={3} label="Day mastery" />
      </div>

      <div className="kg-strip" role="list">
        {prev.map((node) => (
          <div key={node.id} className="kg-node kg-node--prev" role="listitem">
            <ArrowLeft className="h-3 w-3" aria-hidden />
            <span className="kg-node__label">{node.label}</span>
            <span className="kg-node__day">D{node.day}</span>
          </div>
        ))}

        <div className="kg-node kg-node--current" role="listitem" aria-current="true">
          <span className="kg-node__label">{current.label}</span>
          <span className="kg-node__day">Day {day}</span>
        </div>

        {next.map((node) => (
          <div key={node.id} className="kg-node kg-node--next" role="listitem">
            <span className="kg-node__label">{node.label}</span>
            <span className="kg-node__day">D{node.day}</span>
            <ArrowRight className="h-3 w-3" aria-hidden />
          </div>
        ))}
      </div>

      {weakTags.length > 0 && (
        <div className="kg-weak">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
          <span>Weak links:</span>
          {weakTags.map((tag) => (
            <span key={tag} className="kg-weak__tag">
              {TAG_LABEL[tag] ?? tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
