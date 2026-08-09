'use client'

import { AppShell } from '@/components/layout/AppShell'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { useProgress } from '@/context/ProgressContext'

export default function AnalyticsPage() {
  const { state } = useProgress()

  return (
    <AppShell currentDay={state.activeDay}>
      <AnalyticsDashboard />
    </AppShell>
  )
}
