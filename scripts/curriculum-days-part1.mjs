import { dayTitles, mc, num } from './curriculum-helpers.mjs'

export const days = [
  {
    day: 1,
    title: dayTitles[0],
    overview:
      'Slope of a function measures how fast output changes — the same idea as velocity, which is how fast position changes with time.',
    math: {
      lesson:
        'A function f(x) assigns exactly one output to each input. The slope between two points (x₁, y₁) and (x₂, y₂) is m = (y₂ − y₁)/(x₂ − x₁). For a line y = mx + b, m is constant. Average rate of change over [a, b] is (f(b) − f(a))/(b − a).',
      example: {
        prompt: 'Find the slope of y = 3x − 5 between x = 1 and x = 4.',
        steps: [
          'At x = 1: y = 3(1) − 5 = −2',
          'At x = 4: y = 3(4) − 5 = 7',
          'Slope m = (7 − (−2))/(4 − 1) = 9/3 = 3',
        ],
      },
      videos: [
        {
          title: 'What is a Function?',
          url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
          channel: 'Khan Academy',
        },
        {
          title: 'Slope and Rate of Change',
          url: 'https://www.youtube.com/watch?v=ANyVpMS3HL4',
          channel: 'Khan Academy',
        },
      ],
      graph: {
        type: 'function',
        label: 'Linear position function x(t) = 3t − 2',
        expression: '3*x - 2',
        domain: [0, 5],
        samples: 50,
      },
      problems: [
        mc(
          'd1-m1',
          'What is the slope of f(x) = 2x + 7 between x = 0 and x = 5?',
          ['2', '7', '10', '17'],
          '2',
          'For a line, slope equals the coefficient of x.',
          ['Identify two points: (0, 7) and (5, 17)', 'm = (17 − 7)/(5 − 0) = 10/5 = 2'],
          'The slope is 2, matching the coefficient in y = 2x + 7.'
        ),
        num(
          'd1-m2',
          'A car\'s position is x(t) = 4t + 10 (meters). What is its average velocity from t = 0 to t = 6 s?',
          4,
          'Average velocity equals the slope of x vs. t.',
          ['x(0) = 10, x(6) = 34', 'v_avg = (34 − 10)/6 = 24/6 = 4 m/s'],
          'Average velocity is 4 m/s.'
        ),
      ],
    },
    physics: {
      lesson:
        'One-dimensional kinematics describes motion along a straight line. Position x(t) tells where an object is. Displacement Δx = x_f − x_i. Average velocity v_avg = Δx/Δt. For constant velocity, x(t) = x₀ + vt — a linear function of time.',
      derivation: {
        title: 'Position as a Linear Function of Time (Constant Velocity)',
        steps: [
          'Define velocity: v = Δx/Δt for constant v',
          'Rearrange: Δx = v·Δt',
          'Let t₀ = 0: x(t) − x₀ = vt',
          'Therefore x(t) = x₀ + vt',
        ],
      },
      videos: [
        {
          title: 'Introduction to One-Dimensional Kinematics',
          url: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE',
          channel: 'Flipping Physics',
        },
        {
          title: 'Position vs. Time Graphs',
          url: 'https://www.youtube.com/watch?v=ZywWuNWM1uU',
          channel: 'Flipping Physics',
        },
      ],
      graph: {
        type: 'motion',
        label: 'Constant-velocity position vs. time',
        kind: 'position',
        points: [
          { t: 0, y: 0 },
          { t: 1, y: 3 },
          { t: 2, y: 6 },
          { t: 3, y: 9 },
          { t: 4, y: 12 },
        ],
      },
      problems: [
        mc(
          'd1-p1',
          'On a position vs. time graph, what does the slope represent?',
          ['Acceleration', 'Velocity', 'Force', 'Displacement'],
          'Velocity',
          'Slope of x vs. t is Δx/Δt.',
          ['Slope = rise/run = Δx/Δt', 'By definition, Δx/Δt is velocity'],
          'The slope of a position-time graph is velocity.'
        ),
        num(
          'd1-p2',
          'An object moves from x = 2 m to x = 14 m in 4 s. What is its average velocity (m/s)?',
          3,
          'Use v_avg = Δx/Δt.',
          ['Δx = 14 − 2 = 12 m', 'v_avg = 12/4 = 3 m/s'],
          'Average velocity is 3 m/s.'
        ),
      ],
    },
    review: {
      quiz: [
        mc(
          'd1-q1',
          'Which quantity is the slope of a position-time graph?',
          ['Speed only', 'Velocity', 'Acceleration', 'Distance'],
          'Velocity',
          'Slope of x vs. t gives Δx/Δt.',
          ['Δx/Δt defines velocity'],
          'Velocity.'
        ),
        num('d1-q2', 'Find the slope of y = 5x − 1 between x = 2 and x = 6.', 5, 'Use (y₂−y₁)/(x₂−x₁).', ['y(2)=9, y(6)=29', 'm=(29−9)/4=5'], 'Slope is 5.'),
        mc(
          'd1-q3',
          'For constant velocity motion, x(t) is:',
          ['Quadratic in t', 'Linear in t', 'Exponential in t', 'Constant'],
          'Linear in t',
          'x(t) = x₀ + vt is linear.',
          ['v constant ⇒ x(t) = x₀ + vt'],
          'Linear in t.'
        ),
      ],
      takeaways: [
        'Slope of a function equals average rate of change.',
        'Position vs. time slope gives velocity.',
        'Constant velocity ⇒ linear x(t).',
        'Functions connect algebra to motion graphs.',
      ],
    },
  },
  {
    day: 2,
    title: dayTitles[1],
    overview:
      'Limits describe what a function approaches — the calculus foundation for instantaneous velocity at a single moment.',
    math: {
      lesson:
        'The limit of f(x) as x approaches a is the value f(x) gets close to (not necessarily f(a)). Notation: lim(x→a) f(x) = L. Limits let us define the derivative as a limit of difference quotients.',
      example: {
        prompt: 'Estimate lim(x→2) (x² − 4)/(x − 2).',
        steps: [
          'Direct substitution gives 0/0 (indeterminate)',
          'Factor: (x² − 4)/(x − 2) = (x − 2)(x + 2)/(x − 2) = x + 2 for x ≠ 2',
          'As x → 2, x + 2 → 4',
        ],
      },
      videos: [
        {
          title: 'Introduction to Limits',
          url: 'https://www.youtube.com/watch?v=riXcZT2ICjA',
          channel: 'Khan Academy',
        },
        {
          title: 'Epsilon-Delta Intuition',
          url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk',
          channel: '3Blue1Brown',
        },
      ],
      graph: {
        type: 'function',
        label: 'f(x) = x² near x = 2',
        expression: 'x^2',
        domain: [0, 4],
        samples: 50,
      },
      problems: [
        mc(
          'd2-m1',
          'What is lim(x→3) (x² − 9)/(x − 3)?',
          ['0', '3', '6', 'Undefined'],
          '6',
          'Factor the numerator.',
          ['(x−3)(x+3)/(x−3) = x+3', 'As x→3, x+3→6'],
          'The limit is 6.'
        ),
        num('d2-m2', 'Evaluate lim(x→0) (5x)/x.', 5, 'Cancel x for x ≠ 0.', ['5x/x = 5', 'Limit is 5'], 'Limit is 5.'),
      ],
    },
    physics: {
      lesson:
        'Average velocity v_avg = Δx/Δt uses a time interval. Instantaneous velocity at time t is the limit as Δt → 0: v(t) = lim(Δt→0) Δx/Δt = dx/dt. This is the slope of the tangent to the x vs. t curve.',
      derivation: {
        title: 'Instantaneous Velocity from a Limit',
        steps: [
          'Average velocity: v_avg = (x(t + Δt) − x(t))/Δt',
          'Instantaneous velocity: v(t) = lim(Δt→0) [x(t + Δt) − x(t)]/Δt',
          'This limit is the derivative dx/dt',
          'Graphically: tangent slope to x(t) at time t',
        ],
      },
      videos: [
        {
          title: 'Instantaneous Velocity and Limits',
          url: 'https://www.youtube.com/watch?v=ZywWuNWM1uU',
          channel: 'Flipping Physics',
        },
        {
          title: 'Derivatives as Instantaneous Rate of Change',
          url: 'https://www.youtube.com/watch?v=ANyVpMS3HL4',
          channel: 'Khan Academy',
        },
      ],
      graph: {
        type: 'motion',
        label: 'Nonlinear position x(t) = t²',
        kind: 'position',
        expression: 't^2',
        domain: [0, 4],
      },
      problems: [
        mc(
          'd2-p1',
          'Instantaneous velocity at time t equals:',
          ['Δx/Δt for any Δt', 'The limit of Δx/Δt as Δt → 0', 'x/t', 'The average of all velocities'],
          'The limit of Δx/Δt as Δt → 0',
          'Instantaneous means an infinitesimal interval.',
          ['Take Δt → 0 in Δx/Δt'],
          'It is the limit as Δt → 0.'
        ),
        num(
          'd2-p2',
          'For x(t) = t² (SI units), what is the instantaneous velocity at t = 3 s (m/s)?',
          6,
          'v(t) = dx/dt = 2t.',
          ['dx/dt = 2t', 'v(3) = 6 m/s'],
          'Velocity at t = 3 is 6 m/s.'
        ),
      ],
    },
    review: {
      quiz: [
        mc('d2-q1', 'lim(x→1) (x²−1)/(x−1) equals:', ['0', '1', '2', 'Undefined'], '2', 'Factor and cancel.', ['x+1→2'], '2.'),
        num('d2-q2', 'For x(t)=3t², find v(2) in m/s.', 12, 'v=dx/dt=6t.', ['v(2)=12'], '12 m/s.'),
        mc(
          'd2-q3',
          'Instantaneous velocity requires:',
          ['A large Δt', 'A limit as Δt→0', 'Constant acceleration', 'Zero displacement'],
          'A limit as Δt→0',
          'Definition of instantaneous.',
          ['v=lim Δx/Δt'],
          'Limit as Δt→0.'
        ),
      ],
      takeaways: [
        'Limits handle indeterminate forms like 0/0.',
        'Instantaneous velocity is dx/dt.',
        'Tangent slope on x(t) gives velocity at one instant.',
        'Calculus limits formalize "right now" in motion.',
      ],
    },
  },
  {
    day: 3,
    title: dayTitles[2],
    overview:
      'The power rule turns position functions into velocity and acceleration — linking derivatives directly to kinematics.',
    math: {
      lesson:
        'If f(x) = xⁿ, then f′(x) = nxⁿ⁻¹ (power rule). Constant rule: d/dx(c) = 0. Sum rule: derivative of a sum is sum of derivatives. These rules let us differentiate polynomials quickly.',
      example: {
        prompt: 'Find d/dx (4x³ − 2x + 7).',
        steps: [
          'Apply power rule term by term',
          'd/dx(4x³) = 12x²',
          'd/dx(−2x) = −2',
          'd/dx(7) = 0',
          'Result: 12x² − 2',
        ],
      },
      videos: [
        {
          title: 'Power Rule',
          url: 'https://www.youtube.com/watch?v=CFWAbY1EOPI',
          channel: 'Khan Academy',
        },
        {
          title: 'Derivatives of Polynomials',
          url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk',
          channel: 'Professor Leonard',
        },
      ],
      graph: {
        type: 'function',
        label: 'f(x) = x³ and slope changes',
        expression: 'x^3',
        domain: [-2, 2],
        samples: 50,
      },
      problems: [
        mc(
          'd3-m1',
          'What is d/dx (x⁴)?',
          ['4x³', 'x³', '4x', 'x⁴/4'],
          '4x³',
          'Power rule: bring down exponent, reduce by 1.',
          ['nxⁿ⁻¹ with n=4'],
          '4x³.'
        ),
        num('d3-m2', 'Find d/dx (3x²) at x = 2.', 12, 'Derivative is 6x.', ['6(2)=12'], '12.'),
      ],
    },
    physics: {
      lesson:
        'With x(t) known, v(t) = dx/dt and a(t) = dv/dt = d²x/dt². For constant acceleration a, integrating twice gives v(t) = v₀ + at and x(t) = x₀ + v₀t + ½at² — the AP kinematics equations.',
      derivation: {
        title: 'Kinematic Equations from Constant Acceleration',
        steps: [
          'Start with a = constant',
          'Integrate: v(t) = v₀ + at',
          'Integrate again: x(t) = x₀ + v₀t + ½at²',
          'Eliminate t to get v² = v₀² + 2a(x − x₀)',
        ],
      },
      videos: [
        {
          title: 'Uniformly Accelerated Motion',
          url: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE',
          channel: 'Flipping Physics',
        },
        {
          title: 'Kinematic Equations',
          url: 'https://www.youtube.com/watch?v=9TUMmKf5Lfw',
          channel: 'Flipping Physics',
        },
      ],
      graph: {
        type: 'motion',
        label: 'Constant acceleration: x(t) = ½at²',
        kind: 'position',
        expression: '0.5*4*t^2',
        domain: [0, 3],
      },
      problems: [
        mc(
          'd3-p1',
          'If x(t) = 5t², what is a(t)?',
          ['5', '10', '10t', '5t'],
          '10',
          'Differentiate twice.',
          ['v=10t', 'a=10 m/s²'],
          'Acceleration is 10 m/s².'
        ),
        num(
          'd3-p2',
          'A ball starts from rest with a = 3 m/s². How far does it travel in 4 s (m)?',
          24,
          'Use x = ½at² with v₀ = 0.',
          ['x = 0.5(3)(16) = 24 m'],
          '24 m.'
        ),
      ],
    },
    review: {
      quiz: [
        mc('d3-q1', 'd/dx(x⁵) =', ['5x⁴', 'x⁴', '5x⁵', 'x⁵/5'], '5x⁴', 'Power rule.', ['n=5'], '5x⁴.'),
        num('d3-q2', 'For x(t)=2t³, v(1)=?', 6, 'v=6t².', ['v(1)=6'], '6.'),
        mc(
          'd3-q3',
          'Constant acceleration implies x(t) is:',
          ['Linear', 'Quadratic', 'Cubic', 'Exponential'],
          'Quadratic',
          'x ∝ t².',
          ['x=x₀+v₀t+½at²'],
          'Quadratic.'
        ),
      ],
      takeaways: [
        'Power rule: d/dx(xⁿ) = nxⁿ⁻¹.',
        'v = dx/dt, a = dv/dt.',
        'Constant a gives quadratic x(t).',
        'Kinematic equations come from integrating constant a.',
      ],
    },
  },
  {
    day: 4,
    title: dayTitles[3],
    overview:
      'Product and quotient rules handle complex rates of change, while motion graphs connect derivatives to physical meaning.',
    math: {
      lesson:
        'Product rule: (fg)′ = f′g + fg′. Quotient rule: (f/g)′ = (f′g − fg′)/g². Use these when functions are multiplied or divided rather than added.',
      example: {
        prompt: 'Differentiate f(x) = x² · sin(x).',
        steps: [
          'Let u = x², v = sin(x)',
          'u′ = 2x, v′ = cos(x)',
          'f′ = u′v + uv′ = 2x sin(x) + x² cos(x)',
        ],
      },
      videos: [
        {
          title: 'Product Rule',
          url: 'https://www.youtube.com/watch?v=17X5g9QArTc',
          channel: 'Khan Academy',
        },
        {
          title: 'Quotient Rule',
          url: 'https://www.youtube.com/watch?v=17X5g9QArTc',
          channel: 'Khan Academy',
        },
      ],
      graph: {
        type: 'motion',
        label: 'Velocity vs. time (piecewise)',
        kind: 'velocity',
        points: [
          { t: 0, y: 0 },
          { t: 2, y: 4 },
          { t: 4, y: 4 },
          { t: 6, y: 0 },
        ],
      },
      problems: [
        mc(
          'd4-m1',
          'd/dx [x · eˣ] using the product rule equals:',
          ['eˣ', 'x eˣ', 'eˣ(1 + x)', 'x + eˣ'],
          'eˣ(1 + x)',
          'f=x, g=eˣ.',
          ['f′g + fg′ = 1·eˣ + x·eˣ'],
          'eˣ(1 + x).'
        ),
        num('d4-m2', 'If v(t) = 3t², what is a(2) in m/s²?', 12, 'a = dv/dt = 6t.', ['a(2)=12'], '12 m/s².'),
      ],
    },
    physics: {
      lesson:
        'Motion graphs: slope of x–t is v; slope of v–t is a; area under v–t is displacement; area under a–t is Δv. When motion changes regimes, analyze each interval separately.',
      derivation: {
        title: 'From Velocity Graph to Displacement',
        steps: [
          'Displacement Δx = ∫ v(t) dt over an interval',
          'Geometrically: signed area under v–t curve',
          'Constant v ⇒ rectangle area v·Δt',
          'Constant a ⇒ trapezoid/triangle on v–t graph',
        ],
      },
      videos: [
        {
          title: 'Velocity vs. Time Graphs',
          url: 'https://www.youtube.com/watch?v=ZywWuNWM1uU',
          channel: 'Flipping Physics',
        },
        {
          title: 'Acceleration vs. Time Graphs',
          url: 'https://www.youtube.com/watch?v=9TUMmKf5Lfw',
          channel: 'Flipping Physics',
        },
      ],
      graph: {
        type: 'motion',
        label: 'Acceleration vs. time',
        kind: 'acceleration',
        points: [
          { t: 0, y: 2 },
          { t: 3, y: 2 },
          { t: 3, y: -1 },
          { t: 6, y: -1 },
        ],
      },
      problems: [
        mc(
          'd4-p1',
          'Area under a v–t graph gives:',
          ['Acceleration', 'Displacement', 'Force', 'Jerk'],
          'Displacement',
          '∫v dt = Δx.',
          ['Integrate velocity'],
          'Displacement.'
        ),
        num(
          'd4-p2',
          'Constant velocity 5 m/s for 8 s. Displacement (m)?',
          40,
          'Δx = v·t.',
          ['5×8=40 m'],
          '40 m.'
        ),
      ],
    },
    review: {
      quiz: [
        mc('d4-q1', 'Product rule formula:', ['f′g + fg′', 'f′g − fg′', 'f′/g′', 'fg'], 'f′g + fg′', 'Standard product rule.', ['(fg)′=f′g+fg′'], 'f′g + fg′.'),
        mc('d4-q2', 'Slope of v–t graph is:', ['Displacement', 'Acceleration', 'Jerk', 'Position'], 'Acceleration', 'a=dv/dt.', ['Slope=dv/dt=a'], 'Acceleration.'),
        num('d4-q3', 'Area under v=4 from t=0 to t=5 (displacement)?', 20, 'Rectangle area.', ['4×5=20'], '20 m.'),
      ],
      takeaways: [
        'Product/quotient rules extend differentiation.',
        'Graph slopes link x, v, and a.',
        'Area under v–t gives displacement.',
        'Piecewise motion needs interval analysis.',
      ],
    },
  },
  {
    day: 5,
    title: dayTitles[4],
    overview:
      'The chain rule differentiates composed functions — essential for projectile motion where horizontal and vertical components depend on time.',
    math: {
      lesson:
        'Chain rule: if y = f(g(x)), then dy/dx = f′(g(x)) · g′(x). In Leibniz form: dy/dx = (dy/du)(du/dx). Used whenever one function is inside another.',
      example: {
        prompt: 'Find d/dx (3x + 1)⁴.',
        steps: [
          'Outer function u⁴, inner u = 3x + 1',
          'du/dx = 3',
          'd/dx = 4u³ · 3 = 12(3x + 1)³',
        ],
      },
      videos: [
        {
          title: 'Chain Rule',
          url: 'https://www.youtube.com/watch?v=CPnrs2QCvxk',
          channel: 'Khan Academy',
        },
        {
          title: 'Chain Rule Examples',
          url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk',
          channel: 'Professor Leonard',
        },
      ],
      graph: {
        type: 'function',
        label: 'Composite: (x² + 1)³',
        expression: '(x^2 + 1)^3',
        domain: [-2, 2],
        samples: 50,
      },
      problems: [
        mc(
          'd5-m1',
          'd/dx sin(2x) equals:',
          ['cos(2x)', '2 cos(2x)', 'sin(2)', '2 sin(2x)'],
          '2 cos(2x)',
          'Chain rule with inner 2x.',
          ['cos(2x)·2'],
          '2 cos(2x).'
        ),
        num('d5-m2', 'd/dx (x² + 1)² at x=0.', 0, 'Let u=x²+1.', ['f′=2u·2x=4x(x²+1)', 'At x=0: f′=0'], '0.'),
      ],
    },
    physics: {
      lesson:
        'Projectile motion treats horizontal and vertical motion independently. x(t) = v₀ cosθ · t, y(t) = v₀ sinθ · t − ½gt². Acceleration is constant: a_x = 0, a_y = −g. Range R = v₀² sin(2θ)/g.',
      derivation: {
        title: 'Projectile Range Formula',
        steps: [
          'y(t) = v₀ sinθ · t − ½gt²',
          'Set y = 0 for landing: t = 2v₀ sinθ/g',
          'x = v₀ cosθ · t',
          'R = v₀²(2 sinθ cosθ)/g = v₀² sin(2θ)/g',
        ],
      },
      videos: [
        {
          title: 'Projectile Motion',
          url: 'https://www.youtube.com/watch?v=zzuqS5okGdw',
          channel: 'Flipping Physics',
        },
        {
          title: 'Horizontal and Vertical Components',
          url: 'https://www.youtube.com/watch?v=zzuqS5okGdw',
          channel: 'Flipping Physics',
        },
      ],
      graph: {
        type: 'projectile',
        label: 'Projectile at 45°',
        v0: 20,
        angle: 45,
        g: 9.8,
      },
      problems: [
        mc(
          'd5-p1',
          'In projectile motion (no air drag), horizontal acceleration is:',
          ['−g', '0', 'g', 'Depends on angle'],
          '0',
          'Only gravity acts vertically.',
          ['No horizontal force ⇒ a_x=0'],
          'Zero.'
        ),
        num(
          'd5-p2',
          'Ball launched at 10 m/s horizontally from a cliff. After 2 s, vertical drop (m, g=9.8)?',
          19.6,
          'Use y = ½gt².',
          ['y = 0.5(9.8)(4) = 19.6 m'],
          '19.6 m.'
        ),
      ],
    },
    review: {
      quiz: [
        mc('d5-q1', 'Chain rule: d/dx f(g(x)) =', ['f′(x)g′(x)', 'f′(g(x))g′(x)', 'f(g′(x))', 'f′(x)/g′(x)'], 'f′(g(x))g′(x)', 'Standard chain rule.', ['Outer derivative × inner derivative'], 'f′(g(x))g′(x).'),
        mc('d5-q2', 'Projectile horizontal velocity:', ['Increases', 'Decreases', 'Stays constant', 'Zero'], 'Stays constant', 'a_x=0.', ['v_x constant'], 'Constant.'),
        num('d5-q3', 'Range at 45°, v₀=20 m/s, g=9.8 (approx m)?', 40.8, 'R=v₀²/g.', ['400/9.8≈40.8'], '~40.8 m.', 1),
      ],
      takeaways: [
        'Chain rule: derivative of composition.',
        'Projectile components decouple.',
        'Horizontal v constant; vertical has −g.',
        'Range maximized at 45° (level ground).',
      ],
    },
  },
]
