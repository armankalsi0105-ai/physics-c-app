import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { DayGate } from '@/components/day/DayGate'
import { DayView } from '@/components/day/DayView'
import { getDay } from '@/lib/curriculum'

type Props = {
  params: Promise<{ day: string }>
}

export function generateStaticParams() {
  return Array.from({ length: 20 }, (_, i) => ({ day: String(i + 1) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { day: dayParam } = await params
  const day = getDay(Number(dayParam))
  if (!day) return { title: 'Mastery C' }
  return {
    title: `Day ${day.day}: ${day.title} — Mastery C`,
    description: day.overview,
  }
}

export default async function DayPage({ params }: Props) {
  const { day: dayParam } = await params
  const dayNum = Number(dayParam)
  const day = getDay(dayNum)
  if (!day || !Number.isInteger(dayNum) || dayNum < 1 || dayNum > 20) {
    notFound()
  }

  return (
    <AppShell currentDay={day.day}>
      <DayGate day={day.day}>
        <DayView day={day} />
      </DayGate>
    </AppShell>
  )
}
