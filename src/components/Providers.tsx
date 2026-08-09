'use client'

import { ProgressProvider } from '@/context/ProgressContext'
import { FormulaExplorerProvider } from '@/context/FormulaExplorerContext'
import { AppErrorBoundary } from '@/components/ErrorBoundary'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppErrorBoundary>
      <ProgressProvider>
        <FormulaExplorerProvider>{children}</FormulaExplorerProvider>
      </ProgressProvider>
    </AppErrorBoundary>
  )
}
