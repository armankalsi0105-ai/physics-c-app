/**
 * A small interruptible spring.
 *
 * CSS transitions cannot be grabbed mid-flight: they interpolate to a fixed
 * target over a fixed duration, so a half-open drawer the user grabs again
 * has to finish before it can respond. A spring integrates from wherever the
 * value currently *is*, at whatever velocity it currently has, which is what
 * makes interruption and gesture hand-off possible at all.
 *
 * Parameters follow Apple's two-knob model rather than mass/stiffness/damping:
 *   - `response` — roughly how long the value takes to reach the target (s)
 *   - `damping`  — 1 settles without overshoot; below 1 bounces
 */

export type SpringOptions = {
  /** Seconds to approach the target. Lower is snappier. */
  response?: number
  /** 1 = critically damped. ~0.8 gives a little overshoot. */
  damping?: number
  /** Starting velocity in px/s — hand the release velocity in here. */
  velocity?: number
  onUpdate: (value: number) => void
  onRest?: () => void
}

export type SpringHandle = {
  /** Re-target without losing the current value or velocity. */
  setTarget: (target: number) => void
  /** Stop and report where the motion actually got to. */
  stop: () => { value: number; velocity: number }
  readonly value: number
  readonly velocity: number
}

const MAX_STEP = 1 / 60

export function spring(
  from: number,
  to: number,
  opts: SpringOptions,
): SpringHandle {
  const { response = 0.3, damping = 1, onUpdate, onRest } = opts

  const omega = (2 * Math.PI) / response
  const k = omega * omega
  const c = 2 * damping * omega

  let value = from
  let velocity = opts.velocity ?? 0
  let target = to
  let raf = 0
  let last = 0
  let stopped = false

  const step = (now: number) => {
    if (stopped) return
    // Clamp dt so a backgrounded tab cannot fling the value on resume.
    let dt = last ? Math.min((now - last) / 1000, 0.064) : MAX_STEP
    last = now

    // Sub-step for stability when a frame runs long.
    while (dt > 0) {
      const h = Math.min(dt, MAX_STEP)
      const accel = -k * (value - target) - c * velocity
      velocity += accel * h
      value += velocity * h
      dt -= h
    }

    onUpdate(value)

    if (Math.abs(value - target) < 0.35 && Math.abs(velocity) < 0.35) {
      value = target
      velocity = 0
      onUpdate(value)
      stopped = true
      onRest?.()
      return
    }
    raf = requestAnimationFrame(step)
  }

  raf = requestAnimationFrame(step)

  return {
    setTarget(next) {
      target = next
      if (stopped) {
        stopped = false
        last = 0
        raf = requestAnimationFrame(step)
      }
    },
    stop() {
      stopped = true
      cancelAnimationFrame(raf)
      return { value, velocity }
    },
    get value() {
      return value
    },
    get velocity() {
      return velocity
    },
  }
}

/**
 * Where a flick would come to rest, using the exponential-decay model that
 * matches native scroll deceleration. The textbook v²/2a lands short and
 * makes flicks feel like they were caught.
 */
export function projectMomentum(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

/**
 * Progressive resistance past a boundary. A hard stop reads as frozen; this
 * keeps following the finger while making it clear there is nothing more.
 */
export function rubberband(
  overshoot: number,
  dimension: number,
  constant = 0.55,
) {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  )
}
