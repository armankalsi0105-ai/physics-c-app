'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadProgress, maxUnlockedDay } from '@/lib/storage'

// Client redirect so returning students land on their active day.
export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const state = loadProgress()
    const unlocked = maxUnlockedDay(state)
    const preferred = state.activeDay
    const day =
      Number.isInteger(preferred) && preferred >= 1 && preferred <= unlocked
        ? preferred
        : unlocked
    router.replace(`/day/${day}`)
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="brand-mark text-xl text-[color:var(--muted)]">Mastery C</p>
    </main>
  )
}
