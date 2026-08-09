'use client'

import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { XPBadge } from '@/components/ui/XPBadge'
import { useProgress } from '@/context/ProgressContext'
import type { ProgressState } from '@/lib/types'

const TAG_LABEL: Record<string, string> = {
  chain_rule: 'Chain rule',
  sign_error: 'Sign errors',
  fbd: 'FBD',
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

function computeAccuracyProxy(state: ProgressState): number {
  const solved = state.solvedProblems.length
  if (solved === 0) return 0
  const quizTotal = Object.values(state.quizScores).reduce((a, b) => a + b, 0)
  const quizMax = Object.keys(state.quizScores).length * 3
  const quizPct = quizMax > 0 ? quizTotal / quizMax : 0
  const practicePct = Math.min(1, solved / 60)
  return Math.round(((quizPct * 0.6 + practicePct * 0.4) * 100))
}

function predictScore(state: ProgressState): number {
  const completed = state.completedDays.length
  const dayPct = completed / 20
  const accuracy = computeAccuracyProxy(state) / 100
  const kineticAvg =
    state.kineticSessions.length > 0
      ? state.kineticSessions.reduce((a, s) => a + s.accuracy, 0) /
        state.kineticSessions.length
      : 0.5
  const raw = dayPct * 40 + accuracy * 35 + kineticAvg * 25
  return Math.min(100, Math.round(raw))
}

export function AnalyticsDashboard() {
  const { state } = useProgress()

  const xpByDay = useMemo(() => {
    const buckets: Record<number, number> = {}
    for (const d of state.completedDays) {
      buckets[d] = (buckets[d] ?? 0) + 25
    }
    for (const s of state.kineticSessions) {
      buckets[s.day] = (buckets[s.day] ?? 0) + s.xpEarned
    }
    return Object.entries(buckets)
      .map(([day, xp]) => ({ day: `D${day}`, xp }))
      .sort((a, b) => a.day.localeCompare(b.day))
  }, [state.completedDays, state.kineticSessions])

  const weakTags = useMemo(() => {
    return Object.entries(state.adaptive.misconceptionCounts)
      .filter(([, n]) => (n ?? 0) > 0)
      .map(([tag, count]) => ({
        tag: TAG_LABEL[tag] ?? tag,
        count: count ?? 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [state.adaptive.misconceptionCounts])

  const kineticByKind = useMemo(() => {
    const kinds: Record<string, { total: number; count: number }> = {}
    for (const s of state.kineticSessions) {
      if (!kinds[s.setKind]) kinds[s.setKind] = { total: 0, count: 0 }
      kinds[s.setKind].total += s.accuracy
      kinds[s.setKind].count += 1
    }
    return Object.entries(kinds).map(([kind, { total, count }]) => ({
      kind,
      accuracy: Math.round((total / count) * 100),
      sessions: count,
    }))
  }, [state.kineticSessions])

  const accuracy = computeAccuracyProxy(state)
  const predicted = predictScore(state)

  return (
    <div className="analytics-dash">
      <header className="analytics-dash__hero">
        <h1>Analytics</h1>
        <p>Progress signals from XP, practice, kinetic sessions, and adaptive focus.</p>
      </header>

      <div className="analytics-dash__stats">
        <Card kicker="Total XP" title={`${state.xp} XP`}>
          <XPBadge amount={state.dailyXpEarned} earned />
          <p className="helper-text">Daily goal: {state.dailyGoalXp} XP</p>
        </Card>
        <Card kicker="Accuracy proxy" title={`${accuracy}%`}>
          <ProgressRing value={accuracy} size={56} stroke={4} />
          <p className="helper-text">
            From {state.solvedProblems.length} solved problems &amp; quiz scores
          </p>
        </Card>
        <Card kicker="Predicted readiness" title={`${predicted}/100`}>
          <ProgressRing value={predicted} size={56} stroke={4} />
          <p className="helper-text">
            Heuristic from days completed, accuracy, kinetic performance
          </p>
        </Card>
        <Card kicker="Kinetic sessions" title={String(state.kineticSessions.length)}>
          <p className="helper-text">
            Workouts completed: {state.setReps.workoutsCompleted}
          </p>
        </Card>
      </div>

      {xpByDay.length > 0 && (
        <Card kicker="XP by day" title="Experience earned">
          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={xpByDay}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted)" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--panel)',
                    border: '1px solid var(--line)',
                  }}
                />
                <Bar dataKey="xp" fill="var(--chart-1)" name="XP" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {weakTags.length > 0 && (
        <Card kicker="Weak tags" title="Misconception focus">
          <ul className="analytics-tags">
            {weakTags.map((t) => (
              <li key={t.tag}>
                <span>{t.tag}</span>
                <strong>{t.count}</strong>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {kineticByKind.length > 0 && (
        <Card kicker="Kinetic sets" title="Accuracy by set type">
          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={kineticByKind}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
                <XAxis dataKey="kind" tick={{ fontSize: 10 }} stroke="var(--muted)" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="var(--muted)" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--panel)',
                    border: '1px solid var(--line)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--chart-2)"
                  name="accuracy %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  )
}
