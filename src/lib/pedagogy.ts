/**
 * Teacher–student coaching content keyed by day.
 * Keeps curriculum.json intact while adding pedagogy chrome.
 */

export type DayPedagogy = {
  /** "By the end of today…" bullets */
  objectives: string[]
  /** Warm teacher opener after overview */
  coachOpen: string
  /** Explicit math → physics transfer */
  bridge: { math: string; physics: string; transfer: string }
  /** Common student traps */
  misconceptions: { myth: string; truth: string }[]
  /** Teach-back prompt (explain in own words) */
  teachBack: string
  /** Pre-quiz confidence skills */
  skills: string[]
  /** Guided reflection prompts for notes */
  reflect: string[]
}

const DEFAULT: DayPedagogy = {
  objectives: [
    'State today’s core math idea in one sentence',
    'Connect that idea to the physics quantity it measures',
    'Solve one guided and one independent problem with units',
  ],
  coachOpen:
    'Read the overview once, then say the connection out loud before you watch any video. Teaching yourself the link first makes the rest stick.',
  bridge: {
    math: 'Today’s math tool',
    physics: 'Today’s physics meaning',
    transfer: 'Same structure, different symbols — translate before you compute.',
  },
  misconceptions: [
    {
      myth: 'If I memorize the formula, I understand it.',
      truth: 'Understanding means you can say what each symbol means and when the formula applies.',
    },
  ],
  teachBack:
    'In 2–3 sentences, explain today’s main idea to a classmate who missed class.',
  skills: ['Recall the key formula', 'Set up a problem', 'Check units / reasonableness'],
  reflect: [
    'What clicked today?',
    'What still feels fuzzy?',
    'One exam tip I will reuse…',
  ],
}

