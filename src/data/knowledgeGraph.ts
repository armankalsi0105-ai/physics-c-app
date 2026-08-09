export type ConceptNode = {
  id: string
  label: string
  day: number
  prevIds: string[]
  nextIds: string[]
}

/** Core concept chain: slope → limits → derivatives → velocity → acceleration → vectors → work → FBD → energy → momentum → rotation → SHM */
export const CONCEPT_NODES: ConceptNode[] = [
  {
    id: 'slope',
    label: 'Slope & rate of change',
    day: 1,
    prevIds: [],
    nextIds: ['limits'],
  },
  {
    id: 'limits',
    label: 'Limits & instantaneous rate',
    day: 2,
    prevIds: ['slope'],
    nextIds: ['derivatives'],
  },
  {
    id: 'derivatives',
    label: 'Derivatives & power rule',
    day: 3,
    prevIds: ['limits'],
    nextIds: ['velocity'],
  },
  {
    id: 'velocity',
    label: 'Velocity from position',
    day: 3,
    prevIds: ['derivatives'],
    nextIds: ['acceleration'],
  },
  {
    id: 'acceleration',
    label: 'Acceleration & motion graphs',
    day: 4,
    prevIds: ['velocity'],
    nextIds: ['chain-rule'],
  },
  {
    id: 'chain-rule',
    label: 'Chain rule & 2D motion',
    day: 5,
    prevIds: ['acceleration'],
    nextIds: ['projectile'],
  },
  {
    id: 'projectile',
    label: 'Projectile motion',
    day: 5,
    prevIds: ['chain-rule'],
    nextIds: ['vectors'],
  },
  {
    id: 'vectors',
    label: 'Vector components & trig',
    day: 6,
    prevIds: ['projectile'],
    nextIds: ['dot-product'],
  },
  {
    id: 'dot-product',
    label: 'Dot product',
    day: 7,
    prevIds: ['vectors'],
    nextIds: ['work'],
  },
  {
    id: 'work',
    label: 'Work by constant force',
    day: 7,
    prevIds: ['dot-product'],
    nextIds: ['cross-product'],
  },
  {
    id: 'cross-product',
    label: 'Cross product & torque setup',
    day: 8,
    prevIds: ['work'],
    nextIds: ['integrals'],
  },
  {
    id: 'integrals',
    label: 'Antiderivatives & integration',
    day: 9,
    prevIds: ['cross-product'],
    nextIds: ['definite-integrals'],
  },
  {
    id: 'definite-integrals',
    label: 'Definite integrals & variable work',
    day: 10,
    prevIds: ['integrals'],
    nextIds: ['fbd'],
  },
  {
    id: 'fbd',
    label: 'Free-body diagrams & ΣF = ma',
    day: 11,
    prevIds: ['definite-integrals'],
    nextIds: ['odes'],
  },
  {
    id: 'odes',
    label: 'Differential equations & drag',
    day: 12,
    prevIds: ['fbd'],
    nextIds: ['work-energy'],
  },
  {
    id: 'work-energy',
    label: 'Work–energy theorem',
    day: 13,
    prevIds: ['odes'],
    nextIds: ['potential-energy'],
  },
  {
    id: 'potential-energy',
    label: 'Potential energy & F = −dU/dx',
    day: 14,
    prevIds: ['work-energy'],
    nextIds: ['energy'],
  },
  {
    id: 'energy',
    label: 'Conservation of energy',
    day: 14,
    prevIds: ['potential-energy'],
    nextIds: ['momentum'],
  },
  {
    id: 'momentum',
    label: 'Impulse & momentum',
    day: 15,
    prevIds: ['energy'],
    nextIds: ['com'],
  },
  {
    id: 'com',
    label: 'Center of mass',
    day: 16,
    prevIds: ['momentum'],
    nextIds: ['rotation'],
  },
  {
    id: 'rotation',
    label: 'Moment of inertia & rotation',
    day: 17,
    prevIds: ['com'],
    nextIds: ['torque'],
  },
  {
    id: 'torque',
    label: 'Torque & angular acceleration',
    day: 18,
    prevIds: ['rotation'],
    nextIds: ['shm'],
  },
  {
    id: 'shm',
    label: 'Simple harmonic motion',
    day: 19,
    prevIds: ['torque'],
    nextIds: ['review'],
  },
  {
    id: 'review',
    label: 'Mixed calculus–physics review',
    day: 20,
    prevIds: ['shm'],
    nextIds: [],
  },
]

export const CONCEPT_BY_ID = Object.fromEntries(
  CONCEPT_NODES.map((n) => [n.id, n]),
) as Record<string, ConceptNode>

/** Primary concept node for each day (1–20). */
export const DAY_CONCEPT_ID: Record<number, string> = {
  1: 'slope',
  2: 'limits',
  3: 'derivatives',
  4: 'acceleration',
  5: 'projectile',
  6: 'vectors',
  7: 'work',
  8: 'cross-product',
  9: 'integrals',
  10: 'definite-integrals',
  11: 'fbd',
  12: 'odes',
  13: 'work-energy',
  14: 'energy',
  15: 'momentum',
  16: 'com',
  17: 'rotation',
  18: 'torque',
  19: 'shm',
  20: 'review',
}

export function getConceptForDay(day: number): ConceptNode | null {
  const id = DAY_CONCEPT_ID[day]
  return id ? (CONCEPT_BY_ID[id] ?? null) : null
}

export function getConceptNeighbors(day: number): {
  current: ConceptNode | null
  prev: ConceptNode[]
  next: ConceptNode[]
} {
  const current = getConceptForDay(day)
  if (!current) return { current: null, prev: [], next: [] }
  return {
    current,
    prev: current.prevIds
      .map((id) => CONCEPT_BY_ID[id])
      .filter(Boolean) as ConceptNode[],
    next: current.nextIds
      .map((id) => CONCEPT_BY_ID[id])
      .filter(Boolean) as ConceptNode[],
  }
}
