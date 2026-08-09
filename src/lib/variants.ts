/**
 * Local (no-LLM) problem variants: nudge numbers in prompts/answers.
 */

import type { Problem } from './types'

function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(id: string, n: number) {
  let h = 2166136261
  const s = `${id}:${n}`
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Extract first number-like token and scale it slightly. */
export function makeProblemVariant(problem: Problem, variantIndex: number): Problem {
  if (variantIndex <= 0) return problem
  const rand = mulberry32(hashSeed(problem.id, variantIndex))
  const factor = 0.7 + rand() * 0.8 // 0.7–1.5

  const rewrite = (text: string) =>
    text.replace(/-?\d+(\.\d+)?/g, (raw) => {
      const n = Number(raw)
      if (!Number.isFinite(n) || Math.abs(n) < 1e-9) return raw
      if (Math.abs(n) === 1 || Math.abs(n) === 2) return raw
      const scaled = n * factor
      const rounded =
        Math.abs(scaled) >= 10
          ? Math.round(scaled)
          : Math.round(scaled * 10) / 10
      return String(rounded)
    })

  if (problem.type === 'mc') {
    return {
      ...problem,
      id: `${problem.id}__v${variantIndex}`,
      prompt: rewrite(problem.prompt),
      options: problem.options?.map(rewrite),
      answer: rewrite(String(problem.answer)),
      solution: rewrite(problem.solution),
      hint: rewrite(problem.hint),
      steps: problem.steps.map(rewrite),
      hints: problem.hints
        ? {
            concept: rewrite(problem.hints.concept),
            formula: rewrite(problem.hints.formula),
            setup: rewrite(problem.hints.setup),
          }
        : problem.hints,
    }
  }

  const ans = Number(problem.answer)
  const nextAns = Number.isFinite(ans)
    ? Math.abs(ans) >= 10
      ? Math.round(ans * factor)
      : Math.round(ans * factor * 10) / 10
    : problem.answer

  return {
    ...problem,
    id: `${problem.id}__v${variantIndex}`,
    prompt: rewrite(problem.prompt),
    answer: nextAns,
    solution: rewrite(problem.solution),
    hint: rewrite(problem.hint),
    steps: problem.steps.map(rewrite),
    hints: problem.hints
      ? {
          concept: rewrite(problem.hints.concept),
          formula: rewrite(problem.hints.formula),
          setup: rewrite(problem.hints.setup),
        }
      : problem.hints,
    tolerance:
      typeof nextAns === 'number'
        ? Math.max(problem.tolerance ?? 0.05, Math.abs(nextAns) * 0.03)
        : problem.tolerance,
  }
}

export function socraticPrompt(problem: Problem, wrongValue: string): string {
  const misconceptions = [
    `You answered “${wrongValue.trim() || 'blank'}”. Before we look at the solution: which quantity were you solving for — and which formula connects the givens to that quantity?`,
    `Pause. Does your answer have the right units / dimensions for what the question asked?`,
    `Try restating the problem in one sentence without numbers. What is the physical story?`,
  ]
  const fromHint = problem.hint
    ? `Your first instinct: ${problem.hint} — which part of that did you skip?`
    : misconceptions[0]
  const pool = [fromHint, ...misconceptions]
  const idx = Math.abs(hashSeed(problem.id + wrongValue, 1)) % pool.length
  return pool[idx]
}

export function explainStep(step: string, mode: 'calc' | 'eli10'): string {
  if (mode === 'eli10') {
    return `In plain words: this step is just carefully changing the expression so it matches a rule you already know. Look at what stayed the same and what changed in “${step.slice(0, 80)}${step.length > 80 ? '…' : ''}”.`
  }
  return `Calculus focus: identify the operation (product/chain/power/integral). Apply it term-by-term to “${step.slice(0, 80)}${step.length > 80 ? '…' : ''}”, then simplify constants.`
}
