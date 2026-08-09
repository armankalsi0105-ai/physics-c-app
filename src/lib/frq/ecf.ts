import type { FRQ, FRQPart } from '@/lib/types'

export type PartResult = {
  partId: string
  numericCorrect: boolean
  methodPoints: number
  numericPoints: number
  usedEcf: boolean
  studentUniverseAnswer?: number
  divergence?: string
}

export type FrqScore = {
  results: PartResult[]
  numericTotal: number
  methodTotal: number
  maxPoints: number
}

function methodHit(text: string, rubric: string[]): number {
  const lower = text.toLowerCase()
  const hits = rubric.filter((k) => lower.includes(k.toLowerCase())).length
  if (hits === 0) return 0
  if (hits >= Math.ceil(rubric.length * 0.5)) return 1
  return 0.5
}

function near(a: number, b: number, tol: number) {
  return Number.isFinite(a) && Math.abs(a - b) <= tol
}

/**
 * Error-carried-forward grading: wrong Part A still earns method credit,
 * and dependent parts are checked against the student's universe.
 */
export function scoreFrq(
  frq: FRQ,
  answers: Record<string, { value: string; method: string }>,
): FrqScore {
  const byId = Object.fromEntries(frq.parts.map((p) => [p.id, p]))
  const numericAnswers: Record<string, number> = {}
  const results: PartResult[] = []
  let numericTotal = 0
  let methodTotal = 0
  let maxPoints = 0

  for (const part of frq.parts) {
    maxPoints += part.points
    const entry = answers[part.id] ?? { value: '', method: '' }
    const studentNum = Number(entry.value)
    const tol = part.tolerance ?? Math.max(0.05, Math.abs(part.officialAnswer) * 0.02)
    const methodPts = methodHit(entry.method, part.methodRubric) * (part.points * 0.4)
    methodTotal += methodPts

    let expected = part.officialAnswer
    let usedEcf = false
    let divergence: string | undefined

    if (part.dependsOn) {
      const parent = byId[part.dependsOn]
      const parentStudent = numericAnswers[part.dependsOn]
      const parentOfficial = parent?.officialAnswer
      if (
        parent &&
        parentStudent != null &&
        parentOfficial != null &&
        !near(parentStudent, parentOfficial, parent.tolerance ?? 0.1)
      ) {
        // Scale dependent answer by student's A / official A ratio
        const ratio = parentOfficial === 0 ? 1 : parentStudent / parentOfficial
        expected = part.officialAnswer * ratio
        usedEcf = true
        divergence = `Part ${part.id} graded in your universe using ${part.dependsOn}=${parentStudent} (official ${parentOfficial}).`
      }
    }

    const numericCorrect = near(studentNum, expected, usedEcf ? tol * 1.5 : tol)
    numericAnswers[part.id] = studentNum
    const numericPts = numericCorrect ? part.points * 0.6 : 0
    numericTotal += numericPts

    results.push({
      partId: part.id,
      numericCorrect,
      methodPoints: methodPts,
      numericPoints: numericPts,
      usedEcf,
      studentUniverseAnswer: usedEcf ? expected : undefined,
      divergence,
    })
  }

  return { results, numericTotal, methodTotal, maxPoints }
}

export function predictedApScore(
  mcCorrect: number,
  mcTotal: number,
  frqEarned: number,
  frqMax: number,
): number {
  const mc = mcTotal ? mcCorrect / mcTotal : 0
  const frq = frqMax ? frqEarned / frqMax : 0
  const composite = 0.5 * mc + 0.5 * frq
  if (composite >= 0.85) return 5
  if (composite >= 0.7) return 4
  if (composite >= 0.55) return 3
  if (composite >= 0.4) return 2
  return 1
}

export type { FRQPart }
