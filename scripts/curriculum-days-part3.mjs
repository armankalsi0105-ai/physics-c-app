import { dayTitles, mc, num } from './curriculum-helpers.mjs'

export const daysPart3 = [
  {
    day: 11,
    title: dayTitles[10],
    overview:
      'Newton\'s second law as F_net = m dv/dt is a differential equation — free-body diagrams identify the forces that define it.',
    math: {
      lesson:
        'A differential equation relates a function to its derivatives. F = m dv/dt is first-order in v. Separation of variables: rearrange so each side has one variable, then integrate. Initial conditions determine the particular solution.',
      example: {
        prompt: 'Solve dv/dt = 2 with v(0) = 3.',
        steps: ['Integrate both sides: v = 2t + C', 'v(0)=3 ⇒ C=3', 'v(t) = 2t + 3'],
      },
      videos: [
        { title: 'Introduction to Differential Equations', url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM', channel: 'Khan Academy' },
        { title: 'Separable Equations Preview', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk', channel: 'Professor Leonard' },
      ],
      graph: {
        type: 'function',
        label: 'Solution v(t) = 2t + 3',
        expression: '2*x + 3',
        domain: [0, 5],
        samples: 50,
      },
      problems: [
        mc('d11-m1', 'F = m dv/dt is order:', ['0', '1', '2', '3'], '1', 'First derivative of v.', ['One derivative'], 'First order.'),
        num('d11-m2', 'dv/dt=5, v(0)=0. v(4)?', 20, 'Integrate.', ['v=5t', 'v(4)=20'], '20.'),
      ],
    },
    physics: {
      lesson:
        'Draw a free-body diagram (FBD): isolate the object, draw all external forces to scale/direction. Choose axes. Apply ΣF = ma (or ΣF = m dv/dt). Include weight mg, normal, friction, tension as needed.',
      derivation: {
        title: 'Newton\'s Second Law as a DE',
        steps: [
          'Identify all forces on object from FBD',
          'Write ΣF_x and ΣF_y (or along motion direction)',
          'Set ΣF = m dv/dt (or ma)',
          'Solve with initial conditions v(0), x(0)',
        ],
      },
      videos: [
        { title: 'Free Body Diagrams', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
        { title: 'Newton\'s Second Law', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'fbd',
        label: 'Block on incline forces',
        forces: [
          { name: 'mg', angleDeg: 270, magnitude: 50 },
          { name: 'N', angleDeg: 90, magnitude: 43 },
          { name: 'f', angleDeg: 180, magnitude: 15 },
        ],
      },
      problems: [
        mc('d11-p1', 'On a level surface with no friction, horizontal F gives acceleration:', ['F/m', 'm/F', 'F·m', 'Zero'], 'F/m', 'a = F_net/m.', ['ΣF=ma'], 'F/m.'),
        num('d11-p2', 'm=4 kg, F_net=12 N. Acceleration (m/s²)?', 3, 'a=F/m.', ['12/4=3'], '3 m/s².'),
      ],
    },
    review: {
      quiz: [
        mc('d11-q1', 'FBD shows:', ['Internal forces only', 'All external forces on one object', 'Energy', 'Momentum only'], 'All external forces on one object', 'Purpose of FBD.', ['Isolate object'], 'External forces.'),
        num('d11-q2', 'm=2 kg, a=5 m/s². F_net (N)?', 10, 'F=ma.', ['10 N'], '10 N.'),
        mc('d11-q3', 'ΣF = m dv/dt is a:', ['Algebraic equation', 'Differential equation', 'Integral identity', 'Trigonometric law'], 'Differential equation', 'Contains derivative.', ['DE in v'], 'Differential equation.'),
      ],
      takeaways: ['FBDs identify ΣF.', 'Newton II: ΣF = ma = m dv/dt.', 'DEs need initial conditions.', 'Component method simplifies 2D problems.'],
    },
  },
  {
    day: 12,
    title: dayTitles[11],
    overview:
      'Air resistance makes acceleration depend on velocity — separable DEs model approach to terminal speed.',
    math: {
      lesson:
        'Separable DE: g(y) dy/dt = f(t) or h(v) dv/dt = k. Rearrange: h(v) dv = k dt, integrate both sides. Example: dv/dt = −αv has solution v = v₀ e^(−αt).',
      example: {
        prompt: 'Solve dv/dt = −2v with v(0) = 10.',
        steps: ['dv/v = −2 dt', 'ln|v| = −2t + C', 'v = Ae^(−2t)', 'v(0)=10 ⇒ v = 10e^(−2t)'],
      },
      videos: [
        { title: 'Separable Differential Equations', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk', channel: 'Professor Leonard' },
        { title: 'Exponential Decay', url: 'https://www.youtube.com/watch?v=CFWAbY1EOPI', channel: 'Khan Academy' },
      ],
      graph: {
        type: 'function',
        label: 'Exponential decay v = v₀e^(−αt)',
        expression: '10*exp(-0.5*x)',
        domain: [0, 10],
        samples: 60,
      },
      problems: [
        mc('d12-m1', 'Solution to dv/dt = −kv (k>0) behaves as:', ['Linear growth', 'Exponential decay', 'Constant', 'Quadratic'], 'Exponential decay', 'Classic separable form.', ['v=v₀e^(−kt)'], 'Exponential decay.'),
        num('d12-m2', 'v=20e^(−0.5t). v(0)?', 20, 'Plug t=0.', ['e^0=1'], '20.'),
      ],
    },
    physics: {
      lesson:
        'Linear drag: F_drag = −bv. Then m dv/dt = mg − bv. Terminal velocity v_t when dv/dt=0: v_t = mg/b. Object approaches v_t exponentially.',
      derivation: {
        title: 'Terminal Velocity with Linear Drag',
        steps: [
          'Equation: m dv/dt = mg − bv',
          'At terminal speed: 0 = mg − bv_t',
          'v_t = mg/b',
          'General solution approaches v_t as t → ∞',
        ],
      },
      videos: [
        { title: 'Air Resistance and Terminal Velocity', url: 'https://www.youtube.com/watch?v=zm8JIK3_dlk', channel: 'Flipping Physics' },
        { title: 'Drag Force Models', url: 'https://www.youtube.com/watch?v=zm8JIK3_dlk', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'drag',
        label: 'Velocity approaching terminal speed',
        m: 1,
        k: 1.2,
        g: 9.8,
        tMax: 12,
      },
      problems: [
        mc('d12-p1', 'Terminal velocity occurs when:', ['v = 0', 'a = 0', 'F = ma', 't = 0'], 'a = 0', 'No net acceleration.', ['dv/dt=0'], 'Acceleration zero.'),
        num('d12-p2', 'm=2 kg, b=4 N·s/m. v_t = mg/b (m/s)?', 4.9, 'v_t=mg/b.', ['19.6/4=4.9 m/s'], '4.9 m/s.', 0.1),
      ],
    },
    review: {
      quiz: [
        mc('d12-q1', 'Linear drag force opposes:', ['Gravity only', 'Velocity', 'Mass', 'Time'], 'Velocity', 'F∝−v.', ['F=−bv'], 'Velocity.'),
        num('d12-q2', 'm=1, b=2, g=9.8. v_t?', 4.9, 'mg/b.', ['4.9 m/s'], '4.9 m/s.', 0.1),
        mc('d12-q3', 'Separable DEs integrate after:', ['Differentiating twice', 'Separating variables', 'Cross product', 'Graphing only'], 'Separating variables', 'Method name.', ['h(v)dv=k dt'], 'Separating variables.'),
      ],
      takeaways: ['Drag gives velocity-dependent DEs.', 'Terminal speed: mg = bv.', 'Separable form enables integration.', 'v approaches v_t exponentially.'],
    },
  },
  {
    day: 13,
    title: dayTitles[12],
    overview:
      'The work-energy theorem W_net = ΔK connects definite integrals of force to changes in kinetic energy.',
    math: {
      lesson:
        'Work over a path: W = ∫ F(x) dx. If F is constant, W = FΔx. Net work equals change in kinetic energy: W_net = ΔK = ½mv_f² − ½mv_i².',
      example: {
        prompt: 'Compute work ∫₀⁴ 3 dx.',
        steps: ['W = 3x|₀⁴ = 12', 'Constant force 3 N over 4 m'],
      },
      videos: [
        { title: 'Work and Definite Integrals', url: 'https://www.youtube.com/watch?v=rfG8ce4nNh0', channel: 'Khan Academy' },
        { title: 'Fundamental Theorem of Calculus', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk', channel: '3Blue1Brown' },
      ],
      graph: {
        type: 'area',
        label: 'Work as area under F(x)',
        expression: '5',
        domain: [0, 4],
        shadeFrom: 0,
        shadeTo: 4,
      },
      problems: [
        mc('d13-m1', 'W_net = ΔK is the:', ['Work-energy theorem', 'Momentum theorem', 'Hooke\'s law', 'Chain rule'], 'Work-energy theorem', 'Fundamental energy principle.', ['W_net=K_f−K_i'], 'Work-energy theorem.'),
        num('d13-m2', 'm=2 kg, v: 3→7 m/s. ΔK (J)?', 40, 'ΔK=½m(v_f²−v_i²).', ['½(2)(49−9)=40 J'], '40 J.'),
      ],
    },
    physics: {
      lesson:
        'Kinetic energy K = ½mv². Work-energy theorem: all net work changes kinetic energy. Useful when forces are variable or path is curved (with line integral generalization).',
      derivation: {
        title: 'Work-Energy Theorem from Integration',
        steps: [
          'W_net = ∫ F dx along motion',
          'Use F = m dv/dt and dx = v dt',
          'W_net = ∫ m v dv',
          'Integrate: W_net = ½mv_f² − ½mv_i² = ΔK',
        ],
      },
      videos: [
        { title: 'Work-Energy Theorem', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
        { title: 'Kinetic Energy', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'motion',
        label: 'Speed increasing under net work',
        kind: 'velocity',
        expression: 'sqrt(20*t)',
        domain: [0, 5],
      },
      problems: [
        mc('d13-p1', 'Kinetic energy depends on:', ['Velocity squared', 'Position only', 'Time only', 'Force only'], 'Velocity squared', 'K=½mv².', ['v² dependence'], 'Velocity squared.'),
        num('d13-p2', 'W_net=50 J on 5 kg block at rest. Final speed (m/s)?', 4.47, 'K=50=½(5)v².', ['v²=20, v≈4.47'], '≈4.47 m/s.', 0.1),
      ],
    },
    review: {
      quiz: [
        num('d13-q1', 'K for m=4 kg, v=3 m/s (J)?', 18, '½mv².', ['18 J'], '18 J.'),
        mc('d13-q2', 'Positive net work on object:', ['Decreases K', 'Increases K', 'Zeroes mass', 'Stops time'], 'Increases K', 'W_net=ΔK.', ['More K'], 'Increases K.'),
        num('d13-q3', '∫₀² 6 dx (work, J)?', 12, '6x|₀².', ['12 J'], '12 J.'),
      ],
      takeaways: ['W = ∫F dx.', 'W_net = ΔK.', 'K = ½mv².', 'Energy methods avoid time details.'],
    },
  },
  {
    day: 14,
    title: dayTitles[13],
    overview:
      'Potential energy functions store work done by conservative forces — the derivative F = −dU/dx links force to energy landscape.',
    math: {
      lesson:
        'If U(x) is potential energy, conservative force F = −dU/dx. Steeper U means larger force toward lower U. Equilibrium where dU/dx = 0 (F = 0).',
      example: {
        prompt: 'Find F(x) if U(x) = 3x².',
        steps: ['F = −dU/dx', 'dU/dx = 6x', 'F = −6x N (if U in J, x in m)'],
      },
      videos: [
        { title: 'Derivatives and Rates', url: 'https://www.youtube.com/watch?v=CFWAbY1EOPI', channel: 'Khan Academy' },
        { title: 'Potential Energy Graphs', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'force',
        label: 'F = −dU/dx for U = ½kx²',
        expression: '-50*x',
        k: 50,
        domain: [-2, 2],
      },
      problems: [
        mc('d14-m1', 'F = −dU/dx means force points toward:', ['Higher U', 'Lower U', 'Constant U only', 'Zero everywhere'], 'Lower U', 'Negative gradient direction.', ['Downhill on U'], 'Lower U.'),
        num('d14-m2', 'U = 5x². F at x=2 (N)?', -20, 'F=−dU/dx=−10x.', ['−20 N'], '−20 N.'),
      ],
    },
    physics: {
      lesson:
        'Conservative forces: work independent of path; can define U. Gravity near Earth: U_g = mgh. Spring: U_s = ½kx². Mechanical energy E = K + U conserved if only conservative forces do work.',
      derivation: {
        title: 'Conservation of Mechanical Energy',
        steps: [
          'W_cons = −ΔU (work by conservative force)',
          'W_net = ΔK',
          'If W_nc = 0: ΔK + ΔU = 0',
          'K_i + U_i = K_f + U_f',
        ],
      },
      videos: [
        { title: 'Conservative Forces', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
        { title: 'Potential Energy', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'function',
        label: 'Potential energy U = mgh',
        expression: '9.8*x',
        domain: [0, 10],
        samples: 50,
      },
      problems: [
        mc('d14-p1', 'Spring potential energy:', ['mgx', '½kx²', 'Fd', 'mv²'], '½kx²', 'Elastic PE.', ['U_s=½kx²'], '½kx².'),
        num('d14-p2', '2 kg object at h=5 m (g=9.8). U_g (J)?', 98, 'U=mgh.', ['98 J'], '98 J.', 1),
      ],
    },
    review: {
      quiz: [
        mc('d14-q1', 'Mechanical energy conserved when:', ['Friction present', 'Only conservative forces do work', 'Always', 'Never on Earth'], 'Only conservative forces do work', 'No non-conservative work.', ['W_nc=0'], 'Conservative work only.'),
        num('d14-q2', 'U=½(100)(0.3)² J?', 4.5, '½kx².', ['4.5 J'], '4.5 J.', 0.1),
        mc('d14-q3', 'Equilibrium at x₀ if:', ['U=0', 'dU/dx=0 at x₀', 'K=0', 'F maximum'], 'dU/dx=0 at x₀', 'Zero force.', ['F=−U′=0'], 'dU/dx=0.'),
      ],
      takeaways: ['F = −dU/dx.', 'U_s = ½kx², U_g = mgh.', 'Energy conserved without friction.', 'Equilibrium where U′=0.'],
    },
  },
  {
    day: 15,
    title: dayTitles[14],
    overview:
      'Impulse J = ∫F dt equals change in momentum — integrating force over time captures collisions and short bursts.',
    math: {
      lesson:
        'Impulse integral J = ∫_{t₁}^{t₂} F(t) dt. For constant F: J = FΔt. Graphically: area under F–t curve. Momentum p = mv; impulse-momentum: J = Δp.',
      example: {
        prompt: 'Constant F = 10 N for Δt = 0.5 s. Find J.',
        steps: ['J = FΔt', 'J = 10(0.5) = 5 N·s', 'Same as kg·m/s change in momentum'],
      },
      videos: [
        { title: 'Integrals over Time', url: 'https://www.youtube.com/watch?v=rfG8ce4nNh0', channel: 'Khan Academy' },
        { title: 'Area Under Force-Time', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk', channel: 'Professor Leonard' },
      ],
      graph: {
        type: 'impulse',
        label: 'Constant force pulse',
        points: [
          { t: 0, F: 0 },
          { t: 0, F: 20 },
          { t: 0.5, F: 20 },
          { t: 0.5, F: 0 },
        ],
      },
      problems: [
        mc('d15-m1', 'Impulse has units:', ['N/m', 'N·s', 'J/s', 'kg·m/s²'], 'N·s', '∫F dt.', ['Same as momentum'], 'N·s.'),
        num('d15-m2', 'F=8 N for 2 s. J?', 16, 'J=FΔt.', ['16 N·s'], '16 N·s.'),
      ],
    },
    physics: {
      lesson:
        'Impulse-momentum theorem: J = Δp = m(v_f − v_i). Average force: F_avg = Δp/Δt. In collisions, large F over short Δt changes momentum quickly.',
      derivation: {
        title: 'Impulse-Momentum from Newton II',
        steps: [
          'F = dp/dt',
          'Rearrange: F dt = dp',
          'Integrate: ∫F dt = Δp = J',
          'Constant m: J = mΔv',
        ],
      },
      videos: [
        { title: 'Impulse and Momentum', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
        { title: 'Collisions and Impulse', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'impulse',
        label: 'Collision force spike',
        points: [
          { t: 0, F: 0 },
          { t: 0.01, F: 500 },
          { t: 0.02, F: 500 },
          { t: 0.03, F: 0 },
        ],
      },
      problems: [
        mc('d15-p1', 'J = Δp implies impulse changes:', ['Energy only', 'Momentum', 'Mass', 'Gravity'], 'Momentum', 'Impulse-momentum theorem.', ['J=Δp'], 'Momentum.'),
        num('d15-p2', 'm=0.5 kg, Δv=4 m/s. Δp (kg·m/s)?', 2, 'Δp=mΔv.', ['2'], '2 kg·m/s.'),
      ],
    },
    review: {
      quiz: [
        num('d15-q1', 'F=100 N for 0.1 s. J?', 10, 'FΔt.', ['10 N·s'], '10 N·s.'),
        mc('d15-q2', 'Momentum p equals:', ['mv', 'ma', 'Fd', '½mv²'], 'mv', 'Definition.', ['p=mv'], 'mv.'),
        num('d15-q3', 'm=2 kg, v: 5→1 m/s. |Δp|?', 8, 'm|Δv|.', ['8'], '8 kg·m/s.'),
      ],
      takeaways: ['J = ∫F dt = area under F–t.', 'J = Δp.', 'Short collisions ⇒ large peak F.', 'Momentum useful for impact problems.'],
    },
  },
]
