'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { GraphConfig } from '@/lib/types'
import { useProgress } from '@/context/ProgressContext'

type ForceKey = 'gravity' | 'normal' | 'friction' | 'tension'

const FORCE_META: Record<
  ForceKey,
  { label: string; angleDeg: number; color: string; defaultMag: number }
> = {
  gravity: { label: 'mg', angleDeg: 270, color: '#0369a1', defaultMag: 10 },
  normal: { label: 'N', angleDeg: 90, color: '#0f766e', defaultMag: 10 },
  friction: { label: 'f', angleDeg: 180, color: '#c2410c', defaultMag: 4 },
  tension: { label: 'T', angleDeg: 0, color: '#a34b12', defaultMag: 6 },
}

function inferForceKey(name: string): ForceKey | null {
  const n = name.toLowerCase()
  if (n.includes('grav') || n === 'mg' || n.includes('weight') || n === 'w') {
    return 'gravity'
  }
  if (n.includes('normal') || n === 'n') return 'normal'
  if (n.includes('fric') || n.startsWith('f') || n.includes('μ')) return 'friction'
  if (n.includes('tens') || n === 't') return 'tension'
  return null
}

export function PhysicsCanvas({ config }: { config: GraphConfig }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { state } = useProgress()
  const isDark = state.theme === 'dark'

  const defaultForces = useMemo(() => {
    const fromConfig = config.forces ?? []
    const enabled: Record<ForceKey, boolean> = {
      gravity: true,
      normal: true,
      friction: false,
      tension: false,
    }
    const mags: Record<ForceKey, number> = {
      gravity: FORCE_META.gravity.defaultMag,
      normal: FORCE_META.normal.defaultMag,
      friction: FORCE_META.friction.defaultMag,
      tension: FORCE_META.tension.defaultMag,
    }
    if (fromConfig.length) {
      ;(Object.keys(enabled) as ForceKey[]).forEach((k) => {
        enabled[k] = false
      })
      fromConfig.forEach((f) => {
        const key = inferForceKey(f.name)
        if (key) {
          enabled[key] = true
          mags[key] = f.magnitude
        }
      })
    }
    return { enabled, mags }
  }, [config.forces])

  const [enabled, setEnabled] = useState(defaultForces.enabled)
  const [mags] = useState(defaultForces.mags)
  const [showAccel, setShowAccel] = useState(true)

  // Reset the toggles when the caller swaps in a different force set. Adjusting
  // during render (rather than in an effect) avoids a wasted pass with the old
  // forces still drawn. https://react.dev/learn/you-might-not-need-an-effect
  const [lastForces, setLastForces] = useState(defaultForces)
  if (lastForces !== defaultForces) {
    setLastForces(defaultForces)
    setEnabled(defaultForces.enabled)
  }

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = 300
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const bg = isDark ? '#1a2330' : '#f8fafc'
    const axis = isDark ? '#64748b' : '#94a3b8'
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    const cx = width / 2
    const cy = height / 2 + 10

    ctx.strokeStyle = axis
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(24, cy)
    ctx.lineTo(width - 24, cy)
    ctx.moveTo(cx, 24)
    ctx.lineTo(cx, height - 24)
    ctx.stroke()

    if (config.type === 'vector') {
      const vectors = config.vectors ?? []
      const scale = 40
      vectors.forEach((v, i) => {
        const color = v.color || (i === 0 ? '#0f766e' : '#c2410c')
        drawArrow(ctx, cx, cy, cx + v.x * scale, cy - v.y * scale, color)
        ctx.fillStyle = color
        ctx.font = '12px Outfit, sans-serif'
        ctx.fillText(v.label, cx + v.x * scale + 6, cy - v.y * scale - 6)
      })
      return
    }

    // FBD block
    ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a'
    ctx.fillRect(cx - 28, cy - 28, 56, 56)
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc'
    ctx.font = 'bold 12px Fraunces, serif'
    ctx.fillText('m', cx - 6, cy + 4)

    // Surface line under block for normal/friction context
    ctx.strokeStyle = axis
    ctx.beginPath()
    ctx.moveTo(cx - 90, cy + 28)
    ctx.lineTo(cx + 90, cy + 28)
    ctx.stroke()

    let netFx = 0
    let netFy = 0

    ;(Object.keys(FORCE_META) as ForceKey[]).forEach((key) => {
      if (!enabled[key]) return
      const meta = FORCE_META[key]
      const mag = mags[key]
      const rad = (meta.angleDeg * Math.PI) / 180
      // Canvas y grows down; physics angles: 0 = +x, 90 = +y up
      const fx = mag * Math.cos(rad)
      const fy = mag * Math.sin(rad)
      netFx += fx
      netFy += fy

      const len = 28 + mag * 5
      const x2 = cx + Math.cos(rad) * len
      const y2 = cy - Math.sin(rad) * len
      drawArrow(ctx, cx, cy, x2, y2, meta.color)
      ctx.fillStyle = meta.color
      ctx.font = '12px Outfit, sans-serif'
      ctx.fillText(meta.label, x2 + 4, y2)
    })

    if (showAccel) {
      const mass = Number(config.m ?? 1) || 1
      const ax = netFx / mass
      const ay = netFy / mass
      const aScale = 8
      const x2 = cx + ax * aScale
      const y2 = cy - ay * aScale
      if (Math.hypot(ax, ay) > 0.05) {
        drawArrow(ctx, cx, cy, x2, y2, '#7c3aed', true)
        ctx.fillStyle = '#7c3aed'
        ctx.font = '12px Outfit, sans-serif'
        ctx.fillText(
          `a (${ax.toFixed(1)}, ${ay.toFixed(1)})`,
          x2 + 6,
          y2 - 4,
        )
      } else {
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b'
        ctx.font = '12px Outfit, sans-serif'
        ctx.fillText('a = 0 (equilibrium)', cx - 52, cy + 56)
      }
    }
  }, [config, enabled, mags, showAccel, isDark])

  if (config.type === 'vector') {
    return (
      <div className="card p-4">
        <p className="mb-2 text-sm font-semibold text-[color:var(--ink)]">
          {config.label}
        </p>
        <canvas ref={ref} className="h-[300px] w-full rounded-md" />
      </div>
    )
  }

  return (
    <div className="card p-4">
      <p className="mb-2 text-sm font-semibold text-[color:var(--ink)]">
        {config.label}
      </p>
      <p className="mb-3 text-xs text-[color:var(--muted)]">
        Toggle forces to rebuild the free-body diagram. Acceleration updates from
        ΣF = ma.
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(FORCE_META) as ForceKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() =>
              setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            className={`force-toggle ${enabled[key] ? 'is-on' : ''}`}
            style={
              {
                '--force-color': FORCE_META[key].color,
              } as React.CSSProperties
            }
            aria-pressed={enabled[key]}
          >
            {FORCE_META[key].label}
            <span className="force-toggle__name">
              {key === 'gravity'
                ? 'Gravity'
                : key === 'normal'
                  ? 'Normal'
                  : key === 'friction'
                    ? 'Friction'
                    : 'Tension'}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowAccel((v) => !v)}
          className={`force-toggle ${showAccel ? 'is-on' : ''}`}
          style={{ '--force-color': '#7c3aed' } as React.CSSProperties}
          aria-pressed={showAccel}
        >
          a
          <span className="force-toggle__name">Acceleration</span>
        </button>
      </div>
      <canvas ref={ref} className="h-[300px] w-full rounded-md" />
    </div>
  )
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  dashed = false,
) {
  const head = 10
  const angle = Math.atan2(y2 - y1, x2 - x1)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2.5
  if (dashed) ctx.setLineDash([5, 4])
  else ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(
    x2 - head * Math.cos(angle - Math.PI / 6),
    y2 - head * Math.sin(angle - Math.PI / 6),
  )
  ctx.lineTo(
    x2 - head * Math.cos(angle + Math.PI / 6),
    y2 - head * Math.sin(angle + Math.PI / 6),
  )
  ctx.closePath()
  ctx.fill()
}
