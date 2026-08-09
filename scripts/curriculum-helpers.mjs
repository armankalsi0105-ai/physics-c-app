export const dayTitles = [
  'Functions, Slopes & One-Dimensional Kinematics (Position vs. Time)',
  'Introduction to Limits & Instantaneous Velocity',
  'The Power Rule for Derivatives & Acceleration Equations',
  'Derivative Rules (Product & Quotient) & Advanced Motion Graphs',
  'The Chain Rule & 2D Kinematics (Projectile Motion)',
  'Trig Functions & Vector Components in Physics',
  'Vector Dot Products & Work Done by a Constant Force',
  'Vector Cross Products, Torque & Rotational Motion Setup',
  'Introduction to Anti-Derivatives (Indefinite Integrals) & Finding Position from Acceleration',
  'Definite Integrals, Area Under Curves & Work Done by Variable Forces (Hooke\'s Law)',
  'Free-Body Diagrams, Newton\'s 2nd Law & Differential Equations (F_net = m dv/dt)',
  'Terminal Velocity & Separable Differential Equations (v(t) with Air Resistance)',
  'Work-Energy Theorem & Definite Integrals of Force',
  'Conservative Forces & Potential Energy Functions (F = -dU/dx)',
  'Impulse, Momentum & Integrals of Force over Time (∫ F dt)',
  'Center of Mass for Discrete & Continuous Systems ((1/M)∫ x dm)',
  'Moment of Inertia & Rotational Kinetic Energy (∫ r² dm)',
  'Torque & Angular Acceleration (Στ = Iα)',
  'Simple Harmonic Motion & Differential Equations (d²x/dt² = -ω²x)',
  'Comprehensive Review & Full AP-Style Mixed Calculus-Physics Practice',
]

export function mc(id, prompt, options, answer, hint, steps, solution) {
  return { id, prompt, type: 'mc', options, answer, hint, steps, solution }
}

export function num(id, prompt, answer, hint, steps, solution, tolerance = 0.05) {
  return { id, prompt, type: 'numeric', answer, tolerance, hint, steps, solution }
}
