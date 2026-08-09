export type FormulaVariable = {
  symbol: string
  meaning: string
  units: string
}

export type FormulaEntry = {
  id: string
  latex: string
  unicode: string
  meaning: string
  units: string
  variables: FormulaVariable[]
  mistakes: string[]
  related: string[]
  derivation: string[]
  day: number
}

export const FORMULA_EXPLORER: FormulaEntry[] = [
  {
    id: 'slope',
    latex: 'm = \\dfrac{\\Delta y}{\\Delta x}',
    unicode: 'm = Δy/Δx',
    meaning: 'Slope measures how fast y changes per unit change in x.',
    units: 'depends on axes (e.g., m/s for position–time)',
    variables: [
      { symbol: 'm', meaning: 'slope', units: 'varies' },
      { symbol: 'Δy', meaning: 'change in dependent variable', units: 'varies' },
      { symbol: 'Δx', meaning: 'change in independent variable', units: 'varies' },
    ],
    mistakes: [
      'Using total distance instead of displacement for Δx.',
      'Confusing average slope with instantaneous slope.',
    ],
    related: ['velocity', 'derivative'],
    derivation: [
      'Pick two points (x₁, y₁) and (x₂, y₂).',
      'Compute rise: Δy = y₂ − y₁.',
      'Compute run: Δx = x₂ − x₁.',
      'Slope m = Δy/Δx.',
    ],
    day: 1,
  },
  {
    id: 'limit',
    latex: 'v = \\lim_{\\Delta t \\to 0} \\dfrac{\\Delta x}{\\Delta t}',
    unicode: 'v = lim(Δt→0) Δx/Δt',
    meaning: 'Instantaneous velocity is the limit of average velocity as the time interval shrinks to zero.',
    units: 'm/s',
    variables: [
      { symbol: 'v', meaning: 'instantaneous velocity', units: 'm/s' },
      { symbol: 'Δx', meaning: 'displacement', units: 'm' },
      { symbol: 'Δt', meaning: 'time interval', units: 's' },
    ],
    mistakes: [
      'Evaluating at Δt = 0 directly (division by zero).',
      'Using total distance instead of displacement.',
    ],
    related: ['derivative', 'kinematics-const-a'],
    derivation: [
      'Start with average velocity v_avg = Δx/Δt.',
      'Let Δt approach zero.',
      'The limiting value is the derivative dx/dt.',
    ],
    day: 2,
  },
  {
    id: 'derivative',
    latex: '\\dfrac{d}{dx}x^{n} = nx^{n-1}',
    unicode: 'd/dx (xⁿ) = n·xⁿ⁻¹',
    meaning: 'Power rule: derivative of xⁿ is n times x raised to (n−1).',
    units: 'depends on x and n',
    variables: [
      { symbol: 'n', meaning: 'real exponent', units: 'dimensionless' },
      { symbol: 'x', meaning: 'independent variable', units: 'varies' },
    ],
    mistakes: [
      'Forgetting to reduce the exponent by 1.',
      'Applying power rule to sums without term-by-term differentiation.',
    ],
    related: ['velocity', 'acceleration'],
    derivation: [
      'Use the limit definition f′(x) = lim[h→0] (f(x+h) − f(x))/h.',
      'For f(x) = xⁿ, expand (x+h)ⁿ via binomial theorem.',
      'Cancel terms; surviving term gives nxⁿ⁻¹.',
    ],
    day: 3,
  },
  {
    id: 'velocity',
    latex: 'v(t) = \\dfrac{dx}{dt}',
    unicode: 'v = dx/dt',
    meaning: 'Velocity is the time derivative of position.',
    units: 'm/s',
    variables: [
      { symbol: 'x', meaning: 'position', units: 'm' },
      { symbol: 't', meaning: 'time', units: 's' },
      { symbol: 'v', meaning: 'velocity', units: 'm/s' },
    ],
    mistakes: [
      'Confusing speed (|v|) with velocity (signed).',
      'Using average velocity when instantaneous is required.',
    ],
    related: ['acceleration', 'limit'],
    derivation: [
      'Position x(t) is a function of time.',
      'Take derivative with respect to t.',
      'Result v(t) gives instantaneous velocity at each t.',
    ],
    day: 3,
  },
  {
    id: 'acceleration',
    latex: 'a(t) = \\dfrac{dv}{dt} = \\dfrac{d^{2}x}{dt^{2}}',
    unicode: 'a = dv/dt = d²x/dt²',
    meaning: 'Acceleration is the rate of change of velocity.',
    units: 'm/s²',
    variables: [
      { symbol: 'a', meaning: 'acceleration', units: 'm/s²' },
      { symbol: 'v', meaning: 'velocity', units: 'm/s' },
    ],
    mistakes: [
      'Sign errors when object slows down.',
      'Assuming acceleration is always in direction of motion.',
    ],
    related: ['kinematics-const-a', 'newton-2'],
    derivation: [
      'Differentiate velocity v(t) with respect to time.',
      'Equivalently, differentiate position twice.',
    ],
    day: 4,
  },
  {
    id: 'kinematics-const-a',
    latex: 'v = v_0 + at,\\quad x = x_0 + v_0 t + \\tfrac{1}{2}at^{2}',
    unicode: 'v = v₀ + at, x = x₀ + v₀t + ½at²',
    meaning: 'Kinematic equations for motion with constant acceleration.',
    units: 'mixed (m, m/s, m/s², s)',
    variables: [
      { symbol: 'v₀', meaning: 'initial velocity', units: 'm/s' },
      { symbol: 'a', meaning: 'constant acceleration', units: 'm/s²' },
      { symbol: 't', meaning: 'elapsed time', units: 's' },
    ],
    mistakes: [
      'Using when acceleration is not constant.',
      'Mixing up which equation solves for which unknown.',
    ],
    related: ['velocity', 'acceleration', 'projectile'],
    derivation: [
      'Integrate a = dv/dt → v = v₀ + at.',
      'Integrate v = dx/dt → x = x₀ + v₀t + ½at².',
    ],
    day: 3,
  },
  {
    id: 'projectile',
    latex: 'R = \\dfrac{v_0^{2}\\sin 2\\theta}{g}',
    unicode: 'R = v₀² sin(2θ) / g',
    meaning: 'Horizontal range of a projectile launched from ground level.',
    units: 'm',
    variables: [
      { symbol: 'R', meaning: 'range', units: 'm' },
      { symbol: 'v₀', meaning: 'launch speed', units: 'm/s' },
      { symbol: 'θ', meaning: 'launch angle above horizontal', units: 'rad or °' },
      { symbol: 'g', meaning: 'gravitational acceleration', units: 'm/s²' },
    ],
    mistakes: [
      'Using θ from vertical instead of horizontal.',
      'Forgetting independent x/y component analysis.',
    ],
    related: ['chain-rule', 'vectors'],
    derivation: [
      'x(t) = v₀ cos θ · t, y(t) = v₀ sin θ · t − ½gt².',
      'Set y = 0 for landing time T = 2v₀ sin θ / g.',
      'R = v₀ cos θ · T = v₀² sin 2θ / g.',
    ],
    day: 5,
  },
  {
    id: 'chain-rule',
    latex: '\\dfrac{d}{dx}f(g(x)) = f\'(g(x))\\cdot g\'(x)',
    unicode: 'd/dx f(g(x)) = f′(g(x))·g′(x)',
    meaning: 'Chain rule for differentiating composite functions.',
    units: 'n/a',
    variables: [
      { symbol: 'f', meaning: 'outer function', units: 'n/a' },
      { symbol: 'g', meaning: 'inner function', units: 'n/a' },
    ],
    mistakes: [
      'Forgetting the inner derivative factor.',
      'Misidentifying inner vs. outer function.',
    ],
    related: ['derivative', 'projectile'],
    derivation: [
      'Let y = f(u) and u = g(x).',
      'Δy/Δx = (Δy/Δu)(Δu/Δx).',
      'Take limits as Δx → 0.',
    ],
    day: 5,
  },
  {
    id: 'dot-product',
    latex: 'W = \\mathbf{F}\\cdot\\mathbf{d} = Fd\\cos\\theta',
    unicode: 'W = F·d = Fd cos θ',
    meaning: 'Work done by a constant force along a displacement.',
    units: 'J (N·m)',
    variables: [
      { symbol: 'F', meaning: 'force magnitude', units: 'N' },
      { symbol: 'd', meaning: 'displacement magnitude', units: 'm' },
      { symbol: 'θ', meaning: 'angle between F and d', units: 'rad or °' },
    ],
    mistakes: [
      'Using full F when only the parallel component does work.',
      'Sign error when force opposes motion.',
    ],
    related: ['work-integral', 'energy'],
    derivation: [
      'Only the component of F parallel to d contributes.',
      'F_parallel = F cos θ.',
      'W = F_parallel · d = Fd cos θ.',
    ],
    day: 7,
  },
  {
    id: 'work-integral',
    latex: 'W = \\int_{x_1}^{x_2} F(x)\\,dx',
    unicode: 'W = ∫ F(x) dx',
    meaning: 'Work by a variable force equals the area under the F–x curve.',
    units: 'J',
    variables: [
      { symbol: 'F(x)', meaning: 'force as function of position', units: 'N' },
      { symbol: 'x', meaning: 'position', units: 'm' },
    ],
    mistakes: [
      'Forgetting to evaluate F(b) − F(a) for definite integrals.',
      'Using wrong bounds of integration.',
    ],
    related: ['dot-product', 'work-energy'],
    derivation: [
      'Divide path into tiny displacements dx.',
      'dW = F(x) dx for each segment.',
      'Sum (integrate) from x₁ to x₂.',
    ],
    day: 10,
  },
  {
    id: 'newton-2',
    latex: '\\sum \\mathbf{F} = m\\mathbf{a}',
    unicode: 'ΣF = ma',
    meaning: 'Net force equals mass times acceleration (vector equation).',
    units: 'N = kg·m/s²',
    variables: [
      { symbol: 'ΣF', meaning: 'vector sum of forces', units: 'N' },
      { symbol: 'm', meaning: 'mass', units: 'kg' },
      { symbol: 'a', meaning: 'acceleration', units: 'm/s²' },
    ],
    mistakes: [
      'Including forces the object exerts on others.',
      'Using individual force instead of net force.',
    ],
    related: ['fbd', 'incline'],
    derivation: [
      'From Newton\'s second law: acceleration is proportional to net force.',
      'Constant of proportionality is 1/m.',
      'Apply separately in x and y components.',
    ],
    day: 11,
  },
  {
    id: 'fbd',
    latex: '\\sum F_x = ma_x,\\quad \\sum F_y = ma_y',
    unicode: 'ΣFx = max, ΣFy = may',
    meaning: 'Component form of Newton\'s 2nd law from a free-body diagram.',
    units: 'N, m/s²',
    variables: [
      { symbol: 'ΣF_x', meaning: 'sum of x-force components', units: 'N' },
      { symbol: 'ΣF_y', meaning: 'sum of y-force components', units: 'N' },
    ],
    mistakes: [
      'Missing normal force or friction on inclines.',
      'Double-counting action–reaction pairs on the same body.',
    ],
    related: ['newton-2', 'incline'],
    derivation: [
      'Draw isolated body with all external forces.',
      'Resolve each force into x and y components.',
      'Apply ΣF = ma in each direction.',
    ],
    day: 11,
  },
  {
    id: 'incline',
    latex: 'a = g\\sin\\theta,\\quad N = mg\\cos\\theta',
    unicode: 'a = g sin θ, N = mg cos θ',
    meaning: 'Acceleration and normal force on a frictionless incline.',
    units: 'm/s², N',
    variables: [
      { symbol: 'θ', meaning: 'incline angle from horizontal', units: 'rad or °' },
      { symbol: 'g', meaning: 'gravity', units: 'm/s²' },
    ],
    mistakes: [
      'Using sin where cos belongs (axis choice matters).',
      'Forgetting to rotate coordinate system.',
    ],
    related: ['fbd', 'newton-2'],
    derivation: [
      'Choose x along the incline, y perpendicular.',
      'Weight components: mg sin θ (down incline), mg cos θ (into surface).',
      'ΣF_x = mg sin θ = ma → a = g sin θ.',
    ],
    day: 11,
  },
  {
    id: 'work-energy',
    latex: 'W_{\\mathrm{net}} = \\Delta K = \\tfrac{1}{2}mv^{2} - \\tfrac{1}{2}mv_0^{2}',
    unicode: 'W_net = ΔK = ½mv² − ½mv₀²',
    meaning: 'Net work equals change in kinetic energy.',
    units: 'J',
    variables: [
      { symbol: 'W_net', meaning: 'net work on object', units: 'J' },
      { symbol: 'K', meaning: 'kinetic energy', units: 'J' },
    ],
    mistakes: [
      'Using work by a single force instead of net work.',
      'Mixing energy and force approaches inconsistently.',
    ],
    related: ['dot-product', 'energy-conservation'],
    derivation: [
      'Start from W_net = ∫ F_net · dr.',
      'Substitute F_net = ma = m(dv/dt).',
      'Integrate to get ½mv² − ½mv₀².',
    ],
    day: 13,
  },
  {
    id: 'energy-conservation',
    latex: 'K_i + U_i = K_f + U_f',
    unicode: 'Kᵢ + Uᵢ = K_f + U_f',
    meaning: 'Total mechanical energy conserved when only conservative forces act.',
    units: 'J',
    variables: [
      { symbol: 'K', meaning: 'kinetic energy', units: 'J' },
      { symbol: 'U', meaning: 'potential energy', units: 'J' },
    ],
    mistakes: [
      'Applying when friction or non-conservative forces do work.',
      'Using wrong reference for gravitational PE.',
    ],
    related: ['work-energy', 'spring-energy'],
    derivation: [
      'W_nc = ΔK + ΔU from work–energy theorem.',
      'If W_nc = 0, then Δ(K + U) = 0.',
    ],
    day: 14,
  },
  {
    id: 'impulse',
    latex: 'J = \\int F\\,dt = \\Delta p = m\\Delta v',
    unicode: 'J = ∫F dt = Δp = mΔv',
    meaning: 'Impulse equals change in momentum.',
    units: 'N·s = kg·m/s',
    variables: [
      { symbol: 'J', meaning: 'impulse', units: 'N·s' },
      { symbol: 'p', meaning: 'momentum', units: 'kg·m/s' },
    ],
    mistakes: [
      'Confusing impulse with momentum itself.',
      'Ignoring vector nature of Δp.',
    ],
    related: ['momentum-conservation', 'work-integral'],
    derivation: [
      'From F = dp/dt, rearrange F dt = dp.',
      'Integrate both sides over the collision interval.',
      'J = p_f − p_i.',
    ],
    day: 15,
  },
  {
    id: 'momentum-conservation',
    latex: 'm_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}',
    unicode: 'm₁v₁ᵢ + m₂v₂ᵢ = m₁v₁f + m₂v₂f',
    meaning: 'Total momentum conserved in an isolated system.',
    units: 'kg·m/s',
    variables: [
      { symbol: 'm₁, m₂', meaning: 'masses', units: 'kg' },
      { symbol: 'v', meaning: 'velocities', units: 'm/s' },
    ],
    mistakes: [
      'Using momentum conservation when external impulse is significant.',
      'Sign errors for opposite directions.',
    ],
    related: ['impulse', 'collision'],
    derivation: [
      'For isolated system, ΣF_ext = 0.',
      'Then dp_sys/dt = 0 → p_total is constant.',
    ],
    day: 15,
  },
  {
    id: 'moment-inertia',
    latex: 'I = \\int r^{2}\\,dm',
    unicode: 'I = ∫ r² dm',
    meaning: 'Moment of inertia measures rotational resistance to angular acceleration.',
    units: 'kg·m²',
    variables: [
      { symbol: 'I', meaning: 'moment of inertia', units: 'kg·m²' },
      { symbol: 'r', meaning: 'perpendicular distance from axis', units: 'm' },
    ],
    mistakes: [
      'Using wrong axis (parallel-axis theorem needed for offset axes).',
      'Treating I like mass without r² weighting.',
    ],
    related: ['torque', 'rotational-ke'],
    derivation: [
      'Model body as sum of mass elements dm.',
      'Rotational KE of each element: ½(dm)(rω)².',
      'Total I = ∫ r² dm.',
    ],
    day: 17,
  },
  {
    id: 'torque',
    latex: '\\sum \\tau = I\\alpha',
    unicode: 'Στ = Iα',
    meaning: 'Net torque equals moment of inertia times angular acceleration.',
    units: 'N·m, rad/s²',
    variables: [
      { symbol: 'τ', meaning: 'torque', units: 'N·m' },
      { symbol: 'I', meaning: 'moment of inertia', units: 'kg·m²' },
      { symbol: 'α', meaning: 'angular acceleration', units: 'rad/s²' },
    ],
    mistakes: [
      'Using linear F = ma directly for rotation without I.',
      'Wrong lever arm for τ = r × F.',
    ],
    related: ['moment-inertia', 'rotational-ke'],
    derivation: [
      'Start from τ = r × F and a = rα for rigid rotation.',
      'Sum torques: Σ(r × F) = (Σ mr²) α = Iα.',
    ],
    day: 18,
  },
  {
    id: 'rotational-ke',
    latex: 'K_{\\mathrm{rot}} = \\tfrac{1}{2}I\\omega^{2}',
    unicode: 'K_rot = ½Iω²',
    meaning: 'Rotational kinetic energy.',
    units: 'J',
    variables: [
      { symbol: 'ω', meaning: 'angular speed', units: 'rad/s' },
      { symbol: 'I', meaning: 'moment of inertia', units: 'kg·m²' },
    ],
    mistakes: [
      'Forgetting rotational KE in rolling problems.',
      'Using v instead of ω without v = rω.',
    ],
    related: ['moment-inertia', 'torque'],
    derivation: [
      'Integrate ½(dm)(v)² with v = rω.',
      'K_rot = ½ω² ∫ r² dm = ½Iω².',
    ],
    day: 17,
  },
  {
    id: 'spring-energy',
    latex: 'U_s = \\tfrac{1}{2}kx^{2},\\quad F = -kx',
    unicode: 'U_s = ½kx², F = −kx',
    meaning: 'Elastic potential energy and restoring force for a spring.',
    units: 'J, N',
    variables: [
      { symbol: 'k', meaning: 'spring constant', units: 'N/m' },
      { symbol: 'x', meaning: 'displacement from equilibrium', units: 'm' },
    ],
    mistakes: [
      'Using wrong sign for restoring force direction.',
      'Confusing amplitude with maximum displacement from equilibrium.',
    ],
    related: ['shm', 'energy-conservation'],
    derivation: [
      'F(x) = −kx is conservative.',
      'U_s = −∫ F dx = ½kx² + const.',
      'Set U = 0 at x = 0.',
    ],
    day: 19,
  },
  {
    id: 'shm',
    latex: '\\dfrac{d^{2}x}{dt^{2}} = -\\omega^{2}x,\\quad x = A\\cos(\\omega t + \\phi)',
    unicode: 'd²x/dt² = −ω²x, x = A cos(ωt + φ)',
    meaning: 'Simple harmonic motion: acceleration proportional and opposite to displacement.',
    units: 'm, s, rad/s',
    variables: [
      { symbol: 'ω', meaning: 'angular frequency', units: 'rad/s' },
      { symbol: 'A', meaning: 'amplitude', units: 'm' },
      { symbol: 'φ', meaning: 'phase constant', units: 'rad' },
    ],
    mistakes: [
      'Using wrong ω (for spring: ω = √(k/m)).',
      'Confusing period T with angular frequency ω.',
    ],
    related: ['spring-energy', 'derivative'],
    derivation: [
      'From F = −kx and F = ma: m d²x/dt² = −kx.',
      'Rearrange to d²x/dt² = −(k/m)x = −ω²x.',
      'General solution is sinusoidal with angular frequency ω.',
    ],
    day: 19,
  },
]

export const FORMULA_BY_ID = Object.fromEntries(
  FORMULA_EXPLORER.map((f) => [f.id, f]),
) as Record<string, FormulaEntry>

export function searchFormulas(query: string): FormulaEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return FORMULA_EXPLORER
  return FORMULA_EXPLORER.filter(
    (f) =>
      f.id.includes(q) ||
      f.meaning.toLowerCase().includes(q) ||
      f.unicode.toLowerCase().includes(q) ||
      f.latex.toLowerCase().includes(q) ||
      f.variables.some((v) => v.symbol.toLowerCase().includes(q)),
  )
}

export function formulasForDay(day: number): FormulaEntry[] {
  return FORMULA_EXPLORER.filter((f) => f.day === day)
}
