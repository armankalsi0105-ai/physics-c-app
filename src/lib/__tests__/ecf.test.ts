import { describe, expect, it } from 'vitest'
import { predictedApScore, scoreFrq } from '@/lib/frq/ecf'
import { FRQS } from '@/data/frqs'

describe('FRQ ECF', () => {
  const frq = FRQS[0]

  it('awards method points and ECF for dependent parts', () => {
    const scored = scoreFrq(frq, {
      a: { value: '4', method: 'ΣF = ma net friction' },
      b: { value: '8', method: 'x = ½ at² kinematics' },
      c: { value: '128', method: '½mv² kinetic' },
    })
    expect(scored.results[0].numericCorrect).toBe(false)
    expect(scored.results[0].methodPoints).toBeGreaterThan(0)
    expect(scored.results[1].usedEcf).toBe(true)
  })

  it('predicts AP-ish scores', () => {
    expect(predictedApScore(5, 5, 10, 10)).toBe(5)
    expect(predictedApScore(0, 5, 0, 10)).toBe(1)
  })
})
