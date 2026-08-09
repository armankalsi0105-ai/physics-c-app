'use client'

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { GraphConfig, OdeSandboxConfig } from '@/lib/types'
import {
  accelForModel,
  eulerStep,
  exactSeries,
  sampleTrajectory,
  semiImplicitEulerStep,
} from '@/lib/ode'
import { useProgress } from '@/context/ProgressContext'

export function OdeSandbox({ config }: { config: OdeSandboxConfig | GraphConfig }) {
  const cfg = config as OdeSandboxConfig
  const { state, setSandboxDt } = useProgress()
  const sandboxId = cfg.label
  const saved = state.sandboxPrefs[sandboxId]?.dt
  const [dt, setDt] = useState(saved ?? cfg.dt.default)
  const [m, setM] = useState(cfg.params.m ?? 1)
  const [b, setB] = useState(cfg.params.b ?? 1.2)
  const [omega, setOmega] = useState(cfg.params.omega ?? 2)
  const [F, setF] = useState(cfg.params.F ?? 10)
  const [compare, setCompare] = useState(Boolean(cfg.compareExact))
  const tMax = cfg.params.tMax ?? 8
  const v0 = cfg.params.v0 ?? 0
  const x0 = cfg.params.x0 ?? (cfg.model === 'shm' ? 1 : 0)

  const plotY = cfg.model === 'shm' ? 'x' : 'v'

  const data = useMemo(() => {
    const params = { m, b, omega, F, g: cfg.params.g ?? 9.8, v0, x0, tMax }
    const accel = accelForModel(cfg.model, params)
    const step =
      cfg.integrator === 'semiImplicitEuler'
        ? semiImplicitEulerStep
        : eulerStep
    const traj = sampleTrajectory(
      { t: 0, x: x0, v: v0 },
      dt,
      tMax,
      accel,
      step,
    )
    const approx = traj.map((s) => ({
      t: Number(s.t.toFixed(3)),
      approx: Number((plotY === 'x' ? s.x : s.v).toFixed(4)),
    }))

    if (!compare || cfg.model === 'quadraticDrag') return approx

    const exact = exactSeries(cfg.model, params)
    return approx.map((p) => {
      let best = exact[0]?.y ?? 0
      let bestD = Infinity
      for (const e of exact) {
        const d = Math.abs(e.t - p.t)
        if (d < bestD) {
          bestD = d
          best = e.y
        }
      }
      return { ...p, exact: best }
    })
  }, [
    b,
    compare,
    cfg.integrator,
    cfg.model,
    cfg.params.g,
    dt,
    F,
    m,
    omega,
    plotY,
    tMax,
    v0,
    x0,
  ])

  const onDt = (value: number) => {
    setDt(value)
    setSandboxDt(sandboxId, value)
  }

  const vTerm =
    cfg.model === 'linearDrag' ? ((m * (cfg.params.g ?? 9.8)) / b) : null

  return (
    <div className="card p-4">
      <p className="mb-1 text-sm font-semibold text-[color:var(--ink)]">
        {cfg.label}
      </p>
      <p className="mb-3 text-xs text-[color:var(--muted)]">
        Drag the time step <span className="font-mono">dt</span>. Larger steps
        make Euler&apos;s method drift from the true solution.
      </p>

      <div className="mb-3 flex flex-wrap gap-3">
        <label className="graph-slider">
          <span className="graph-slider__label">dt</span>
          <input
            type="range"
            min={cfg.dt.min}
            max={cfg.dt.max}
            step={cfg.dt.step}
            value={dt}
            onChange={(e) => onDt(Number(e.target.value))}
            className="accent-teal-700"
          />
          <span className="graph-slider__value">{dt.toFixed(2)} s</span>
        </label>

        {cfg.model === 'linearDrag' && (
          <>
            <label className="graph-slider">
              <span className="graph-slider__label">m</span>
              <input
                type="range"
                min={0.2}
                max={5}
                step={0.1}
                value={m}
                onChange={(e) => setM(Number(e.target.value))}
                className="accent-teal-700"
              />
              <span className="graph-slider__value">{m.toFixed(1)}</span>
            </label>
            <label className="graph-slider">
              <span className="graph-slider__label">b</span>
              <input
                type="range"
                min={0.2}
                max={4}
                step={0.05}
                value={b}
                onChange={(e) => setB(Number(e.target.value))}
                className="accent-orange-700"
              />
              <span className="graph-slider__value">{b.toFixed(2)}</span>
            </label>
          </>
        )}

        {cfg.model === 'constantForce' && (
          <>
            <label className="graph-slider">
              <span className="graph-slider__label">m</span>
              <input
                type="range"
                min={0.5}
                max={8}
                step={0.1}
                value={m}
                onChange={(e) => setM(Number(e.target.value))}
                className="accent-teal-700"
              />
              <span className="graph-slider__value">{m.toFixed(1)}</span>
            </label>
            <label className="graph-slider">
              <span className="graph-slider__label">F</span>
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={F}
                onChange={(e) => setF(Number(e.target.value))}
                className="accent-orange-700"
              />
              <span className="graph-slider__value">{F.toFixed(0)} N</span>
            </label>
          </>
        )}

        {cfg.model === 'shm' && (
          <label className="graph-slider">
            <span className="graph-slider__label">ω</span>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.1}
              value={omega}
              onChange={(e) => setOmega(Number(e.target.value))}
              className="accent-teal-700"
            />
            <span className="graph-slider__value">{omega.toFixed(1)}</span>
          </label>
        )}

        {cfg.compareExact && cfg.model !== 'quadraticDrag' && (
          <label className="graph-slider" style={{ gap: '0.35rem' }}>
            <input
              type="checkbox"
              checked={compare}
              onChange={(e) => setCompare(e.target.checked)}
              className="accent-teal-700"
            />
            <span className="graph-slider__label">Show exact</span>
          </label>
        )}
      </div>

      {vTerm != null && (
        <p className="mb-2 text-xs text-[color:var(--signal)]">
          Exact terminal speed v<sub>t</sub> = mg/b ≈ {vTerm.toFixed(2)} m/s
        </p>
      )}

      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line-strong)" />
            <XAxis dataKey="t" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={44} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="approx"
              name={`Euler ${plotY}(t)`}
              stroke="#0f766e"
              strokeWidth={2.5}
              dot={false}
            />
            {compare && (
              <Line
                type="monotone"
                dataKey="exact"
                name={`Exact ${plotY}(t)`}
                stroke="#c2410c"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
              />
            )}
            {vTerm != null && (
              <ReferenceLine y={vTerm} stroke="#c2410c" strokeDasharray="4 4" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
