export type Flashcard = {
  id: string
  day: number
  front: string
  back: string
  category: 'formula' | 'calculus' | 'concept'
}

/** Core flashcards aligned to each day's curriculum title/topics. */
export const FLASHCARDS: Flashcard[] = [
  { id: 'd1-1', day: 1, category: 'formula', front: 'Slope between two points', back: 'm = (y₂ − y₁)/(x₂ − x₁)' },
  { id: 'd1-2', day: 1, category: 'formula', front: 'Average velocity', back: 'v_avg = Δx / Δt' },
  { id: 'd1-3', day: 1, category: 'concept', front: 'What is the slope of an x–t graph?', back: 'Average velocity over that interval.' },
  { id: 'd2-1', day: 2, category: 'calculus', front: 'Limit definition of derivative', back: "f'(x) = lim_{h→0} [f(x+h) − f(x)] / h" },
  { id: 'd2-2', day: 2, category: 'formula', front: 'Instantaneous velocity', back: 'v(t) = lim_{Δt→0} Δx/Δt = dx/dt' },
  { id: 'd2-3', day: 2, category: 'concept', front: 'Secant vs tangent on x–t', back: 'Secant = average velocity; tangent = instantaneous velocity.' },
  { id: 'd3-1', day: 3, category: 'calculus', front: 'Power rule', back: 'd/dx [x^n] = n x^{n−1}' },
  { id: 'd3-2', day: 3, category: 'formula', front: 'v and a from x(t)', back: 'v = dx/dt ; a = dv/dt = d²x/dt²' },
  { id: 'd3-3', day: 3, category: 'formula', front: 'Constant-a kinematics', back: 'v = v₀ + at ; x = x₀ + v₀t + ½at² ; v² = v₀² + 2aΔx' },
  { id: 'd4-1', day: 4, category: 'calculus', front: 'Product rule', back: '(uv)′ = u′v + uv′' },
  { id: 'd4-2', day: 4, category: 'calculus', front: 'Quotient rule', back: '(u/v)′ = (u′v − uv′)/v²' },
  { id: 'd4-3', day: 4, category: 'concept', front: 'Area under v–t graph', back: 'Equals displacement (signed Δx).' },
  { id: 'd5-1', day: 5, category: 'calculus', front: 'Chain rule', back: 'd/dx [f(g(x))] = f′(g(x)) · g′(x)' },
  { id: 'd5-2', day: 5, category: 'formula', front: 'Projectile range (level)', back: 'R = (v₀² sin 2θ)/g' },
  { id: 'd5-3', day: 5, category: 'concept', front: 'Independence of axes', back: 'Horizontal: a≈0; vertical: a=−g. Treat separately.' },
  { id: 'd6-1', day: 6, category: 'formula', front: 'Vector components', back: 'A_x = |A| cosθ ; A_y = |A| sinθ' },
  { id: 'd6-2', day: 6, category: 'formula', front: 'Magnitude from components', back: '|A| = √(A_x² + A_y²)' },
  { id: 'd6-3', day: 6, category: 'concept', front: 'Adding vectors', back: 'Add components: R_x = A_x + B_x, then rebuild magnitude/angle.' },
  { id: 'd7-1', day: 7, category: 'formula', front: 'Dot product', back: 'A·B = |A||B|cosθ = A_xB_x + A_yB_y' },
  { id: 'd7-2', day: 7, category: 'formula', front: 'Work (constant force)', back: 'W = F·Δr = |F||Δr|cosθ' },
  { id: 'd7-3', day: 7, category: 'concept', front: 'When is A·B = 0?', back: 'Vectors are perpendicular.' },
  { id: 'd8-1', day: 8, category: 'formula', front: 'Cross product magnitude', back: '|A×B| = |A||B|sinθ' },
  { id: 'd8-2', day: 8, category: 'formula', front: 'Torque', back: 'τ = r × F ; |τ| = r F sinθ' },
  { id: 'd8-3', day: 8, category: 'concept', front: 'Direction of A×B', back: 'Right-hand rule; perpendicular to both A and B.' },
  { id: 'd9-1', day: 9, category: 'calculus', front: '∫ x^n dx (n ≠ −1)', back: 'x^{n+1}/(n+1) + C' },
  { id: 'd9-2', day: 9, category: 'formula', front: 'v from constant a', back: 'v = v₀ + at' },
  { id: 'd9-3', day: 9, category: 'concept', front: 'Antiderivative + initial condition', back: 'Fix +C (or limits) with a known state at a time.' },
  { id: 'd10-1', day: 10, category: 'formula', front: 'FTC net change', back: '∫_a^b f′(x) dx = f(b) − f(a)' },
  { id: 'd10-2', day: 10, category: 'formula', front: 'Work by variable force', back: 'W = ∫ F(x) dx' },
  { id: 'd10-3', day: 10, category: 'formula', front: 'Spring work (Hooke)', back: 'W = ∫_0^x kx dx = ½kx²' },
  { id: 'd11-1', day: 11, category: 'formula', front: 'Newton’s 2nd law', back: 'ΣF = ma = m dv/dt' },
  { id: 'd11-2', day: 11, category: 'concept', front: 'Free-body diagram tip', back: 'Draw every force on ONE object; write ΣF components.' },
  { id: 'd11-3', day: 11, category: 'formula', front: 'Weight near Earth', back: 'W = mg (downward)' },
  { id: 'd12-1', day: 12, category: 'formula', front: 'Linear drag', back: 'F_d = −bv' },
  { id: 'd12-2', day: 12, category: 'formula', front: 'Terminal speed (linear drag)', back: 'v_t = mg/b' },
  { id: 'd12-3', day: 12, category: 'concept', front: 'Separable DE idea', back: 'dv/dt = f(v) ⇒ ∫ dv/f(v) = ∫ dt' },
  { id: 'd13-1', day: 13, category: 'formula', front: 'Work–energy theorem', back: 'W_net = ΔK = ½mv² − ½mv₀²' },
  { id: 'd13-2', day: 13, category: 'formula', front: 'Power', back: 'P = dW/dt = F·v' },
  { id: 'd13-3', day: 13, category: 'concept', front: 'When energy beats ΣF', back: 'Need speeds or path-independent work — skip force components.' },
  { id: 'd14-1', day: 14, category: 'formula', front: 'Force from potential', back: 'F = −dU/dx (1D)' },
  { id: 'd14-2', day: 14, category: 'formula', front: 'Mechanical energy (conservative)', back: 'K + U = constant' },
  { id: 'd14-3', day: 14, category: 'formula', front: 'Spring potential', back: 'U_s = ½kx²' },
  { id: 'd15-1', day: 15, category: 'formula', front: 'Impulse', back: 'J = ∫ F dt = Δp' },
  { id: 'd15-2', day: 15, category: 'formula', front: 'Momentum', back: 'p = mv' },
  { id: 'd15-3', day: 15, category: 'concept', front: 'Impulse–momentum', back: 'Area under F–t equals Δp.' },
  { id: 'd16-1', day: 16, category: 'formula', front: 'CM discrete', back: 'x_cm = (Σ m_i x_i) / M' },
  { id: 'd16-2', day: 16, category: 'formula', front: 'CM continuous', back: 'x_cm = (1/M) ∫ x dm' },
  { id: 'd16-3', day: 16, category: 'concept', front: 'Why CM matters', back: 'External forces accelerate the CM as if all mass were there.' },
  { id: 'd17-1', day: 17, category: 'formula', front: 'Moment of inertia', back: 'I = ∫ r² dm' },
  { id: 'd17-2', day: 17, category: 'formula', front: 'Rotational KE', back: 'K_rot = ½ I ω²' },
  { id: 'd17-3', day: 17, category: 'concept', front: 'I depends on axis', back: 'Different axis ⇒ different I (parallel-axis theorem).' },
  { id: 'd18-1', day: 18, category: 'formula', front: 'Newton’s 2nd for rotation', back: 'Στ = Iα' },
  { id: 'd18-2', day: 18, category: 'formula', front: 'Rolling without slip', back: 'v = rω ; a = rα' },
  { id: 'd18-3', day: 18, category: 'concept', front: 'Choose rotation axis wisely', back: 'Pick an axis that kills unknown forces (zero torque).' },
  { id: 'd19-1', day: 19, category: 'formula', front: 'SHM DE', back: 'd²x/dt² = −ω² x' },
  { id: 'd19-2', day: 19, category: 'formula', front: 'Spring–mass ω', back: 'ω = √(k/m) ; T = 2π/ω' },
  { id: 'd19-3', day: 19, category: 'concept', front: 'Energy in SHM', back: 'Between ½kx² and ½mv²; E = ½kA².' },
  { id: 'd20-1', day: 20, category: 'concept', front: 'AP FRQ opening move', back: 'Name the principle before algebra.' },
  { id: 'd20-2', day: 20, category: 'concept', front: 'Limiting-case check', back: 'Set μ→0 or m→0; nonsense ⇒ algebra bug.' },
  { id: 'd20-3', day: 20, category: 'formula', front: 'Toolkit reminder', back: 'FBD · Energy · Momentum · Rotation · SHM' },
]

export function flashcardsForDay(day: number): Flashcard[] {
  return FLASHCARDS.filter((c) => c.day === day)
}
