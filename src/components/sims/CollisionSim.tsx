'use client'

import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { playCollisionClick } from '@/lib/audio/kinematicsAudio'

export function CollisionSim() {
  const [m1, setM1] = useState(2)
  const [m2, setM2] = useState(1)
  const [v1i, setV1i] = useState(3)
  const [v2i, setV2i] = useState(-1)
  const [elastic, setElastic] = useState(true)

  const { v1f, v2f } = useMemo(() => {
    if (elastic) {
      const v1f =
        ((m1 - m2) * v1i + 2 * m2 * v2i) / (m1 + m2)
      const v2f =
        ((m2 - m1) * v2i + 2 * m1 * v1i) / (m1 + m2)
      return { v1f, v2f }
    }
    const vcm = (m1 * v1i + m2 * v2i) / (m1 + m2)
    return { v1f: vcm, v2f: vcm }
  }, [m1, m2, v1i, v2i, elastic])

  const chartData = [
    { label: 'm₁ before', p: m1 * v1i },
    { label: 'm₂ before', p: m2 * v2i },
    { label: 'm₁ after', p: m1 * v1f },
    { label: 'm₂ after', p: m2 * v2f },
  ]

  const pBefore = m1 * v1i + m2 * v2i
  const pAfter = m1 * v1f + m2 * v2f

  return (
    <div className="sim-widget">
      <div className="sim-sliders">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => playCollisionClick()}
        >
          Collision click
        </button>
        <label className="graph-slider">
          <span className="graph-slider__label">m₁</span>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={m1}
            onChange={(e) => setM1(Number(e.target.value))}
          />
          <span className="graph-slider__value">{m1} kg</span>
        </label>
        <label className="graph-slider">
          <span className="graph-slider__label">m₂</span>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={m2}
            onChange={(e) => setM2(Number(e.target.value))}
          />
          <span className="graph-slider__value">{m2} kg</span>
        </label>
        <label className="graph-slider">
          <span className="graph-slider__label">v₁ᵢ</span>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={v1i}
            onChange={(e) => setV1i(Number(e.target.value))}
          />
          <span className="graph-slider__value">{v1i} m/s</span>
        </label>
        <label className="graph-slider">
          <span className="graph-slider__label">v₂ᵢ</span>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={v2i}
            onChange={(e) => setV2i(Number(e.target.value))}
          />
          <span className="graph-slider__value">{v2i} m/s</span>
        </label>
      </div>

      <div className="sim-collision">
        <div
          className="sim-collision__ball"
          style={{ ['--speed' as string]: String(Math.abs(v1i)) }}
        >
          m₁
        </div>
        <span className="sim-collision__arrow">→ ←</span>
        <div
          className="sim-collision__ball sim-collision__ball--2"
          style={{ ['--speed' as string]: String(Math.abs(v2i)) }}
        >
          m₂
        </div>
      </div>

      <label className="sim-toggle">
        <input
          type="checkbox"
          checked={elastic}
          onChange={(e) => setElastic(e.target.checked)}
        />
        Elastic collision
      </label>

      <p className="sim-meta">
        v₁f = {v1f.toFixed(2)} m/s · v₂f = {v2f.toFixed(2)} m/s · Δp ≈{' '}
        {(pAfter - pBefore).toFixed(3)} kg·m/s
      </p>

      <div className="sim-chart">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 9 }} stroke="var(--muted)" />
            <YAxis tick={{ fontSize: 10 }} stroke="var(--muted)" />
            <Tooltip
              contentStyle={{
                background: 'var(--panel)',
                border: '1px solid var(--line)',
              }}
            />
            <Bar dataKey="p" fill="var(--chart-3)" name="momentum (kg·m/s)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
