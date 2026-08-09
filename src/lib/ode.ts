/** 1D ODE helpers for the numerical-methods sandbox. */

export type State1D = { t: number; x: number; v: number }

export function eulerStep(
  s: State1D,
  dt: number,
  accel: (x: number, v: number, t: number) => number,
): State1D {
  const a = accel(s.x, s.v, s.t)
  return { t: s.t + dt, x: s.x + s.v * dt, v: s.v + a * dt }
}

/** Semi-implicit Euler (symplectic): update v first, then x with new v. */
export function semiImplicitEulerStep(
  s: State1D,
  dt: number,
  accel: (x: number, v: number, t: number) => number,
): State1D {
  const a = accel(s.x, s.v, s.t)
  const v = s.v + a * dt
  const x = s.x + v * dt
  return { t: s.t + dt, x, v }
}

export function sampleTrajectory(
  s0: State1D,
  dt: number,
  tMax: number,
  accel: (x: number, v: number, t: number) => number,
  step: typeof eulerStep = eulerStep,
): State1D[] {
  const pts: State1D[] = [{ ...s0 }]
  let s = s0
  const guard = Math.ceil(tMax / Math.max(dt, 1e-6)) + 2
  for (let i = 0; i < guard && s.t < tMax - 1e-12; i++) {
    s = step(s, dt, accel)
    pts.push(s)
  }
  return pts
}

export function accelForModel(
  model: 'linearDrag' | 'quadraticDrag' | 'shm' | 'constantForce',
  p: {
    m?: number
    b?: number
    k?: number
    g?: number
    omega?: number
    F?: number
  },
): (x: number, v: number, t: number) => number {
  const m = p.m ?? 1
  const g = p.g ?? 9.8
  if (model === 'constantForce') {
    const F = p.F ?? 10
    return () => F / m
  }
  if (model === 'linearDrag') {
    const b = p.b ?? 1
    return (_x, v) => g - (b / m) * v
  }
  if (model === 'quadraticDrag') {
    const k = p.k ?? 0.2
    return (_x, v) => g - (k / m) * v * Math.abs(v)
  }
  // shm
  const omega = p.omega ?? Math.sqrt((p.k ?? 4) / m)
  return (x) => -omega * omega * x
}

export function exactSeries(
  model: 'linearDrag' | 'quadraticDrag' | 'shm' | 'constantForce',
  p: {
    m?: number
    b?: number
    k?: number
    g?: number
    omega?: number
    F?: number
    v0?: number
    x0?: number
    tMax?: number
  },
  samples = 80,
): { t: number; y: number }[] {
  const tMax = p.tMax ?? 8
  const pts: { t: number; y: number }[] = []
  const m = p.m ?? 1
  const g = p.g ?? 9.8
  const v0 = p.v0 ?? 0
  const x0 = p.x0 ?? 0

  for (let i = 0; i <= samples; i++) {
    const t = (tMax * i) / samples
    let y = 0
    if (model === 'constantForce') {
      const a = (p.F ?? 10) / m
      y = v0 + a * t
    } else if (model === 'linearDrag') {
      const b = p.b ?? 1
      const vt = (m * g) / b
      y = vt + (v0 - vt) * Math.exp(-(b / m) * t)
    } else if (model === 'shm') {
      const omega = p.omega ?? Math.sqrt((p.k ?? 4) / m)
      y = x0 * Math.cos(omega * t) + (v0 / omega) * Math.sin(omega * t)
    } else {
      // no simple closed form for quadratic — skip
      continue
    }
    pts.push({ t: Number(t.toFixed(3)), y: Number(y.toFixed(4)) })
  }
  return pts
}
