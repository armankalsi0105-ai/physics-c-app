'use client'

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const G = 9.8

export function InclinedPlaneSim() {
  const [angle, setAngle] = useState(30)
  const [mass, setMass] = useState(2)
  const [mu, setMu] = useState(0.1)

  const rad = (angle * Math.PI) / 180
  const a = G * (Math.sin(rad) - mu * Math.cos(rad))
  const N = mass * G * Math.cos(rad)

  const data = useMemo(() => {
    const pts: { t: number; v: number; x: number }[] = []
    for (let t = 0; t <= 5; t += 0.1) {
      const v = a * t
      const x = 0.5 * a * t * t
      pts.push({ t: +t.toFixed(1), v: +v.toFixed(2), x: +x.toFixed(2) })
    }
    return pts
  }, [a])

  return (
    <div className="sim-widget">
      <div className="sim-sliders">
        <label className="graph-slider">
          <span className="graph-slider__label">θ</span>
          <input
            type="range"
            min={5}
            max={60}
            step={1}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
          <span className="graph-slider__value">{angle}°</span>
        </label>
        <label className="graph-slider">
          <span className="graph-slider__label">m</span>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.5}
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
          />
          <span className="graph-slider__value">{mass} kg</span>
        </label>
        <label className="graph-slider">
          <span className="graph-slider__label">μ</span>
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.01}
            value={mu}
            onChange={(e) => setMu(Number(e.target.value))}
          />
          <span className="graph-slider__value">{mu.toFixed(2)}</span>
        </label>
      </div>

      <div className="sim-incline" style={{ ['--incline-angle' as string]: `${angle}deg` }}>
        <div className="sim-incline__plane" />
        <div className="sim-incline__block" />
      </div>

      <p className="sim-meta">
        a = {a.toFixed(2)} m/s² · N = {N.toFixed(1)} N
      </p>

      <div className="sim-chart">
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={data}>
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
            <XAxis dataKey="t" tick={{ fontSize: 10 }} stroke="var(--muted)" />
            <YAxis tick={{ fontSize: 10 }} stroke="var(--muted)" />
            <Tooltip
              contentStyle={{
                background: 'var(--panel)',
                border: '1px solid var(--line)',
              }}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke="var(--chart-2)"
              dot={false}
              name="velocity (m/s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
