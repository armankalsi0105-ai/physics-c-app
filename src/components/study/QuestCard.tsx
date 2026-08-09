'use client'

import { Trophy } from 'lucide-react'
import { useProgress } from '@/context/ProgressContext'

const QUESTS = [
  {
    id: 'q-kinetic-3',
    label: 'Clear 3 kinetic sets this week',
    field: 'kineticSets' as const,
    target: 3,
  },
  {
    id: 'q-srs-5',
    label: 'Review 5 SRS items this week',
    field: 'srsReviews' as const,
    target: 5,
  },
  {
    id: 'q-practice-10',
    label: 'Get 10 practice answers correct',
    field: 'practiceCorrect' as const,
    target: 10,
  },
]

export function QuestCard() {
  const { state, claimQuest, ready } = useProgress()
  if (!ready) return null
  const q = state.quests

  return (
    <div className="quest-card">
      <div className="quest-card__head">
        <Trophy className="h-4 w-4" />
        <h3>Weekly quests</h3>
      </div>
      <ul>
        {QUESTS.map((quest) => {
          const progress = q[quest.field] ?? 0
          const claimed = q.claimed.includes(quest.id)
          const readyClaim = progress >= quest.target && !claimed
          return (
            <li key={quest.id}>
              <span>
                {quest.label}{' '}
                <em>
                  {Math.min(progress, quest.target)}/{quest.target}
                </em>
              </span>
              {claimed ? (
                <span className="quest-card__done">Claimed</span>
              ) : (
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={!readyClaim}
                  onClick={() => claimQuest(quest.id)}
                >
                  Claim +25 XP
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
