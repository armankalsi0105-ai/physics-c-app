'use client'

import { lazy, Suspense } from 'react'
import { Beaker } from 'lucide-react'

export type SimId = 'projectile' | 'inclined' | 'massspring' | 'collision'

export const DAY_SIM_MAP: Record<number, SimId[]> = {
  5: ['projectile'],
  11: ['inclined'],
  15: ['collision'],
  19: ['massspring'],
}

const ProjectileSim = lazy(() =>
  import('./ProjectileSim').then((m) => ({ default: m.ProjectileSim })),
)
const InclinedPlaneSim = lazy(() =>
  import('./InclinedPlaneSim').then((m) => ({ default: m.InclinedPlaneSim })),
)
const MassSpringSim = lazy(() =>
  import('./MassSpringSim').then((m) => ({ default: m.MassSpringSim })),
)
const CollisionSim = lazy(() =>
  import('./CollisionSim').then((m) => ({ default: m.CollisionSim })),
)

const SIM_LABEL: Record<SimId, string> = {
  projectile: 'Projectile motion',
  inclined: 'Inclined plane',
  massspring: 'Mass–spring SHM',
  collision: '1D collision',
}

function SimLoader({ id }: { id: SimId }) {
  switch (id) {
    case 'projectile':
      return <ProjectileSim />
    case 'inclined':
      return <InclinedPlaneSim />
    case 'massspring':
      return <MassSpringSim />
    case 'collision':
      return <CollisionSim />
  }
}

type Props = { day: number }

export function SandboxHost({ day }: Props) {
  const sims = DAY_SIM_MAP[day]

  if (!sims?.length) return null

  return (
    <div className="sandbox-host">
      <div className="sandbox-host__head">
        <Beaker className="h-4 w-4 text-[color:var(--accent)]" />
        <h3>Interactive sandbox</h3>
      </div>
      {sims.map((id) => (
        <div key={id} className="sandbox-panel">
          <p className="sandbox-panel__label">{SIM_LABEL[id]}</p>
          <Suspense
            fallback={
              <div className="sandbox-panel__loading">Loading simulation…</div>
            }
          >
            <SimLoader id={id} />
          </Suspense>
        </div>
      ))}
    </div>
  )
}
