import { describe, expect, it, beforeEach } from 'vitest'
import {
  isSonifying,
  stopSonify,
  updateSonify,
} from '@/lib/audio/kinematicsAudio'

describe('kinematicsAudio mute defaults', () => {
  beforeEach(() => {
    stopSonify()
  })

  it('is muted / not sonifying by default', () => {
    expect(isSonifying()).toBe(false)
  })

  it('updateSonify is a no-op when not running', () => {
    expect(() => updateSonify({ v: 10, a: 2, jerk: 1 })).not.toThrow()
    expect(isSonifying()).toBe(false)
  })

  it('stopSonify is safe when idle', () => {
    expect(() => stopSonify()).not.toThrow()
    expect(isSonifying()).toBe(false)
  })
})
