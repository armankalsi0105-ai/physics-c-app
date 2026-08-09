'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Volume2, VolumeX } from 'lucide-react'
import type { GraphConfig } from '@/lib/types'
import { sampleExpression } from '@/lib/mathEval'
import {
  startSonify,
  stopSonify,
  updateSonify,
} from '@/lib/audio/kinematicsAudio'
import { useProgress } from '@/context/ProgressContext'
import { PhysicsCanvas } from './PhysicsCanvas'
import { OdeSandbox } from './OdeSandbox'

type Props = { config: GraphConfig }

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  accent = 'teal',
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (n: number) => void
  accent?: 'teal' | 'orange'
}) {
  return (
    <label className="graph-slider">
      <span className="graph-slider__label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={accent === 'orange' ? 'accent-orange-700' : 'accent-teal-700'}
      />
      <span className="graph-slider__value">{display}</span>
    </label>
  )
}

export function InteractiveGraph({ config }: Props) {
  if (config.type === 'odeSandbox') {
    return <OdeSandbox config={config as import('@/lib/types').OdeSandboxConfig} />
  }

  if (config.type === 'vector' || config.type === 'fbd') {
    return <PhysicsCanvas config={config} />
  }

  if (config.type === 'projectile') {
    return <ProjectileGraph config={config} />
  }

  if (config.type === 'drag') {
    return <DragGraph config={config} />
  }

  if (config.type === 'shm') {
    return <ShmGraph config={config} />
  }

  if (config.type === 'impulse') {
    return <ImpulseGraph config={config} />
  }

  if (config.type === 'force') {
    return <ForceGraph config={config} />
  }

  if (config.type === 'motion') {
    return <MotionGraph config={config} />
  }

  return <FunctionLikeGraph config={config} />
}

function FunctionLikeGraph({ config }: Props) {
  const [shadeTo, setShadeTo] = useState(
    config.shadeTo ?? config.domain?.[1] ?? 2,
  )
  const domain = useMemo<[number, number]>(
    () => (config.domain as [number, number] | undefined) ?? [0, 4],
    [config.domain],
  )
  const expression = String(config.expression ?? 'x')

  const data = useMemo(() => {
    if (config.points && config.points.length) {
      return config.points.map((p) => ({
        x: p.t ?? p.x ?? 0,
        y: p.y ?? p.F ?? 0,
      }))
    }
    const consts: Record<string, number> = {}
    for (const name of ['k', 'm', 'g', 'A', 'omega'] as const) {
      const v = config[name]
      if (typeof v === 'number') consts[name] = v
    }
    return sampleExpression(expression, domain, config.samples ?? 60, consts)
  }, [config, expression, domain])

  const areaData = useMemo(() => {
    if (config.type !== 'area') return data
    const from = config.shadeFrom ?? domain[0]
    return data.map((d) => ({
      ...d,
      shade: d.x >= from && d.x <= shadeTo ? d.y : 0,
    }))
  }, [config.type, config.shadeFrom, data, domain, shadeTo])

  const Chart = config.type === 'area' ? AreaChart : LineChart

  return (
    <div className="card p-4">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <p className="text-sm font-semibold text-[color:var(--ink)]">
          {config.label}
        </p>
        {config.type === 'area' && (
          <SliderRow
            label="Shade to x ="
            value={shadeTo}
            min={domain[0]}
            max={domain[1]}
            step={0.05}
            display={shadeTo.toFixed(2)}
            onChange={setShadeTo}
          />
        )}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <Chart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line-strong)" />
            <XAxis dataKey="x" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip />
            {config.type === 'area' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="shade"
                  stroke="none"
                  fill="#0f766e"
                  fillOpacity={0.25}
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  dot={false}
                />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey="y"
                stroke="#0f766e"
                strokeWidth={2.5}
                dot={config.points ? { r: 3 } : false}
              />
            )}
            <ReferenceLine y={0} stroke="var(--line-strong)" />
          </Chart>
        </ResponsiveContainer>
      </div>
      {config.expression && (
        <p className="mt-2 font-mono text-xs text-[color:var(--muted)]">
          f(x) = {String(config.expression)}
        </p>
      )}
    </div>
  )
}

