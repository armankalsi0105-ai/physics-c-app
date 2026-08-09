/**
 * Web Audio sonification of kinematics quantities.
 * Velocity → pitch, acceleration → gain, jerk → vibrato, collision → click.
 */

export type KinematicsSample = {
  v: number
  a: number
  jerk?: number
}

let ctx: AudioContext | null = null
let osc: OscillatorNode | null = null
let gain: GainNode | null = null
let lfo: OscillatorNode | null = null
let lfoGain: GainNode | null = null
let running = false

function ensure() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    ctx = new AC()
  }
  return ctx
}

export function isSonifying() {
  return running
}

export async function startSonify() {
  const c = ensure()
  if (!c || running) return
  if (c.state === 'suspended') await c.resume()
  gain = c.createGain()
  gain.gain.value = 0.0001
  gain.connect(c.destination)

  osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = 220

  lfo = c.createOscillator()
  lfo.frequency.value = 5
  lfoGain = c.createGain()
  lfoGain.gain.value = 0
  lfo.connect(lfoGain)
  lfoGain.connect(osc.frequency)

  osc.connect(gain)
  osc.start()
  lfo.start()
  running = true
}

export function stopSonify() {
  try {
    osc?.stop()
    lfo?.stop()
  } catch {
    /* already stopped */
  }
  osc?.disconnect()
  lfo?.disconnect()
  gain?.disconnect()
  lfoGain?.disconnect()
  osc = null
  lfo = null
  gain = null
  lfoGain = null
  running = false
}

export function updateSonify(sample: KinematicsSample) {
  if (!running || !osc || !gain || !lfoGain) return
  const pitch = 180 + Math.min(800, Math.abs(sample.v) * 40)
  const vol = Math.min(0.18, 0.02 + Math.abs(sample.a) * 0.015)
  const vibrato = Math.min(40, Math.abs(sample.jerk ?? 0) * 8)
  osc.frequency.setTargetAtTime(pitch, ensure()!.currentTime, 0.05)
  gain.gain.setTargetAtTime(vol, ensure()!.currentTime, 0.05)
  lfoGain.gain.setTargetAtTime(vibrato, ensure()!.currentTime, 0.05)
}

export function playCollisionClick() {
  const c = ensure()
  if (!c) return
  void c.resume()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'square'
  o.frequency.value = 120
  g.gain.value = 0.15
  o.connect(g)
  g.connect(c.destination)
  o.start()
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12)
  o.stop(c.currentTime + 0.13)
}
