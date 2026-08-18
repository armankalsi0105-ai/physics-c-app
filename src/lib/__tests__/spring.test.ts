import { beforeEach, describe, expect, it, vi } from 'vitest'
import { projectMomentum, rubberband, spring } from '../spring'

/** Drives requestAnimationFrame manually so the spring can be stepped. */
function useFakeRaf() {
  let now = 0
  const queue: FrameRequestCallback[] = []
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    queue.push(cb)
    return queue.length
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
  return {
    /** Advance one 16ms frame. */
    frame() {
      now += 16
      const due = queue.splice(0, queue.length)
      due.forEach((cb) => cb(now))
    },
    run(frames: number) {
      for (let i = 0; i < frames; i++) this.frame()
    },
    get pending() {
      return queue.length
    },
  }
}

describe('spring', () => {
  beforeEach(() => vi.unstubAllGlobals())

  it('settles exactly on the target and stops', () => {
    const raf = useFakeRaf()
    const seen: number[] = []
    const onRest = vi.fn()
    spring(0, 100, { response: 0.3, damping: 1, onUpdate: (v) => seen.push(v), onRest })

    raf.run(120)

    expect(onRest).toHaveBeenCalledTimes(1)
    expect(seen.at(-1)).toBe(100)
    // Nothing left scheduled once it has rested.
    expect(raf.pending).toBe(0)
  })

  it('is critically damped at damping 1 — it never overshoots', () => {
    const raf = useFakeRaf()
    const seen: number[] = []
    spring(0, 100, { response: 0.3, damping: 1, onUpdate: (v) => seen.push(v) })
    raf.run(120)

    expect(Math.max(...seen)).toBeLessThanOrEqual(100.0001)
  })

  it('overshoots below damping 1, which is what makes a flick feel physical', () => {
    const raf = useFakeRaf()
    const seen: number[] = []
    spring(0, 100, { response: 0.3, damping: 0.6, onUpdate: (v) => seen.push(v) })
    raf.run(120)

    expect(Math.max(...seen)).toBeGreaterThan(100)
    expect(seen.at(-1)).toBe(100)
  })

  it('carries release velocity, so a flick travels further early on', () => {
    const raf = useFakeRaf()
    const slow: number[] = []
    const fast: number[] = []
    spring(0, 100, { response: 0.4, damping: 1, onUpdate: (v) => slow.push(v) })
    raf.run(3)
    vi.unstubAllGlobals()

    const raf2 = useFakeRaf()
    spring(0, 100, {
      response: 0.4,
      damping: 1,
      velocity: 800,
      onUpdate: (v) => fast.push(v),
    })
    raf2.run(3)

    expect(fast[2]).toBeGreaterThan(slow[2])
  })

  it('re-targets from the current value instead of restarting', () => {
    const raf = useFakeRaf()
    const seen: number[] = []
    const handle = spring(0, 100, {
      response: 0.3,
      damping: 1,
      onUpdate: (v) => seen.push(v),
    })
    raf.run(4)
    const midFlight = handle.value
    expect(midFlight).toBeGreaterThan(0)
    expect(midFlight).toBeLessThan(100)

    handle.setTarget(0)
    raf.frame()

    // The next painted value continues from where it was, with no jump back.
    const afterRetarget = seen.at(-1) as number
    expect(Math.abs(afterRetarget - midFlight)).toBeLessThan(midFlight)
  })

  it('reports where it was when stopped, so a grab can take over', () => {
    const raf = useFakeRaf()
    const handle = spring(0, 100, { response: 0.3, damping: 1, onUpdate: () => {} })
    raf.run(5)
    const { value, velocity } = handle.stop()

    expect(value).toBeGreaterThan(0)
    expect(value).toBeLessThan(100)
    expect(velocity).toBeGreaterThan(0)
  })
})

describe('projectMomentum', () => {
  it('projects further the faster the flick', () => {
    expect(projectMomentum(1200)).toBeGreaterThan(projectMomentum(400))
  })

  it('keeps the sign of the gesture', () => {
    expect(projectMomentum(-800)).toBeLessThan(0)
  })

  it('projects nothing when the finger stopped', () => {
    expect(projectMomentum(0)).toBe(0)
  })

  it('uses exponential decay, not v^2/2a — a 500px/s flick carries ~250px', () => {
    expect(projectMomentum(500)).toBeCloseTo(249.5, 0)
  })
})

describe('rubberband', () => {
  it('resists: the output is always less than the raw overshoot', () => {
    expect(rubberband(100, 320)).toBeLessThan(100)
  })

  it('resists progressively — further past the edge gives diminishing travel', () => {
    const first = rubberband(50, 320)
    const second = rubberband(100, 320)
    expect(second - first).toBeLessThan(first)
  })

  it('does nothing at the boundary itself', () => {
    expect(rubberband(0, 320)).toBe(0)
  })
})
