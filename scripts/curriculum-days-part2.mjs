import { dayTitles, mc, num } from './curriculum-helpers.mjs'

export const daysPart2 = [
  {
    day: 6,
    title: dayTitles[5],
    overview:
      'Trigonometry gives the language for angles and components — vectors in physics are built from sine and cosine.',
    math: {
      lesson:
        'SOH-CAH-TOA: sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj. Unit circle: x = cos θ, y = sin θ. Radians: θ(rad) = θ(deg)·π/180. Periodicity and identities like sin²θ + cos²θ = 1 appear throughout physics.',
      example: {
        prompt: 'Find sin(30°) and cos(30°) exactly.',
        steps: ['30° = π/6 radians', 'sin(30°) = 1/2', 'cos(30°) = √3/2'],
      },
      videos: [
        { title: 'Basic Trigonometry', url: 'https://www.youtube.com/watch?v=Jsiy4TxjIME', channel: 'Khan Academy' },
        { title: 'Unit Circle Definition', url: 'https://www.youtube.com/watch?v=cspviRmGPKc', channel: 'Khan Academy' },
      ],
      graph: {
        type: 'function',
        label: 'y = sin(x)',
        expression: 'sin(x)',
        domain: [0, 6.28],
        samples: 80,
      },
      problems: [
        mc('d6-m1', 'cos(60°) equals:', ['1/2', '√3/2', '√2/2', '0'], '1/2', 'Special angle.', ['cos 60° = 1/2'], '1/2.'),
        num('d6-m2', 'Convert 90° to radians.', 1.57, 'Multiply by π/180.', ['90·π/180 = π/2 ≈ 1.57'], 'π/2 ≈ 1.57 rad.', 0.02),
      ],
    },
    physics: {
      lesson:
        'Vectors have magnitude and direction. Resolve into components: A_x = A cos θ, A_y = A sin θ (θ from +x). Add components separately. Unit vectors î and ĵ point along x and y.',
      derivation: {
        title: 'Resolving a Vector into Components',
        steps: [
          'Draw vector A at angle θ from +x axis',
          'Form right triangle with legs A_x and A_y',
          'A_x = A cos θ, A_y = A sin θ',
          'Reconstruct: |A| = √(A_x² + A_y²), θ = tan⁻¹(A_y/A_x)',
        ],
      },
      videos: [
        { title: 'Introduction to Vectors', url: 'https://www.youtube.com/watch?v=wCZ5TkWhj4U', channel: 'Flipping Physics' },
        { title: 'Vector Components', url: 'https://www.youtube.com/watch?v=wCZ5TkWhj4U', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'vector',
        label: 'Force vector at 30°',
        vectors: [
          { x: 8.66, y: 5, label: 'F', color: '#2563eb' },
          { x: 8.66, y: 0, label: 'F_x', color: '#16a34a' },
          { x: 0, y: 5, label: 'F_y', color: '#dc2626' },
        ],
      },
      problems: [
        mc('d6-p1', 'A vector at 0° points:', ['Along +y', 'Along +x', 'Along −x', 'Along −y'], 'Along +x', '0° is +x by convention.', ['Standard angle from +x'], '+x direction.'),
        num('d6-p2', 'Vector magnitude 10 at 37° (cos≈0.8, sin≈0.6). Find A_x.', 8, 'A_x = A cos θ.', ['10(0.8)=8'], 'A_x = 8.'),
      ],
    },
    review: {
      quiz: [
        mc('d6-q1', 'sin²θ + cos²θ =', ['0', '1', 'tanθ', '2'], '1', 'Pythagorean identity.', ['Identity'], '1.'),
        num('d6-q2', 'A=5 at 90°. A_y?', 5, 'sin 90°=1.', ['5(1)=5'], '5.'),
        mc('d6-q3', 'Vector components add:', ['Head to tail only', 'By x and y separately', 'By multiplying magnitudes', 'Only if parallel'], 'By x and y separately', 'Component method.', ['Add A_x+B_x, A_y+B_y'], 'Separately by axis.'),
      ],
      takeaways: ['Trig connects angles to ratios.', 'Vectors decompose via cos and sin.', 'Components simplify 2D problems.', 'Unit circle unifies trig and coordinates.'],
    },
  },
  {
    day: 7,
    title: dayTitles[6],
    overview:
      'The dot product measures alignment of vectors — work is force times displacement in the direction of motion.',
    math: {
      lesson:
        'Dot product: a · b = |a||b| cos θ = a_x b_x + a_y b_y. Result is a scalar. Orthogonal vectors have dot product 0. Projection of a onto b: comp_b(a) = (a·b)/|b|.',
      example: {
        prompt: 'Compute (3, 4) · (1, 0).',
        steps: ['a · b = 3(1) + 4(0) = 3', 'Geometrically: |a||b|cos θ = 5(1)cos θ = 3'],
      },
      videos: [
        { title: 'Dot Product', url: 'https://www.youtube.com/watch?v=LyGKycYT2v0', channel: 'Khan Academy' },
        { title: 'Visualizing Dot Product', url: 'https://www.youtube.com/watch?v=LyGKycYT2v0', channel: '3Blue1Brown' },
      ],
      graph: {
        type: 'vector',
        label: 'Dot product of two vectors',
        vectors: [
          { x: 4, y: 0, label: 'F', color: '#2563eb' },
          { x: 3, y: 3, label: 'd', color: '#dc2626' },
        ],
      },
      problems: [
        mc('d7-m1', '(2,1)·(3,4) equals:', ['10', '6', '8', '5'], '10', 'Multiply and add components.', ['6+4=10'], '10.'),
        num('d7-m2', '|a|=5, |b|=4, θ=60°. a·b? (cos 60°=0.5)', 10, 'a·b=|a||b|cosθ.', ['5·4·0.5=10'], '10.'),
      ],
    },
    physics: {
      lesson:
        'Work by constant force: W = F · d = Fd cos θ, where θ is the angle between F and displacement. Only the parallel component does work. SI unit: joule (J = N·m).',
      derivation: {
        title: 'Work as a Dot Product',
        steps: [
          'Decompose F into parallel and perpendicular to d',
          'Only F_parallel = F cos θ does work',
          'W = F_parallel · d = Fd cos θ',
          'In vector form: W = F · d',
        ],
      },
      videos: [
        { title: 'Work by a Constant Force', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
        { title: 'Dot Product and Work', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'vector',
        label: 'Force at angle to displacement',
        vectors: [
          { x: 6, y: 0, label: 'd', color: '#16a34a' },
          { x: 4, y: 3, label: 'F', color: '#2563eb' },
        ],
      },
      problems: [
        mc('d7-p1', 'Work is zero when force is:', ['Parallel to displacement', 'Perpendicular to displacement', 'Opposite displacement', 'Always nonzero'], 'Perpendicular to displacement', 'cos 90° = 0.', ['F·d=0 when θ=90°'], 'Perpendicular.'),
        num('d7-p2', 'F=20 N, d=5 m, θ=0°. Work (J)?', 100, 'W=Fd cosθ.', ['20·5·1=100 J'], '100 J.'),
      ],
    },
    review: {
      quiz: [
        mc('d7-q1', 'Dot product of orthogonal vectors:', ['1', '0', '−1', 'Undefined'], '0', 'cos 90°=0.', ['Orthogonal ⇒ cosθ=0'], '0.'),
        num('d7-q2', 'F=10 N, d=3 m, θ=90°. Work?', 0, 'cos 90°=0.', ['W=0'], '0 J.'),
        mc('d7-q3', 'Work unit is:', ['Newton', 'Joule', 'Watt', 'Pascal'], 'Joule', 'W = N·m.', ['SI unit J'], 'Joule.'),
      ],
      takeaways: ['Dot product yields a scalar.', 'W = Fd cos θ = F·d.', 'Only parallel force component does work.', 'Orthogonal force does zero work.'],
    },
  },
  {
    day: 8,
    title: dayTitles[7],
    overview:
      'Cross products describe rotation — torque τ = r × F connects lever arm geometry to angular dynamics.',
    math: {
      lesson:
        'Cross product magnitude: |a × b| = |a||b| sin θ. Direction by right-hand rule. In 2D, often use τ = rF sin θ. For î, ĵ, k̂: î×ĵ = k̂. Cross product is anti-commutative: a×b = −b×a.',
      example: {
        prompt: 'Find |a × b| if |a|=3, |b|=4, θ=90°.',
        steps: ['|a×b| = |a||b| sin θ', 'sin 90° = 1', '|a×b| = 12'],
      },
      videos: [
        { title: 'Cross Product', url: 'https://www.youtube.com/watch?v=eu6i7WJeinw', channel: 'Khan Academy' },
        { title: 'Cross Product Intuition', url: 'https://www.youtube.com/watch?v=eu6i7WJeinw', channel: '3Blue1Brown' },
      ],
      graph: {
        type: 'vector',
        label: 'Torque: r and F',
        vectors: [
          { x: 2, y: 0, label: 'r', color: '#16a34a' },
          { x: 0, y: 5, label: 'F', color: '#2563eb' },
        ],
      },
      problems: [
        mc('d8-m1', '|a×b| uses which trig function?', ['cos θ', 'sin θ', 'tan θ', 'sec θ'], 'sin θ', 'Cross product formula.', ['|a||b|sinθ'], 'sin θ.'),
        num('d8-m2', '|a|=6, |b|=2, θ=30° (sin=0.5). |a×b|?', 6, 'Multiply formula.', ['6·2·0.5=6'], '6.'),
      ],
    },
    physics: {
      lesson:
        'Torque τ = r × F has magnitude τ = rF sin θ. r is lever arm from pivot to force application. Torque causes angular acceleration. Sign/direction from right-hand rule.',
      derivation: {
        title: 'Torque Magnitude τ = rF sin θ',
        steps: [
          'Only the perpendicular component of F creates torque',
          'F_perp = F sin θ',
          'τ = r · F_perp = rF sin θ',
          'Maximum when θ = 90°',
        ],
      },
      videos: [
        { title: 'Torque', url: 'https://www.youtube.com/watch?v=4aKbdA6hZOE', channel: 'Flipping Physics' },
        { title: 'Intro to Rotational Motion', url: 'https://www.youtube.com/watch?v=4aKbdA6hZOE', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'fbd',
        label: 'Wrench on a bolt',
        forces: [
          { name: 'F', angleDeg: 90, magnitude: 50 },
          { name: 'Pivot', angleDeg: 0, magnitude: 0 },
        ],
      },
      problems: [
        mc('d8-p1', 'Torque is maximum when force is:', ['Parallel to r', 'Perpendicular to r', 'Through pivot', 'Zero'], 'Perpendicular to r', 'sin 90° = 1.', ['τ=rF sinθ max at 90°'], 'Perpendicular to r.'),
        num('d8-p2', 'r=0.5 m, F=40 N, θ=90°. Torque (N·m)?', 20, 'τ=rF sinθ.', ['0.5·40·1=20 N·m'], '20 N·m.'),
      ],
    },
    review: {
      quiz: [
        mc('d8-q1', 'Cross product result is a:', ['Scalar', 'Vector', 'Matrix', 'Angle'], 'Vector', 'Cross product is vector.', ['a×b is vector'], 'Vector.'),
        num('d8-q2', 'r=2 m, F=10 N, θ=90°. τ?', 20, 'τ=rF.', ['20 N·m'], '20 N·m.'),
        mc('d8-q3', 'Right-hand rule applies to:', ['Dot product only', 'Cross product direction', 'Work sign', 'Gravity'], 'Cross product direction', 'RH rule for a×b.', ['Direction of τ, L'], 'Cross product direction.'),
      ],
      takeaways: ['Cross product uses sin θ.', 'Torque τ = rF sin θ.', 'Perpendicular force maximizes torque.', 'Right-hand rule sets rotation direction.'],
    },
  },
  {
    day: 9,
    title: dayTitles[8],
    overview:
      'Anti-derivatives reverse differentiation — integrate acceleration to recover velocity and position in motion problems.',
    math: {
      lesson:
        'Indefinite integral ∫f(x)dx = F(x) + C where F′(x)=f(x). Power rule reverse: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n≠−1). Always include +C for indefinite integrals.',
      example: {
        prompt: 'Find ∫(6x² + 2) dx.',
        steps: ['∫6x² dx = 2x³', '∫2 dx = 2x', 'Result: 2x³ + 2x + C'],
      },
      videos: [
        { title: 'Introduction to Integration', url: 'https://www.youtube.com/watch?v=rfG8ce4nNh0', channel: 'Khan Academy' },
        { title: 'Antiderivatives', url: 'https://www.youtube.com/watch?v=rfG8ce4nNh0', channel: 'Professor Leonard' },
      ],
      graph: {
        type: 'function',
        label: 'Antiderivative family y = x² + C',
        expression: 'x^2',
        domain: [-3, 3],
        samples: 50,
      },
      problems: [
        mc('d9-m1', '∫3x² dx equals:', ['x³ + C', '6x + C', 'x³', '3x³ + C'], 'x³ + C', 'Reverse power rule.', ['x³/(...)=x³'], 'x³ + C.'),
        num('d9-m2', '∫4 dx from indefinite integral (coefficient of x)?', 4, '∫4 dx = 4x + C.', ['Constant integrates to 4x'], '4x + C; coefficient 4.'),
      ],
    },
    physics: {
      lesson:
        'Given a(t), v(t) = ∫a(t) dt + C_v. Given v(t), x(t) = ∫v(t) dt + C_x. Use initial conditions to find constants. Example: constant a gives v = v₀ + at and x = x₀ + v₀t + ½at².',
      derivation: {
        title: 'Position from Acceleration by Integration',
        steps: [
          'Start with a(t) known',
          'Integrate: v(t) = ∫a(t) dt + C_v, use v(0)=v₀',
          'Integrate: x(t) = ∫v(t) dt + C_x, use x(0)=x₀',
          'Constants fixed by initial conditions',
        ],
      },
      videos: [
        { title: 'Integrating Acceleration', url: 'https://www.youtube.com/watch?v=9TUMmKf5Lfw', channel: 'Flipping Physics' },
        { title: 'From a to v to x', url: 'https://www.youtube.com/watch?v=9TUMmKf5Lfw', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'motion',
        label: 'Velocity from integrating a=2',
        kind: 'velocity',
        expression: '2*t',
        domain: [0, 5],
      },
      problems: [
        mc('d9-p1', 'If a(t)=0, velocity is:', ['Zero', 'Constant', 'Quadratic', 'Undefined'], 'Constant', '∫0 dt = constant.', ['No change in v'], 'Constant.'),
        num('d9-p2', 'a(t)=4 m/s², v₀=0. v(3) in m/s?', 12, 'v=v₀+at.', ['v=4·3=12'], '12 m/s.'),
      ],
    },
    review: {
      quiz: [
        mc('d9-q1', 'Indefinite integrals need:', ['No constant', '+C', 'Limits', 'Units only'], '+C', 'Family of antiderivatives.', ['+C for general solution'], '+C.'),
        num('d9-q2', 'a=6, v₀=2. v(1)?', 8, 'v=v₀+at.', ['2+6=8'], '8 m/s.'),
        mc('d9-q3', 'x(t) from v(t) requires:', ['Differentiation', 'Integration', 'Cross product', 'Division'], 'Integration', 'x=∫v dt.', ['Integrate velocity'], 'Integration.'),
      ],
      takeaways: ['Antiderivatives reverse derivatives.', '∫xⁿ dx = xⁿ⁺¹/(n+1)+C.', 'Integrate a→v→x with ICs.', 'Calculus solves motion from acceleration.'],
    },
  },
  {
    day: 10,
    title: dayTitles[9],
    overview:
      'Definite integrals compute area and net work — Hooke\'s law F=−kx makes spring work a classic integral application.',
    math: {
      lesson:
        'Definite integral ∫ₐᵇ f(x) dx = F(b) − F(a) (FTC). Geometrically: signed area under curve. Units: (function units)·(x units).',
      example: {
        prompt: 'Evaluate ∫₀² x dx.',
        steps: ['Antiderivative: x²/2', 'F(2) − F(0) = 2 − 0 = 2', 'Area of triangle under y=x from 0 to 2'],
      },
      videos: [
        { title: 'Definite Integrals', url: 'https://www.youtube.com/watch?v=rfG8ce4nNh0', channel: 'Khan Academy' },
        { title: 'Area Under Curves', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk', channel: '3Blue1Brown' },
      ],
      graph: {
        type: 'area',
        label: 'Area under y = x from 0 to 2',
        expression: 'x',
        domain: [0, 3],
        shadeFrom: 0,
        shadeTo: 2,
      },
      problems: [
        mc('d10-m1', '∫₀¹ 2x dx equals:', ['0', '1', '2', '4'], '1', 'FTC: x²|₀¹.', ['1²−0=1'], '1.'),
        num('d10-m2', '∫₀³ 4 dx?', 12, '4x|₀³.', ['12'], '12.'),
      ],
    },
    physics: {
      lesson:
        'Hooke\'s law: F = −kx (restoring force). Work to stretch from x₁ to x₂: W = ∫ F dx = ½kx₂² − ½kx₁². For stretch from equilibrium: W = ½kx².',
      derivation: {
        title: 'Spring Work W = ½kx²',
        steps: [
          'F(x) = kx (magnitude for stretch)',
          'W = ∫₀ˣ kx dx',
          'Antiderivative: kx²/2',
          'W = ½kx²',
        ],
      },
      videos: [
        { title: 'Hooke\'s Law and Springs', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
        { title: 'Work by Variable Force', url: 'https://www.youtube.com/watch?v=2WS1s1fdypU', channel: 'Flipping Physics' },
      ],
      graph: {
        type: 'force',
        label: 'Spring force F = −kx',
        expression: '-k*x',
        k: 50,
        domain: [-2, 2],
      },
      problems: [
        mc('d10-p1', 'Spring force is proportional to:', ['Velocity', 'Displacement from equilibrium', 'Time', 'Mass'], 'Displacement from equilibrium', 'F=−kx.', ['Hooke\'s law'], 'Displacement.'),
        num('d10-p2', 'k=200 N/m, stretch x=0.1 m. Elastic PE (J)?', 1, 'U=½kx².', ['0.5(200)(0.01)=1 J'], '1 J.'),
      ],
    },
    review: {
      quiz: [
        mc('d10-q1', '∫ₐᵇ f(x)dx geometrically is:', ['Slope', 'Signed area', 'Volume', 'Curvature'], 'Signed area', 'Definite integral interpretation.', ['Area under curve'], 'Signed area.'),
        num('d10-q2', 'k=100, x=0.2 m. U=½kx² (J)?', 2, 'Substitute.', ['0.5(100)(0.04)=2'], '2 J.'),
        mc('d10-q3', 'Hooke\'s law sign indicates:', ['Always positive force', 'Restoring toward equilibrium', 'Gravity', 'Friction'], 'Restoring toward equilibrium', 'F opposes displacement.', ['F=−kx'], 'Restoring force.'),
      ],
      takeaways: ['Definite integrals give net area/work.', 'FTC: F(b)−F(a).', 'Spring work W=½kx².', 'Variable forces need integration.'],
    },
  },
]