function MotionGraph({ config }: Props) {
  const [v0, setV0] = useState(Number(config.v0 ?? 8))
  const [a, setA] = useState(
    typeof config.g === 'number' ? -Number(config.g) : -2,
  )
  const [sonify, setSonify] = useState(false)
  const { setAudioEnabled, unlockHidden } = useProgress()
  const tMax = Number(config.tMax ?? 6)
  const kind = config.kind ?? 'position'

  const data = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 60; i++) {
      const t = (tMax * i) / 60
      const v = v0 + a * t
      const x = v0 * t + 0.5 * a * t * t
      pts.push({
        t: Number(t.toFixed(2)),
        v: Number(v.toFixed(3)),
        a,
        y:
          kind === 'acceleration'
            ? a
            : kind === 'velocity'
              ? Number(v.toFixed(3))
              : Number(x.toFixed(3)),
      })
    }
    return pts
  }, [a, kind, tMax, v0])

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

  return (
    <div className="card p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[color:var(--ink)]">
          {config.label}
        </p>
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
      </div>
      <div className="mb-3 flex flex-wrap gap-3">
        <SliderRow
          label="v₀"
          value={v0}
          min={-10}
          max={20}
          step={0.5}
          display={`${v0.toFixed(1)}`}
          onChange={setV0}
        />
        <SliderRow
          label="a"
          value={a}
          min={-10}
          max={10}
          step={0.5}
          display={`${a.toFixed(1)}`}
          onChange={setA}
          accent="orange"
        />
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line-strong)" />
            <XAxis dataKey="t" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#0f766e"
              strokeWidth={2.5}
              dot={false}
            />
            <ReferenceLine y={0} stroke="var(--line-strong)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ForceGraph({ config }: Props) {
  const [k, setK] = useState(Number(config.k ?? 2))
  const domain = useMemo<[number, number]>(
    () => (config.domain as [number, number] | undefined) ?? [-4, 4],
    [config.domain],
  )
  const expression = String(config.expression ?? '-k*x')

  const data = useMemo(
    () => sampleExpression(expression, domain, 60, { k }),
    [domain, expression, k],
  )

  return (
    <div className="card p-4">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <p className="text-sm font-semibold text-[color:var(--ink)]">
          {config.label}
        </p>
        <SliderRow
          label="k"
          value={k}
          min={0.2}
          max={8}
          step={0.1}
          display={k.toFixed(1)}
          onChange={setK}
        />
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line-strong)" />
            <XAxis dataKey="x" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#c2410c"
              strokeWidth={2.5}
              dot={false}
            />
            <ReferenceLine y={0} stroke="var(--line-strong)" />
            <ReferenceLine x={0} stroke="var(--line-strong)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 font-mono text-xs text-[color:var(--muted)]">
        F = −kx (k = {k.toFixed(1)})
      </p>
    </div>
  )
}

