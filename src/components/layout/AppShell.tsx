'use client'

import { FormulaSheetDrawer } from '@/components/study/FormulaSheetDrawer'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useCallback, useEffect, useState } from 'react'

export function AppShell({
  currentDay,
  children,
}: {
  currentDay: number
  children: React.ReactNode
}) {
  const [navOpen, setNavOpen] = useState(false)
  const [formulaOpen, setFormulaOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // The syllabus is a modal drawer only below `lg`; track the breakpoint so
  // scroll lock, the focus trap, and `inert` never leak onto the desktop rail.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => {
      setIsDesktop(mq.matches)
      if (mq.matches) setNavOpen(false)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const closeNav = useCallback(() => setNavOpen(false), [])
  const closeFormulas = useCallback(() => setFormulaOpen(false), [])
  const openFormulas = useCallback(() => {
    setNavOpen(false)
    setFormulaOpen(true)
  }, [])

  return (
    <div className="relative min-h-screen text-[color:var(--ink)]">
      <div className="atmosphere" aria-hidden />
      <a href="#main-content" className="skip-link">
        Skip to lesson content
      </a>
      <Header
        currentDay={currentDay}
        navOpen={navOpen}
        onToggleNav={() => setNavOpen((o) => !o)}
        onOpenFormulas={openFormulas}
      />
      <div className="mx-auto grid max-w-7xl gap-6 px-3 py-5 sm:px-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8 lg:py-7">
        <Sidebar
          currentDay={currentDay}
          open={navOpen}
          onClose={closeNav}
          onOpenFormulas={openFormulas}
          isDesktop={isDesktop}
        />
        <main id="main-content" className="min-w-0">
          {children}
        </main>
      </div>
      <FormulaSheetDrawer open={formulaOpen} onClose={closeFormulas} />
    </div>
  )
}
