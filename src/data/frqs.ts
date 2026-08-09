import type { FRQ } from '@/lib/types'

/** Multi-part FRQs for ECF grading (Days 11, 13, 15). */
export const FRQS: FRQ[] = [
  {
    id: 'frq-d11-block',
    day: 11,
    title: 'Block on a horizontal surface (Newton)',
    parts: [
      {
        id: 'a',
        prompt:
          'A 4.0 kg block is pulled by a horizontal force of 20 N. Friction is 6.0 N. Find the acceleration in m/s².',
        points: 3,
        officialAnswer: 3.5,
        tolerance: 0.1,
        methodRubric: ['ΣF', 'ma', 'net', 'friction', 'F_net'],
        solution: 'ΣF = 20 − 6 = 14 N; a = 14/4 = 3.5 m/s²',
      },
      {
        id: 'b',
        prompt:
          'Using your acceleration from (a), how far does the block travel in 2.0 s from rest? (m)',
        points: 3,
        dependsOn: 'a',
        officialAnswer: 7,
        tolerance: 0.2,
        methodRubric: ['x =', '½', 'at²', 'kinematics'],
        solution: 'x = ½ a t² = ½(3.5)(4) = 7 m',
      },
      {
        id: 'c',
        prompt:
          'What is the block’s kinetic energy after 2.0 s? (J) Use v = at from your (a).',
        points: 3,
        dependsOn: 'a',
        officialAnswer: 98,
        tolerance: 2,
        methodRubric: ['½mv²', 'K =', 'kinetic'],
        solution: 'v = at = 3.5·2 = 7 m/s; K = ½mv² = ½(4)(49) = 98 J',
      },
    ],
  },
  {
    id: 'frq-d13-energy',
    day: 13,
    title: 'Work–energy on an incline',
    parts: [
      {
        id: 'a',
        prompt:
          'A 2.0 kg box slides 3.0 m down a frictionless 30° incline. Find the work done by gravity (J).',
        points: 3,
        officialAnswer: 29.4,
        tolerance: 0.5,
        methodRubric: ['mg', 'sin', 'W =', 'work', 'gravity'],
        solution: 'W = mg sinθ · d = 2·9.8·0.5·3 = 29.4 J',
      },
      {
        id: 'b',
        prompt:
          'If the box starts from rest, what is its speed at the bottom? (m/s) Use energy with your W from (a).',
        points: 4,
        dependsOn: 'a',
        officialAnswer: 5.42,
        tolerance: 0.15,
        methodRubric: ['ΔK', '½mv²', 'energy'],
        solution: 'W = ΔK ⇒ ½mv² = 29.4 ⇒ v = √(29.4) ≈ 5.42',
      },
    ],
  },
  {
    id: 'frq-d15-impulse',
    day: 15,
    title: 'Impulse and momentum',
    parts: [
      {
        id: 'a',
        prompt:
          'A 0.50 kg cart moving at 4.0 m/s is stopped by a force over 0.20 s. Find the impulse magnitude (N·s).',
        points: 3,
        officialAnswer: 2,
        tolerance: 0.05,
        methodRubric: ['Δp', 'impulse', 'J =', 'mv'],
        solution: 'J = Δp = 0.5·4 = 2 N·s',
      },
      {
        id: 'b',
        prompt:
          'What average force was applied? (N) Use your impulse from (a).',
        points: 3,
        dependsOn: 'a',
        officialAnswer: 10,
        tolerance: 0.2,
        methodRubric: ['F_avg', 'J/Δt', 'force'],
        solution: 'F_avg = J/Δt = 2/0.2 = 10 N',
      },
    ],
  },
]

// Fix FRQ d11 part c official answer to 98
FRQS[0].parts[2].officialAnswer = 98

export function frqForDay(day: number): FRQ | undefined {
  return FRQS.find((f) => f.day === day)
}

export function allFrqs(): FRQ[] {
  return FRQS
}