function ProjectileGraph({ config }: Props) {
  const [angle, setAngle] = useState(Number(config.angle ?? 45))
  const [v0, setV0] = useState(Number(config.v0 ?? 20))
  const g = Number(config.g ?? 9.8)

  const data = useMemo(() => {
    const rad = (angle * Math.PI) / 180
    const tFlight = (2 * v0 * Math.sin(rad)) / g
    const pts = []
    for (let i = 0; i <= 50; i++) {
      const t = (tFlight * i) / 50
      const x = v0 * Math.cos(rad) * t
      const y = v0 * Math.sin(rad) * t - 0.5 * g * t * t
      if (y >= -0.01) {
        pts.push({
          x: Number(x.toFixed(2)),
          y: Number(Math.max(0, y).toFixed(2)),
        })
      }
    }
    return pts
  }, [angle, v0, g])

  const range = useMemo(() => {
    const rad = (angle * Math.PI) / 180
    return ((v0 * v0 * Math.sin(2 * rad)) / g).toFixed(1)
  }, [angle, v0, g])

  return (
    <div className="card p-4">
      <p className="mb-2 text-sm font-semibold text-[color:var(--ink)]">
        {config.label}
      </p>
      <div className="mb-3 flex flex-wrap gap-3">
        <SliderRow
          label="θ"
          value={angle}
          min={15}
          max={75}
          step={1}
          display={`${angle}°`}
          onChange={setAngle}
          accent="orange"
        />
        <SliderRow
          label="v₀"
          value={v0}
          min={5}
          max={40}
          step={0.5}
          display={`${v0.toFixed(1)} m/s`}
          onChange={setV0}
        />
      </div>
      <p className="mb-2 text-xs text-[color:var(--signal)]">
        Range R ≈ {range} m
      </p>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line-strong)" />
            <XAxis
              dataKey="x"
              tick={{ fontSize: 11 }}
              label={{ value: 'x (m)', position: 'insideBottom', offset: -2 }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              width={40}
              label={{ value: 'y (m)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#c2410c"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function DragGraph({ config }: Props) {
  const [k, setK] = useState(Number(config.k ?? 1.2))
  const [m, setM] = useState(Number(config.m ?? 1))
  const g = Number(config.g ?? 9.8)
  const tMax = Number(config.tMax ?? 12)
  const vTerm = (m * g) / k

  const data = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 60; i++) {
      const t = (tMax * i) / 60
      const v = vTerm * (1 - Math.exp(-(k * t) / m))
      pts.push({ t: Number(t.toFixed(2)), v: Number(v.toFixed(3)), vTerm })
    }
    return pts
  }, [k, m, tMax, vTerm])

  return (
    <div className="card p-4">
      <p className="mb-2 text-sm font-semibold text-[color:var(--ink)]">
        {config.label}
      </p>
      <div className="mb-3 flex flex-wrap gap-3">
        <SliderRow
          label="k"
          value={k}
          min={0.2}
          max={4}
          step={0.05}
          display={k.toFixed(2)}
          onChange={setK}
        />
        <SliderRow
          label="m"
          value={m}
          min={0.2}
          max={5}
          step={0.1}
          display={`${m.toFixed(1)} kg`}
          onChange={setM}
          accent="orange"
        />
      </div>
      <p className="mb-2 text-xs text-[color:var(--signal)]">
        Terminal velocity v<sub>t</sub> = mg/k = {vTerm.toFixed(2)} m/s
      </p>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line-strong)" />
            <XAxis dataKey="t" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip />
            <ReferenceLine y={vTerm} stroke="#c2410c" strokeDasharray="6 4" />
            <Line
              type="monotone"
              dataKey="v"
              stroke="#0f766e"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ShmGraph({ config }: Props) {
  const [omega, setOmega] = useState(Number(config.omega ?? 2))
  const [A, setA] = useState(Number(config.A ?? 1))
  const [k, setK] = useState(Number(config.k ?? 4))
  const [m, setM] = useState(Number(config.m ?? 1))
  const tMax = Number(config.tMax ?? 6)
  const linkedOmega = Math.sqrt(k / m)

  const data = useMemo(() => {
    const w = config.k != null || config.m != null ? linkedOmega : omega
    const pts = []
    for (let i = 0; i <= 80; i++) {
      const t = (tMax * i) / 80
      pts.push({
        t: Number(t.toFixed(2)),
        x: Number((A * Math.cos(w * t)).toFixed(3)),
      })
    }
    return pts
  }, [A, config.k, config.m, linkedOmega, omega, tMax])

  return (
    <div className="card p-4">
      <p className="mb-2 text-sm font-semibold text-[color:var(--ink)]">
        {config.label}
      </p>
      <div className="mb-3 flex flex-wrap gap-3">
        <SliderRow
          label="A"
          value={A}
          min={0.2}
          max={3}
          step={0.1}
          display={A.toFixed(1)}
          onChange={setA}
        />
        {config.k != null || config.m != null ? (
          <>
            <SliderRow
              label="k"
              value={k}
              min={0.5}
              max={20}
              step={0.5}
              display={k.toFixed(1)}
              onChange={setK}
            />
            <SliderRow
              label="m"
              value={m}
              min={0.2}
              max={5}
              step={0.1}
              display={m.toFixed(1)}
              onChange={setM}
              accent="orange"
            />
          </>
        ) : (
          <SliderRow
            label="ω"
            value={omega}
            min={0.5}
            max={5}
            step={0.1}
            display={omega.toFixed(1)}
            onChange={setOmega}
          />
        )}
      </div>
      {(config.k != null || config.m != null) && (
        <p className="mb-2 text-xs text-[color:var(--muted)]">
          ω = √(k/m) = {linkedOmega.toFixed(2)} rad/s
        </p>
      )}
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line-strong)" />
            <XAxis dataKey="t" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="x"
              stroke="#0f766e"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ImpulseGraph({ config }: Props) {
  const [peak, setPeak] = useState(20)
  const basePoints = config.points
  const data = useMemo(() => {
    const base = (basePoints ?? []).map((p) => ({
      t: p.t ?? 0,
      F: p.F ?? p.y ?? 0,
    }))
    if (!base.length) {
      return [
        { t: 0, F: 0 },
        { t: 0.5, F: peak },
        { t: 1, F: 0 },
      ]
    }
    const maxF = Math.max(...base.map((p) => p.F), 1)
    return base.map((p) => ({
      t: p.t,
      F: Number(((p.F / maxF) * peak).toFixed(2)),
    }))
  }, [basePoints, peak])

  const impulse = useMemo(() => {
    let area = 0
    for (let i = 1; i < data.length; i++) {
      area += 0.5 * (data[i].F + data[i - 1].F) * (data[i].t - data[i - 1].t)
    }
    return area
  }, [data])

  return (
    <div className="card p-4">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <p className="text-sm font-semibold text-[color:var(--ink)]">
          {config.label}
        </p>
        <SliderRow
          label="F_max"
          value={peak}
          min={5}
          max={50}
          step={1}
          display={`${peak} N`}
          onChange={setPeak}
          accent="orange"
        />
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line-strong)" />
            <XAxis dataKey="t" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="F"
              stroke="#c2410c"
              fill="#c2410c"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-[color:var(--muted)]">
        Shaded area ≈ impulse J = ∫ F dt ≈ {impulse.toFixed(2)} N·s
      </p>
    </div>
  )
}
