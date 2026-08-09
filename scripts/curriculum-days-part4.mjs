import { dayTitles, mc, num } from './curriculum-helpers.mjs'

export const daysPart4 = [
  {
    day: 16,
    title: dayTitles[15],
    overview:
      'Center of mass averages position weighted by mass — continuous systems use ∫x dm integrals.',
    math: {
      lesson:
        'Discrete: x_cm = (Σ m_i x_i)/(Σ m_i). Continuous rod: x_cm = (1/M)∫ x dm with M = ∫ dm. For uniform density λ = M/L: x_cm at midpoint of symmetric objects.',
      example: {
        prompt: 'Two masses 2 kg at x=0 and 4 kg at x=6 m. Find x_cm.',
        steps: ['x_cm = (2·0 + 4·6)/(2+4)', 'x_cm = 24/6 = 4 m'],
      },
      videos: [
        { title: 'Center of Mass Integrals', url: 'https://www.youtube.com/watch?v=rfG8ce4nNh0', channel: 'Khan Academy' },
        { title: 'Continuous Mass Distribution', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk', channel: 'Professor Leonard' },
      ],
      graph: {
        type: 'function',
        label: 'Linear density λ(x) on a rod',
        expression: '1',
        domain: [0, 4],
        samples: 40,
      },
      problems: [
        mc('d16-m1', 'For symmetric uniform rod, x_cm is at:', ['One end', 'Center', 'Outside object', 'Depends on g'], 'Center', 'Symmetry.', ['Midpoint'], 'Center.'),
        num('d16-m2', '3 kg at x=2, 1 kg at x=10. x_cm?', 4, '(6+10)/4=4.', ['4 m'], '4 m.'),
      ],
    },
    physics: {
      lesson:
        'CM motion follows ΣF_ext = M a_cm. Internal forces cancel in pairs. For systems of particles, track CM for overall translation while rotation may occur about CM.',
      derivation: {
        title: 'Center of Mass for a Continuous Rod',
        steps: [
          'dm = λ dx for linear density λ',
          'M = ∫ dm = ∫ λ dx',
          'x_cm = (1/M) ∫ x λ dx',
          'Uniform λ ⇒ x_cm at geometric center',
        ],
      },
      videos: [
        { title: 'Center of Mass', url: 'https://www.youtube.com/watch?v=4aKbdA6hZOE', channel: 'Flipping Physics' },
        { title: 'Systems of Particles', url: 'https://www.youtube.com/watch?v=4aKbdA6hZOE', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'vector',
        label: 'Two-particle CM location',
        vectors: [
          { x: 2, y: 0, label: 'm1', color: '#2563eb' },
          { x: 8, y: 0, label: 'm2', color: '#dc2626' },
          { x: 5, y: 0, label: 'CM', color: '#16a34a' },
        ],
      },
      problems: [
        mc('d16-p1', 'External force on system accelerates:', ['Each mass separately only', 'Center of mass', 'Only lightest mass', 'Nothing'], 'Center of mass', 'ΣF_ext = Ma_cm.', ['CM motion'], 'Center of mass.'),
        num('d16-p2', 'Uniform rod length 4 m. x_cm from left end (m)?', 2, 'Midpoint.', ['2 m'], '2 m.'),
      ],
    },
    review: {
      quiz: [
        num('d16-q1', '2 kg at 0, 2 kg at 4. x_cm?', 2, 'Average.', ['2 m'], '2 m.'),
        mc('d16-q2', 'Continuous CM uses:', ['Sum only', '(1/M)∫x dm', 'Cross product', 'F=ma only'], '(1/M)∫x dm', 'Integral definition.', ['Weighted average'], '(1/M)∫x dm.'),
        mc('d16-q3', 'Internal forces affect:', ['CM acceleration', 'Relative motion within system', 'g', 'Time'], 'Relative motion within system', 'Cancel for CM.', ['Internal pairs'], 'Internal relative motion.'),
      ],
      takeaways: ['x_cm = Σm_i x_i / M.', 'Continuous: (1/M)∫x dm.', 'CM follows ΣF_ext.', 'Symmetry simplifies CM.'],
    },
  },
  {
    day: 17,
    title: dayTitles[16],
    overview:
      'Moment of inertia I = ∫ r² dm quantifies rotational inertia — it appears in rotational kinetic energy ½Iω².',
    math: {
      lesson:
        'For discrete masses: I = Σ m_i r_i². Continuous: I = ∫ r² dm. Parallel axis theorem: I = I_cm + Md². Units: kg·m².',
      example: {
        prompt: 'Two 2 kg point masses at r = 3 m from axis. Find I.',
        steps: ['I = Σmr²', 'I = 2(2)(3²) = 36 kg·m²'],
      },
      videos: [
        { title: 'Moment of Inertia Integrals', url: 'https://www.youtube.com/watch?v=rfG8ce4nNh0', channel: 'Khan Academy' },
        { title: 'Rotational Inertia', url: 'https://www.youtube.com/watch?v=4aKbdA6hZOE', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'function',
        label: 'r² weighting for rotation',
        expression: 'x^2',
        domain: [0, 3],
        samples: 50,
      },
      problems: [
        mc('d17-m1', 'I depends on:', ['Mass distribution relative to axis', 'Linear velocity only', 'Color', 'Temperature'], 'Mass distribution relative to axis', 'r² weighting.', ['I=∫r²dm'], 'Mass distribution.'),
        num('d17-m2', 'm=3 kg at r=2 m. I (kg·m²)?', 12, 'mr².', ['12'], '12 kg·m².'),
      ],
    },
    physics: {
      lesson:
        'Rotational KE: K_rot = ½Iω². Analogous to K = ½mv². Common values: solid disk I = ½MR²; rod about center I = (1/12)ML²; point mass I = mr².',
      derivation: {
        title: 'Rotational Kinetic Energy from Integration',
        steps: [
          'Each dm has speed v = rω',
          'dK = ½ dm v² = ½ dm r² ω²',
          'Integrate: K_rot = ½ ω² ∫ r² dm = ½Iω²',
          'Total K = K_trans + K_rot for rolling, etc.',
        ],
      },
      videos: [
        { title: 'Moment of Inertia', url: 'https://www.youtube.com/watch?v=4aKbdA6hZOE', channel: 'Flipping Physics' },
        { title: 'Rotational Kinetic Energy', url: 'https://www.youtube.com/watch?v=4aKbdA6hZOE', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'motion',
        label: 'Angular speed ω constant',
        kind: 'velocity',
        expression: '3',
        domain: [0, 4],
      },
      problems: [
        mc('d17-p1', 'Rotational KE formula:', ['½mv²', '½Iω²', 'Iα', 'τr'], '½Iω²', 'Rotational analog.', ['K_rot'], '½Iω².'),
        num('d17-p2', 'I=0.4 kg·m², ω=5 rad/s. K_rot (J)?', 5, '½Iω².', ['0.5(0.4)(25)=5 J'], '5 J.'),
      ],
    },
    review: {
      quiz: [
        num('d17-q1', 'I=2 kg·m², ω=3 rad/s. K_rot?', 9, '½(2)(9)=9.', ['9 J'], '9 J.'),
        mc('d17-q2', 'Point mass m at r gives I:', ['mr', 'mr²', 'm/r', 'r/m'], 'mr²', 'Definition.', ['I=mr²'], 'mr².'),
        mc('d17-q3', 'Parallel axis theorem adds:', ['Md²', 'M/d', 'd/M', 'Zero always'], 'Md²', 'Shift from CM.', ['I=I_cm+Md²'], 'Md².'),
      ],
      takeaways: ['I = ∫ r² dm.', 'K_rot = ½Iω².', 'Mass farther from axis increases I.', 'Parallel axis: I_cm + Md².'],
    },
  },
  {
    day: 18,
    title: dayTitles[17],
    overview:
      'Newton\'s second law for rotation Στ = Iα mirrors ΣF = ma — torque drives angular acceleration.',
    math: {
      lesson:
        'Angular variables: θ, ω = dθ/dt, α = dω/dt. Rotational analog: τ = Iα. Kinematic rotation with constant α: ω = ω₀ + αt, θ = θ₀ + ω₀t + ½αt².',
      example: {
        prompt: 'ω changes from 2 to 8 rad/s in 3 s. Find α.',
        steps: ['α = Δω/Δt', 'α = (8−2)/3 = 2 rad/s²'],
      },
      videos: [
        { title: 'Angular Kinematics', url: 'https://www.youtube.com/watch?v=4aKbdA6hZOE', channel: 'Flipping Physics' },
        { title: 'Derivatives in Rotation', url: 'https://www.youtube.com/watch?v=CFWAbY1EOPI', channel: 'Khan Academy' },
      ],
      graph: {
        type: 'motion',
        label: 'Angular velocity vs. time',
        kind: 'velocity',
        expression: '2 + 2*x',
        domain: [0, 3],
      },
      problems: [
        mc('d18-m1', 'Στ = Iα is rotational:', ['Energy law', 'Second law', 'Momentum', 'Work theorem'], 'Second law', 'Analog of F=ma.', ['τ=Iα'], 'Second law.'),
        num('d18-m2', 'τ=10 N·m, I=2 kg·m². α (rad/s²)?', 5, 'α=τ/I.', ['5 rad/s²'], '5 rad/s².'),
      ],
    },
    physics: {
      lesson:
        'Apply Στ = Iα about a fixed axis. Include torques from all forces. Sign convention: CCW positive often. Rolling without slipping links v = rω and a = rα.',
      derivation: {
        title: 'From τ = rF sin θ to Στ = Iα',
        steps: [
          'Each force contributes torque τ = rF sin θ',
          'Net torque Στ causes angular acceleration',
          'Στ = Iα (fixed axis)',
          'Integrate α to get ω and θ',
        ],
      },
      videos: [
        { title: 'Torque and Angular Acceleration', url: 'https://www.youtube.com/watch?v=4aKbdA6hZOE', channel: 'Flipping Physics' },
        { title: 'Newton\'s Second Law for Rotation', url: 'https://www.youtube.com/watch?v=4aKbdA6hZOE', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'fbd',
        label: 'Disk with applied tangential force',
        forces: [
          { name: 'F', angleDeg: 0, magnitude: 30 },
          { name: 'Pivot', angleDeg: 270, magnitude: 0 },
        ],
      },
      problems: [
        mc('d18-p1', 'Greater I with same τ gives:', ['Larger α', 'Smaller α', 'Same α always', 'Zero ω'], 'Smaller α', 'α = τ/I.', ['Inverse relation'], 'Smaller α.'),
        num('d18-p2', 'I=0.5 kg·m², α=4 rad/s². Net τ (N·m)?', 2, 'τ=Iα.', ['2 N·m'], '2 N·m.'),
      ],
    },
    review: {
      quiz: [
        num('d18-q1', 'ω: 0→10 rad/s in 5 s. α?', 2, 'Δω/Δt.', ['2 rad/s²'], '2 rad/s².'),
        mc('d18-q2', 'Rolling without slipping connects:', ['v and rω', 'F and τ only', 'E and p', 'x and F'], 'v and rω', 'Constraint.', ['v=rω'], 'v and rω.'),
        num('d18-q3', 'τ=6, I=3. α?', 2, 'τ/I.', ['2 rad/s²'], '2 rad/s².'),
      ],
      takeaways: ['Στ = Iα analog of ΣF = ma.', 'α = τ/I.', 'Angular kinematics mirror linear.', 'Rolling links v, ω, a, α.'],
    },
  },
  {
    day: 19,
    title: dayTitles[18],
    overview:
      'Simple harmonic motion satisfies d²x/dt² = −ω²x — sinusoidal solutions bridge second-order DEs and oscillating systems.',
    math: {
      lesson:
        'SHM equation: d²x/dt² = −ω²x. General solution x(t) = A cos(ωt + φ). Period T = 2π/ω. Frequency f = 1/T. Velocity and acceleration found by differentiation.',
      example: {
        prompt: 'Verify x = cos(2t) satisfies d²x/dt² = −4x.',
        steps: ['v = dx/dt = −2 sin(2t)', 'a = dv/dt = −4 cos(2t) = −4x', 'ω = 2 rad/s'],
      },
      videos: [
        { title: 'Second Derivatives and SHM', url: 'https://www.youtube.com/watch?v=CFWAbY1EOPI', channel: 'Khan Academy' },
        { title: 'Differential Equations for Oscillations', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk', channel: 'Professor Leonard' },
      ],
      graph: {
        type: 'shm',
        label: 'x(t) = A cos(ωt)',
        A: 1,
        omega: 2,
        tMax: 6,
      },
      problems: [
        mc('d19-m1', 'SHM acceleration is proportional to:', ['−x', 'x²', 'v', 'constant'], '−x', 'a = −ω²x.', ['Restoring'], '−x.'),
        num('d19-m2', 'ω=4 rad/s. Period T (s)?', 1.57, 'T=2π/ω.', ['≈1.57 s'], '≈1.57 s.', 0.05),
      ],
    },
    physics: {
      lesson:
        'Mass-spring: ω = √(k/m), T = 2π√(m/k). Small-angle pendulum: ω = √(g/L). Energy oscillates between K and U; total E constant for ideal SHM.',
      derivation: {
        title: 'Spring-Mass SHM from F = −kx',
        steps: [
          'F = −kx = ma = m d²x/dt²',
          'd²x/dt² = −(k/m)x',
          'Compare to d²x/dt² = −ω²x ⇒ ω = √(k/m)',
          'x(t) = A cos(ωt + φ) from initial conditions',
        ],
      },
      videos: [
        { title: 'Simple Harmonic Motion', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
        { title: 'Mass-Spring Oscillator', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'shm',
        label: 'Spring-mass oscillation',
        A: 0.2,
        omega: 5,
        tMax: 4,
      },
      problems: [
        mc('d19-p1', 'At equilibrium in spring SHM, acceleration is:', ['Maximum', 'Zero', 'Negative always', 'g'], 'Zero', 'x=0 ⇒ a=0.', ['F=0'], 'Zero.'),
        num('d19-p2', 'k=100 N/m, m=1 kg. ω (rad/s)?', 10, 'ω=√(k/m).', ['10 rad/s'], '10 rad/s.'),
      ],
    },
    review: {
      quiz: [
        mc('d19-q1', 'SHM DE form:', ['dx/dt = x', 'd²x/dt² = −ω²x', 'd²x/dt² = ω²x', 'F = ma only'], 'd²x/dt² = −ω²x', 'Standard SHM.', ['Minus sign'], 'd²x/dt² = −ω²x.'),
        num('d19-q2', 'k=400, m=4. ω?', 10, '√(100).', ['10 rad/s'], '10 rad/s.'),
        mc('d19-q3', 'Maximum speed in SHM occurs at:', ['Amplitude', 'Equilibrium', 'Never', 'Top only'], 'Equilibrium', 'All energy kinetic.', ['x=0, v max'], 'Equilibrium.'),
      ],
      takeaways: ['SHM: d²x/dt² = −ω²x.', 'x = A cos(ωt + φ).', 'Spring: ω = √(k/m).', 'Calculus gives v and a from x(t).'],
    },
  },
  {
    day: 20,
    title: dayTitles[19],
    overview:
      'Capstone review integrates derivatives, integrals, vectors, energy, momentum, rotation, and DEs in AP-style mixed problems.',
    math: {
      lesson:
        'Review toolkit: derivatives (power, product, quotient, chain), integrals (indefinite + definite), vectors (dot/cross), DEs (separable, SHM). Always check units and initial conditions.',
      example: {
        prompt: 'Mixed: find d/dx [sin(x²)] and ∫₀¹ 2x dx.',
        steps: ['Chain rule: cos(x²)·2x', 'Integral: x²|₀¹ = 1'],
      },
      videos: [
        { title: 'Calculus Review', url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM', channel: '3Blue1Brown' },
        { title: 'AP Calculus Applications', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk', channel: 'Professor Leonard' },
      ],
      graph: {
        type: 'area',
        label: 'Review: area under y=2x',
        expression: '2*x',
        domain: [0, 2],
        shadeFrom: 0,
        shadeTo: 1,
      },
      problems: [
        mc(
          'd20-m1',
          'Which rule for d/dx [(3x+1)⁵]?',
          ['Product', 'Chain', 'Quotient', 'Power only'],
          'Chain',
          'Inner linear, outer power.',
          ['Outer: 5u⁴, inner: 3'],
          'Chain rule.'
        ),
        num('d20-m2', '∫₀² x dx?', 2, 'FTC.', ['x²/2|₀²=2'], '2.'),
      ],
    },
    physics: {
      lesson:
        'AP Physics C synthesis: choose method (kinematics, energy, momentum, rotation, DE). Draw FBD. Define system. Conserved quantities when non-conservative work is zero or impulse external only.',
      derivation: {
        title: 'Choosing a Solution Strategy',
        steps: [
          'Identify knowns/unknowns and time interval',
          'Check for conservation (energy, momentum, angular momentum)',
          'If acceleration constant: kinematics',
          'If force varies or calculus needed: integrate or use DE',
        ],
      },
      videos: [
        { title: 'AP Physics C Review', url: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE', channel: 'Flipping Physics' },
        { title: 'Problem-Solving Strategies', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'projectile',
        label: 'Review: projectile trajectory',
        v0: 15,
        angle: 30,
        g: 9.8,
      },
      problems: [
        mc(
          'd20-p1',
          'Block slides down frictionless incline — best quick method for speed at bottom:',
          ['v = v₀ + at only', 'Energy conservation', 'Impulse', 'SHM equation'],
          'Energy conservation',
          'No friction, height known.',
          ['mgh = ½mv²'],
          'Energy conservation.'
        ),
        num(
          'd20-p2',
          'm=2 kg dropped from rest, falls 5 m (g=9.8). Speed at bottom (m/s)?',
          9.9,
          'mgh = ½mv² or v²=2gh.',
          ['v=√(2gh)≈9.9 m/s'],
          '≈9.9 m/s.',
          0.2
        ),
      ],
    },
    review: {
      quiz: [
        mc(
          'd20-q1',
          'Instantaneous velocity is dx/dt. For x=4t² at t=1, v equals:',
          ['4 m/s', '8 m/s', '16 m/s', '2 m/s'],
          '8 m/s',
          'Differentiate x=4t².',
          ['v=8t', 'v(1)=8'],
          '8 m/s.'
        ),
        num(
          'd20-q2',
          'Spring k=200 N/m compressed 0.1 m. Speed of 0.5 kg when released from rest at x=0.1 (m/s)?',
          2,
          '½kx²=½mv².',
          ['v=√(kx²/m)=2 m/s'],
          '2 m/s.',
          0.1
        ),
        mc(
          'd20-q3',
          'Which pair is correct for rotation?',
          ['F=ma, W=Fd', 'τ=Iα, K=½Iω²', 'p=mv, J=Ft', 'F=−kx, U=mg'],
          'τ=Iα, K=½Iω²',
          'Rotational analogs.',
          ['Torque and rotational KE'],
          'τ=Iα, K=½Iω².'
        ),
      ],
      takeaways: [
        'Calculus is the language of AP Physics C.',
        'Pick energy, momentum, or kinematics deliberately.',
        'Integrals give work, impulse, and CM/I.',
        'DEs model drag, Newton II, and SHM.',
        'Always verify units and limiting cases.',
      ],
    },
  },
]
