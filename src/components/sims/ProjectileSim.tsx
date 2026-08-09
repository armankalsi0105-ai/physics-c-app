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
import { Volume2, VolumeX } from 'lucide-react'
import {
  startSonify,
  stopSonify,
  updateSonify,
} from '@/lib/audio/kinematicsAudio'
import { useProgress } from '@/context/ProgressContext'

const G = 9.8

export function ProjectileSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [v0, setV0] = useState(20)
  const [angle, setAngle] = useState(45)
  const [tMax, setTMax] = useState(4)
  const [sonify, setSonify] = useState(false)
  const { setAudioEnabled, unlockHidden } = useProgress()

  const data = useMemo(() => {
    const rad = (angle * Math.PI) / 180
    const vx = v0 * Math.cos(rad)
    const vy0 = v0 * Math.sin(rad)
    const pts: { t: number; x: number; y: number; v: number; a: number }[] = []
    for (let t = 0; t <= tMax; t += 0.05) {
      const y = vy0 * t - 0.5 * G * t * t
      if (y < 0 && t > 0) break
      const vy = vy0 - G * t
      pts.push({
        t: +t.toFixed(2),
        x: +(vx * t).toFixed(2),
        y: +y.toFixed(2),
        v: +Math.hypot(vx, vy).toFixed(2),
        a: G,
      })
    }
    return pts
  }, [v0, angle, tMax])

  useEffect(() => {
    if (!sonify || !data.length) {
      stopSonify()
      return
    }
    let i = 0
    let cancelled = false
    void startSonify().then(() => {
      const tick = () => {
        if (cancelled) return
        const pt = data[i % data.length]
        if (pt) updateSonify({ v: pt.v, a: pt.a })
        i++
        window.setTimeout(tick, 80)
      }
      tick()
    })
    return () => {
      cancelled = true
      stopSonify()
    }
  }, [sonify, data])

  const range = useMemo(() => {
    const rad = (angle * Math.PI) / 180
    return +((v0 * v0 * Math.sin(2 * rad)) / G).toFixed(2)
  }, [v0, angle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data.length) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#1a2830'
    ctx.fillRect(0, 0, w, h)

    const maxX = Math.max(...data.map((d) => d.x), 1)
    const maxY = Math.max(...data.map((d) => d.y), 1)
    const pad = 20

    ctx.strokeStyle = '#3db8b0'
    ctx.lineWidth = 2
    ctx.beginPath()
    data.forEach((d, i) => {
      const px = pad + (d.x / maxX) * (w - 2 * pad)
      const py = h - pad - (d.y / maxY) * (h - 2 * pad)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    })
    ctx.stroke()

    ctx.fillStyle = '#e8a066'
    const last = data[data.length - 1]
    if (last) {
      const px = pad + (last.x / maxX) * (w - 2 * pad)
      const py = h - pad - (last.y / maxY) * (h - 2 * pad)
      ctx.beginPath()
      ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [data])

  return (
    <div className="sim-widget">
      <div className="sim-sliders">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            const next = !sonify
            setSonify(next)
            if (next) {
              setAudioEnabled(true)
              unlockHidden('sonifier')
            }
          }}
        >
          {sonify ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {sonify ? 'Sonify on' : 'Sonify'}
        </button>
        <label className="graph-slider">
          <span className="graph-slider__label">v₀</span>
          <input
            type="range"
            min={5}
            max={40}
            step={1}
            value={v0}
            onChange={(e) => setV0(Number(e.target.value))}
          />
          <span className="graph-slider__value">{v0} m/s</span>
        </label>
        <label className="graph-slider">
          <span className="graph-slider__label">θ</span>
          <input
            type="range"
            min={10}
            max={80}
            step={1}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
          <span className="graph-slider__value">{angle}°</span>
        </label>
      </div>
      <canvas ref={canvasRef} width={320} height={160} className="sim-canvas" />
      <p className="sim-meta">Range ≈ {range} m</p>
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
              dataKey="y"
              stroke="var(--chart-1)"
              dot={false}
              name="height (m)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