export const DAY_PEDAGOGY: Record<number, DayPedagogy> = {
  1: {
    objectives: [
      'Compute slope / average rate of change from two points',
      'Read slope of an x–t graph as average velocity',
      'Write x(t) = x₀ + vt for constant velocity',
    ],
    coachOpen:
      'Slope is not “steepness for its own sake” — it is how fast the output changes. In physics, that output is often position.',
    bridge: {
      math: 'm = (y₂ − y₁)/(x₂ − x₁)',
      physics: 'v_avg = Δx / Δt',
      transfer: 'Replace y with x (position) and x with t (time). Same rise-over-run.',
    },
    misconceptions: [
      {
        myth: 'Slope of any graph is always velocity.',
        truth: 'Only on a position–time graph. On v–t, slope is acceleration.',
      },
      {
        myth: 'Average velocity is the average of the speeds.',
        truth: 'It is net displacement over total time — direction matters.',
      },
    ],
    teachBack:
      'Explain to a friend why the slope of x vs. t is velocity, using the words “rise” and “run.”',
    skills: ['Find slope from two points', 'Interpret x–t slope', 'Use x = x₀ + vt'],
    reflect: [
      'Where did I confuse slope with the y-intercept?',
      'Can I sketch an x–t graph from a word problem?',
    ],
  },
  2: {
    objectives: [
      'Describe a limit as “approaching” a value',
      'Connect instantaneous velocity to a tangent slope',
      'Write v = lim Δt→0 (Δx/Δt)',
    ],
    coachOpen:
      'Limits formalize what your eye does when you zoom into a curve. Instantaneous velocity is that zoomed-in slope.',
    bridge: {
      math: 'lim_{h→0} [f(x+h)−f(x)]/h',
      physics: 'v(t) = dx/dt',
      transfer: 'The derivative is the limit of average rates — physics calls that instantaneous velocity.',
    },
    misconceptions: [
      {
        myth: 'Instantaneous velocity needs two different times.',
        truth: 'It is the limit as the time interval shrinks to a single instant.',
      },
    ],
    teachBack: 'How is a tangent different from a secant on an x–t graph?',
    skills: ['Limit language', 'Tangent vs secant', 'v = dx/dt idea'],
    reflect: ['Where did “average” vs “instantaneous” trip me up?'],
  },
  3: {
    objectives: [
      'Apply the power rule to polynomials',
      'Differentiate x(t) to get v(t) and a(t)',
      'Use constant-acceleration kinematic links',
    ],
    coachOpen:
      'The power rule is a speed tool. Once it is automatic, kinematics derivatives become translation, not struggle.',
    bridge: {
      math: "d/dt [tⁿ] = n tⁿ⁻¹",
      physics: 'v = dx/dt, a = dv/dt',
      transfer: 'Differentiate position → velocity → acceleration, term by term.',
    },
    misconceptions: [
      {
        myth: 'Acceleration is always g downward.',
        truth: 'Only in free fall near Earth with no other forces. In general a = dv/dt.',
      },
    ],
    teachBack: 'Walk through finding a(t) from x(t) = 4t³ — narrate each derivative.',
    skills: ['Power rule', 'x → v → a', 'Units of each'],
    reflect: ['Did I drop a factor of n anywhere?'],
  },
  4: {
    objectives: [
      'Use product and quotient rules correctly',
      'Differentiate motion products like (t)(sin t) style forms',
      'Read advanced motion graphs carefully',
    ],
    coachOpen:
      'When two changing pieces multiply, you need product rule — physics loves products (momentum, etc.).',
    bridge: {
      math: "(uv)′ = u′v + uv′",
      physics: 'Rates of products (e.g. changing mass or amplitude models)',
      transfer: 'Identify u and v before differentiating anything.',
    },
    misconceptions: [
      {
        myth: 'Derivative of a product is the product of derivatives.',
        truth: 'That misses the cross terms — always product rule.',
      },
    ],
    teachBack: 'State the product rule and invent a tiny physics example.',
    skills: ['Product rule', 'Quotient rule', 'Graph reading'],
    reflect: ['Which rule did I reach for first, and was it right?'],
  },
  5: {
    objectives: [
      'Apply the chain rule to compositions',
      'Separate projectile motion into x and y',
      'Predict range / time of flight structure',
    ],
    coachOpen:
      'Chain rule is “outside derivative times inside derivative.” Projectiles are the same idea: horizontal and vertical stories chained by time.',
    bridge: {
      math: 'd/dx f(g(x)) = f′(g(x)) g′(x)',
      physics: 'x(t) and y(t) linked by shared t',
      transfer: 'Compose carefully: angle → components → functions of time.',
    },
    misconceptions: [
      {
        myth: 'Horizontal velocity becomes zero at the top.',
        truth: 'At the top, v_y = 0; v_x is unchanged (no horizontal acceleration).',
      },
    ],
    teachBack: 'Explain why we treat x and y independently in projectile motion.',
    skills: ['Chain rule', 'Components', 'Time of flight'],
    reflect: ['Did I keep a_x = 0 and a_y = −g straight?'],
  },
  6: {
    objectives: [
      'Resolve vectors into components',
      'Add vectors by components',
      'Use trig for force / velocity directions',
    ],
    coachOpen:
      'Components turn geometry into algebra. Draw first, then trig — never the reverse.',
    bridge: {
      math: 'A_x = A cosθ, A_y = A sinθ',
      physics: 'Force and velocity components on FBDs',
      transfer: 'Same right triangle; physics just names the hypotenuse.',
    },
    misconceptions: [
      {
        myth: 'The angle is always from the +x axis.',
        truth: 'Define your angle from a clear reference on the diagram every time.',
      },
    ],
    teachBack: 'How do you decide cos vs sin for a component?',
    skills: ['Components', 'Vector addition', 'Diagram hygiene'],
    reflect: ['Was my angle reference unambiguous?'],
  },
  7: {
    objectives: [
      'Compute a dot product two ways',
      'Interpret A·B = 0 as perpendicular',
      'Write work W = F·Δr',
    ],
    coachOpen:
      'Dot product extracts “how much of this vector lies along that one.” Work is force along displacement.',
    bridge: {
      math: 'A·B = |A||B|cosθ',
      physics: 'W = F·Δr',
      transfer: 'Only the parallel part of F does work.',
    },
    misconceptions: [
      {
        myth: 'Work is always force times distance.',
        truth: 'It is F cosθ times displacement — perpendicular forces do no work.',
      },
    ],
    teachBack: 'Why does a centripetal force do no work on uniform circular motion?',
    skills: ['Dot product', 'Work sign', 'Perpendicular case'],
    reflect: ['When was work negative today?'],
  },
  8: {
    objectives: [
      'Use right-hand rule for cross products',
      'Compute |A×B| = |A||B|sinθ',
      'Write τ = r × F',
    ],
    coachOpen:
      'Cross product builds a new direction. Torque is “how effectively a force twists.”',
    bridge: {
      math: 'A×B direction by RHR; magnitude with sinθ',
      physics: 'τ = rF sinθ',
      transfer: 'Lever arm is the perpendicular piece of r.',
    },
    misconceptions: [
      {
        myth: 'Any force on an object creates torque.',
        truth: 'Line of action through the pivot → zero torque.',
      },
    ],
    teachBack: 'Show with your hand how torque direction is defined.',
    skills: ['RHR', 'Torque magnitude', 'Pivot choice'],
    reflect: ['Did I pick a consistent pivot?'],
  },
  9: {
    objectives: [
      'Antidifferentiate basic powers',
      'Recover velocity/position from acceleration',
      'Track +C / initial conditions',
    ],
    coachOpen:
      'Integrals are “accumulate change.” In kinematics, integrate a to get Δv, integrate v to get Δx — and pin down constants with initial data.',
    bridge: {
      math: '∫ xⁿ dx = xⁿ⁺¹/(n+1) + C',
      physics: 'v(t) = ∫ a dt, x(t) = ∫ v dt',
      transfer: 'Each integral undoes a derivative; initial conditions fix C.',
    },
    misconceptions: [
      {
        myth: 'I can drop +C because AP wants a number.',
        truth: 'Use the initial condition to solve for C, then evaluate.',
      },
    ],
    teachBack: 'Why do we need x₀ or v₀ when integrating?',
    skills: ['Antiderivatives', 'Initial conditions', 'Kinematic chain'],
    reflect: ['Where did +C almost disappear?'],
  },
  10: {
    objectives: [
      'Interpret definite integrals as signed area',
      'Compute work for variable forces W = ∫ F dx',
      'Use FTC language casually and correctly',
    ],
    coachOpen:
      'Definite integrals answer “how much piles up between here and there?” Area under F–x is work.',
    bridge: {
      math: '∫_a^b f(x) dx',
      physics: 'W = ∫ F·dx (variable force)',
      transfer: 'Shade the region that matches the physical accumulation.',
    },
    misconceptions: [
      {
        myth: 'Area under a curve is always positive.',
        truth: 'Signed area: below the axis subtracts.',
      },
    ],
    teachBack: 'Why is work the area under an F–x graph?',
    skills: ['Definite integral', 'Signed area', 'Variable-force work'],
    reflect: ['Did I match limits to the physical interval?'],
  },
  11: {
    objectives: [
      'Draw a complete free-body diagram',
      'Write ΣF = ma for each axis',
      'See a = dv/dt as a differential statement',
    ],
    coachOpen:
      'Newton’s second law is a sentence: net force causes acceleration. Draw every force on one object before algebra.',
    bridge: {
      math: 'Differential form a = dv/dt',
      physics: 'ΣF = ma',
      transfer: 'Once ΣF is known, you have a DE for v(t) or x(t).',
    },
    misconceptions: [
      {
        myth: 'The FBD includes forces the object exerts on others.',
        truth: 'Only forces ON the object of interest.',
      },
    ],
    teachBack: 'Narrate how you build an FBD for a block on an incline.',
    skills: ['FBD', 'Components', 'ΣF = ma'],
    reflect: ['Which force was easiest to forget?'],
  },
  12: {
    objectives: [
      'Write m dv/dt = mg − bv for linear drag',
      'Identify terminal velocity',
      'See how Euler step size affects accuracy',
    ],
    coachOpen:
      'Drag fights motion. Terminal speed is equilibrium: gravity balanced by drag. Numerics (Euler) approximate the smooth truth.',
    bridge: {
      math: 'Separable DE / exponential approach',
      physics: 'v → v_t = mg/b',
      transfer: 'Solve analytically when you can; use Euler to see discretization error.',
    },
    misconceptions: [
      {
        myth: 'Bigger dt is always fine if the graph looks smooth.',
        truth: 'Large dt can be stable-looking but inaccurate — compare to exact when possible.',
      },
    ],
    teachBack: 'What does terminal velocity mean in terms of net force?',
    skills: ['Drag DE', 'v_t', 'Euler intuition'],
    reflect: ['What dt made the Euler curve visibly wrong?'],
  },
  13: {
    objectives: [
      'State the work–energy theorem',
      'Compute W_net and relate to ΔK',
      'Choose energy vs Newton strategically',
    ],
    coachOpen:
      'Energy bookkeeping often beats force components. If you care about speeds, try work–energy first.',
    bridge: {
      math: '∫ F dx accumulates work',
      physics: 'W_net = ΔK',
      transfer: 'Net work is the integral version of ΣF along the path.',
    },
    misconceptions: [
      {
        myth: 'Energy is conserved in every problem.',
        truth: 'Mechanical energy is conserved only without nonconservative work.',
      },
    ],
    teachBack: 'When would you prefer energy methods over ΣF = ma?',
    skills: ['Work–energy', 'ΔK', 'Strategy choice'],
    reflect: ['Did I include every force that does work?'],
  },
  14: {
    objectives: [
      'Relate F = −dU/dx',
      'Use energy conservation with U and K',
      'Identify conservative forces',
    ],
    coachOpen:
      'Potential energy is stored ability to do work. The force points downhill on the U landscape.',
    bridge: {
      math: 'Derivative of a potential function',
      physics: 'F = −dU/dx',
      transfer: 'Differentiate U to recover force; integrate −F to build U.',
    },
    misconceptions: [
      {
        myth: 'U = 0 is special physically.',
        truth: 'Only differences ΔU matter; you choose the zero.',
      },
    ],
    teachBack: 'Why is there a minus in F = −dU/dx?',
    skills: ['U ↔ F', 'Conservation', 'Zero of potential'],
    reflect: ['Where did I set U = 0, and why?'],
  },
  15: {
    objectives: [
      'Connect impulse to Δp',
      'Read area under F–t as impulse',
      'Use momentum ideas in collisions setup',
    ],
    coachOpen:
      'Impulse is the time-integral of force — a shove’s total effect on momentum.',
    bridge: {
      math: '∫ F dt',
      physics: 'J = Δp',
      transfer: 'Area under F–t equals change in mv.',
    },
    misconceptions: [
      {
        myth: 'Impulse and momentum are the same thing.',
        truth: 'Impulse equals the change in momentum.',
      },
    ],
    teachBack: 'How can a small force create a large impulse?',
    skills: ['Impulse', 'F–t area', 'Δp'],
    reflect: ['Did I keep vector directions for p?'],
  },
  16: {
    objectives: [
      'Locate center of mass for discrete systems',
      'Set up x_cm = (1/M) ∫ x dm ideas',
      'Treat CM motion via net external force',
    ],
    coachOpen:
      'Center of mass is the balance point of mass distribution — the system often moves as if all mass sat there.',
    bridge: {
      math: 'Weighted average / integral',
      physics: 'x_cm = Σ m_i x_i / Σ m_i',
      transfer: 'Weights are masses; positions are coordinates.',
    },
    misconceptions: [
      {
        myth: 'CM must lie inside the material.',
        truth: 'For a ring or L-shape, CM can be in empty space.',
      },
    ],
    teachBack: 'Why does ΣF_ext = Ma_cm?',
    skills: ['Discrete CM', 'Continuous idea', 'CM motion'],
    reflect: ['Did my mass weights add to M?'],
  },
  17: {
    objectives: [
      'Interpret I as rotational inertia',
      'Use K_rot = ½ I ω²',
      'Set up ∫ r² dm thinking',
    ],
    coachOpen:
      'Moment of inertia measures how hard it is to angularly accelerate an object — mass and how far it sits from the axis.',
    bridge: {
      math: '∫ r² dm',
      physics: 'I; K = ½Iω²',
      transfer: 'Mass farther from the axis contributes more.',
    },
    misconceptions: [
      {
        myth: 'Heavier always means larger I.',
        truth: 'Distribution relative to the axis matters as much as mass.',
      },
    ],
    teachBack: 'Why does a hoop have larger I than a disk of equal mass/radius?',
    skills: ['I meaning', 'Rotational KE', 'Axis dependence'],
    reflect: ['Which axis did the problem specify?'],
  },
  18: {
    objectives: [
      'Write Στ = Iα',
      'Relate linear and angular quantities',
      'Solve a basic rotation dynamics problem',
    ],
    coachOpen:
      'Rotation has a Newton’s second law twin: torques cause angular acceleration.',
    bridge: {
      math: 'Parallel structure to ΣF = ma',
      physics: 'Στ = Iα',
      transfer: 'Map F→τ, m→I, a→α.',
    },
    misconceptions: [
      {
        myth: 'α and a are interchangeable.',
        truth: 'a = rα only for points on a rigid body about a fixed axis (magnitudes).',
      },
    ],
    teachBack: 'List the F→τ, m→I, a→α dictionary from memory.',
    skills: ['Στ = Iα', 'a = rα', 'Strategy'],
    reflect: ['Did my torque signs stay consistent?'],
  },
  19: {
    objectives: [
      'Recognize ÿ = −ω²x as SHM',
      'Use ω = √(k/m) for a spring–mass',
      'Compare Euler approximation to exact cosine',
    ],
    coachOpen:
      'SHM is the DE that says “acceleration is toward equilibrium and proportional to displacement.” Cosine/sine solutions are the smooth truth; Euler is a student sketch.',
    bridge: {
      math: 'Second-order DE d²x/dt² = −ω²x',
      physics: 'Mass–spring or small-angle pendulum',
      transfer: 'Match ω to the physical parameters (√(k/m), √(g/L)).',
    },
    misconceptions: [
      {
        myth: 'Amplitude changes the period of ideal SHM.',
        truth: 'For ideal mass–spring / small-angle pendulum, T is amplitude-independent.',
      },
    ],
    teachBack: 'What does the minus sign in a = −ω²x guarantee physically?',
    skills: ['SHM DE', 'ω meaning', 'Euler vs exact'],
    reflect: ['How did large dt distort the oscillation?'],
  },
  20: {
    objectives: [
      'Choose among FBD / energy / momentum / rotation toolkits',
      'Show clear AP-style setup before computation',
      'Self-check units and limiting cases',
    ],
    coachOpen:
      'Today is a studio critique: slow down, name the principle, then compute. Graders reward the story of your reasoning.',
    bridge: {
      math: 'All calculus tools from Days 1–19',
      physics: 'Full Mechanics C toolkit',
      transfer: 'Pick the shortest honest path; show the principle line.',
    },
    misconceptions: [
      {
        myth: 'More algebra means a better solution.',
        truth: 'Clear principle + clean setup beats messy pages.',
      },
    ],
    teachBack: 'Give your personal 4-step checklist before any AP free-response.',
    skills: ['Strategy selection', 'AP communication', 'Self-checking'],
    reflect: [
      'Which tool do I overuse?',
      'Which tool do I underuse?',
      'What will I write first on exam day?',
    ],
  },
}

export function getDayPedagogy(day: number): DayPedagogy {
  return DAY_PEDAGOGY[day] ?? DEFAULT
}
