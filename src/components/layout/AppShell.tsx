'use client'

import { FormulaSheetDrawer } from '@/components/study/FormulaSheetDrawer'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useState } from 'react'

export function AppShell({
  currentDay,
  children,
}: {
  currentDay: number
  children: React.ReactNode
}) {
  const [navOpen, setNavOpen] = useState(false)
  const [formulaOpen, setFormulaOpen] = useState(false)

  return (
    <div className="relative min-h-screen text-[color:var(--ink)]">
      <div className="atmosphere" aria-hidden />
      <Header
        currentDay={currentDay}
        onToggleNav={() => setNavOpen((o) => !o)}
        onOpenFormulas={() => setFormulaOpen(true)}
      />
      <div className="mx-auto grid max-w-7xl gap-6 px-3 py-5 sm:px-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8 lg:py-7">
        <Sidebar
          currentDay={currentDay}
          open={navOpen}
          onClose={() => setNavOpen(false)}
        />
        <main className="min-w-0">{children}</main>
      </div>
      <FormulaSheetDrawer
        open={formulaOpen}
        onClose={() => setFormulaOpen(false)}
      />
    </div>
  )
}
