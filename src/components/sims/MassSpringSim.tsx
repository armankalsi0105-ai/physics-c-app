'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function MassSpringSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [k, setK] = useState(10)
  const [mass, setMass] = useState(1)
  const [A, setA] = useState(0.3)

  const omega = Math.sqrt(k / mass)
  const period = (2 * Math.PI) / omega

  const data = useMemo(() => {
    const pts: { t: number; x: number; v: number }[] = []
    for (let t = 0; t <= period * 2; t += period / 40) {
      const x = A * Math.cos(omega * t)
      const v = -A * omega * Math.sin(omega * t)
      pts.push({ t: +t.toFixed(3), x: +x.toFixed(4), v: +v.toFixed(4) })
    }
    return pts
  }, [A, omega, period])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#1a2830'
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2
    const cy = h / 2
    const xNow = A * Math.cos(omega * 0)
    const blockX = cx + xNow * 200

    ctx.strokeStyle = '#7aa2ff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(40, cy)
    for (let i = 0; i < 12; i++) {
      ctx.lineTo(40 + ((blockX - 40) / 12) * (i + 0.5), cy + (i % 2 ? 6 : -6))
    }
    ctx.lineTo(blockX - 15, cy)
    ctx.stroke()

    ctx.fillStyle = '#3db8b0'
    ctx.fillRect(blockX - 15, cy - 15, 30, 30)
  }, [A, omega])

  return (
    <div className="sim-widget">
      <div className="sim-sliders">
        <label className="graph-slider">
          <span className="graph-slider__label">k</span>
          <input
            type="range"
            min={2}
            max={30}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
          />
          <span className="graph-slider__value">{k} N/m</span>
        </label>
        <label className="graph-slider">
          <span className="graph-slider__label">m</span>
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.1}
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
          />
          <span className="graph-slider__value">{mass} kg</span>
        </label>
        <label className="graph-slider">
          <span className="graph-slider__label">A</span>
          <input
            type="range"
            min={0.05}
            max={0.5}
            step={0.01}
            value={A}
            onChange={(e) => setA(Number(e.target.value))}
          />
          <span className="graph-slider__value">{A.toFixed(2)} m</span>
        </label>
      </div>

      <canvas ref={canvasRef} width={320} height={100} className="sim-canvas" />
      <p className="sim-meta">
        ω = {omega.toFixed(2)} rad/s · T = {period.toFixed(2)} s
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
              dataKey="x"
              stroke="var(--chart-1)"
              dot={false}
              name="x (m)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
