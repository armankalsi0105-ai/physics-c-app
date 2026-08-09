/**
 * Real-world scenes that make each day’s abstract idea feel concrete.
 * Shown before math so students know *why* the tool exists.
 */

export type RealWorldScene = {
  /** Short label, e.g. "Highway merge" */
  scene: string
  /** Concrete story students can picture */
  story: string
  /** What the math/physics extracts from that story */
  takeaway: string
}

export type DayRealWorld = {
  hook: string
  scenes: RealWorldScene[]
  /** One “try this in your head” thought experiment */
  tryThis: string
  /** Plain-language intuition before symbols */
  intuition: string
}

const DEFAULT: DayRealWorld = {
  hook: 'Before symbols: picture a real situation where today’s idea shows up.',
  scenes: [
    {
      scene: 'Everyday motion',
      story:
        'Anything that speeds up, slows down, turns, or collides is governed by the same toolkit you are building.',
      takeaway: 'Today’s math is a measuring tool for change in the physical world.',
    },
  ],
  tryThis:
    'Name one thing you saw today that moved. What quantity would you measure first — position, speed, or force?',
  intuition:
    'If you can describe the situation in ordinary words, the formula is just a compressed version of that description.',
}

export const DAY_REAL_WORLD: Record<number, DayRealWorld> = {
  1: {
    hook: 'Slope is how fast something changes — not how “steep” a hill looks on paper.',
    scenes: [
      {
        scene: 'Highway odometer',
        story:
          'You pass mile marker 40 at 2:00 and mile marker 100 at 3:00. In one hour you covered 60 miles.',
        takeaway: 'Δx / Δt = 60 mi/h — that is average velocity, the slope of your x–t graph.',
      },
      {
        scene: 'Phone battery drain',
        story:
          'Battery goes from 80% to 20% over 3 hours of scrolling. The “slope” of % vs time is how fast charge is leaving.',
        takeaway: 'Same math as velocity: rise over run. Only the labels change.',
      },
    ],
    tryThis:
      'Walk across a room in ~4 seconds. Estimate Δx and Δt, then your average speed. Does that number feel right?',
    intuition:
      'Average rate = total change ÷ total time. Instantaneous rate comes later when the interval shrinks.',
  },
  2: {
    hook: 'Instantaneous speed is what your speedometer shows at one glance — not over a whole trip.',
    scenes: [
      {
        scene: 'Speedometer vs trip computer',
        story:
          'Your car’s trip computer says 55 mph average for the last hour. The needle right now says 72 mph as you pass a sign.',
        takeaway: 'Average = whole interval. Instantaneous = limit as the interval shrinks to “now.”',
      },
      {
        scene: 'Zooming into a curve',
        story:
          'On a winding trail map, a long chord looks shallow. Zoom in near one point and the tiny chord looks like a tangent.',
        takeaway: 'A limit is formal language for that zoom.',
      },
    ],
    tryThis:
      'Imagine filming yourself walking, then freezing one frame. What would “velocity at that frame” mean?',
    intuition:
      'A tangent is the best straight-line approximation at one point. Physics calls that slope instantaneous velocity.',
  },
  3: {
    hook: 'Derivatives turn “where you are” into “how you’re moving” and “how that motion is changing.”',
    scenes: [
      {
        scene: 'Elevator ride',
        story:
          'Position rises with time. Velocity is how fast the floor numbers blur. Acceleration is that stomach-drop feeling when it starts or stops.',
        takeaway: 'x → v = dx/dt → a = dv/dt. Same function, differentiated twice.',
      },
      {
        scene: 'Free throw arc',
        story:
          'A basketball’s height vs time is a parabola. Velocity is zero at the peak; acceleration is still downward the whole time.',
        takeaway: 'Zero velocity ≠ zero acceleration. Derivatives keep those ideas separate.',
      },
    ],
    tryThis:
      'Sketch height vs time for a ball you toss up. Mark where v = 0 and where a points down.',
    intuition:
      'The power rule is a factory: feed it a polynomial position, get velocity and acceleration out.',
  },
  4: {
    hook: 'Area under a graph is accumulated change — miles traveled, impulse delivered, work done.',
    scenes: [
      {
        scene: 'Cruise control then brake',
        story:
          'On a v–t graph: flat section at 60 mph, then a ramp down to 0. Area under the curve is how far you traveled while slowing.',
        takeaway: '∫ v dt = Δx. Geometry (area) equals net change in position.',
      },
      {
        scene: 'Charging a phone',
        story:
          'Current (charge per second) plotted vs time: the area is total charge delivered to the battery.',
        takeaway: 'Integral = total accumulated quantity from a rate.',
      },
    ],
    tryThis:
      'If speed is constant 10 m/s for 5 s, what area is under the v–t graph? What distance is that?',
    intuition:
      'Derivative asks “how fast right now?” Integral asks “how much piled up over an interval?”',
  },
  5: {
    hook: 'Chain rule is “rates stacked” — like gears: turn the first, the last spins at a product of factors.',
    scenes: [
      {
        scene: 'Robot arm',
        story:
          'A joint angle θ(t) changes, and the hand’s height depends on θ. Hand speed needs both d(height)/dθ and dθ/dt.',
        takeaway: 'dy/dt = (dy/du)(du/dt). Compose the dependencies.',
      },
      {
        scene: 'Shadow of a walking person',
        story:
          'You walk away from a lamp; shadow length depends on your position, which depends on time.',
        takeaway: 'Related rates problems are chain rule in costume.',
      },
    ],
    tryThis:
      'Say out loud: “y depends on u, u depends on t — so y’s rate is product of both rates.”',
    intuition:
      'Never differentiate a composition as if the inside were a constant — peel the onion layer by layer.',
  },
  6: {
    hook: 'Product rule: when two changing things multiply, both rates matter (like mass × velocity = momentum).',
    scenes: [
      {
        scene: 'Rocket losing fuel',
        story:
          'Momentum p = mv. A rocket’s mass drops while speed rises — dp/dt needs both ṁ and v̇.',
        takeaway: 'd(uv)/dt = u′v + uv′. Two terms, two stories.',
      },
      {
        scene: 'Growing crowd × ticket price',
        story:
          'Revenue = (people)(price). If both change with time, revenue’s rate isn’t “just one derivative.”',
        takeaway: 'Same algebra as product rule in calculus class.',
      },
    ],
    tryThis:
      'If m is constant, what does product rule say about dp/dt? (You should recover F = ma.)',
    intuition:
      'Ask: “Which factors are changing?” Every changing factor gets its own term.',
  },
  7: {
    hook: 'Vectors carry direction — wind, shove, and displacement are not just numbers.',
    scenes: [
      {
        scene: 'Swimming across a river',
        story:
          'You aim straight across; the current pushes downstream. Your velocity relative to ground is the vector sum.',
        takeaway: 'Add components: v_x and v_y separately, then rebuild the resultant.',
      },
      {
        scene: 'Phone GPS step',
        story:
          'Walking NE is not “north speed plus east speed” as a single number — it’s a resultant magnitude and angle.',
        takeaway: 'Magnitude from Pythagoras; direction from tan⁻¹(v_y/v_x) with quadrant care.',
      },
    ],
    tryThis:
      'Point two fingers at right angles. Your “resultant” is the diagonal of the parallelogram they suggest.',
    intuition:
      'Break → compute → rebuild. Never add magnitudes of non-parallel vectors blindly.',
  },
  8: {
    hook: 'Newton’s laws are about forces as causes of acceleration — not “motion needs a force.”',
    scenes: [
      {
        scene: 'Hockey puck on ice',
        story:
          'After you shove it, it keeps sliding with nearly constant velocity. Net force ≈ 0, yet it still moves.',
        takeaway: 'ΣF = 0 ⇒ a = 0, not v = 0. Force changes velocity; it doesn’t “pay for” motion.',
      },
      {
        scene: 'Elevator scale reading',
        story:
          'Standing on a scale in an elevator: when the cabin accelerates up, the scale reads heavier.',
        takeaway: 'Apparent weight is the normal force — solve ΣF = ma carefully with a chosen + direction.',
      },
    ],
    tryThis:
      'Sitting still in a chair: list forces. Why is a = 0 even though gravity pulls?',
    intuition:
      'Draw the free-body diagram before any algebra. Wrong forces → wrong movie of the motion.',
  },
  9: {
    hook: 'Friction isn’t “always μN opposite motion” — static can be less than max; kinetic is during slip.',
    scenes: [
      {
        scene: 'Pushing a fridge',
        story:
          'You push harder and harder; it doesn’t move until static friction maxes out. Then it suddenly slides.',
        takeaway: 'f_s ≤ μ_s N (inequality). Only kinetic uses f_k = μ_k N while sliding.',
      },
      {
        scene: 'Banked curve / tires',
        story:
          'Tires grip the road so your car can turn. That sideways friction supplies centripetal force (with banking help).',
        takeaway: 'Friction direction is “whatever prevents slipping” — not always opposite velocity.',
      },
    ],
    tryThis:
      'Rest a book on a tilted binder. Increase the angle until it slips. That’s μ_s in action.',
    intuition:
      'Ask first: slipping or not? That chooses static vs kinetic and whether equality holds.',
  },
  10: {
    hook: 'Work–energy turns forces along a path into a budget: energy in, energy out, energy stored.',
    scenes: [
      {
        scene: 'Roller coaster',
        story:
          'At the top you have gravitational PE. At the bottom that PE has become KE (minus friction losses).',
        takeaway: 'W_nc = ΔME. Conservative forces hide inside PE; friction shows up as work.',
      },
      {
        scene: 'Braking a bike',
        story:
          'Brake pads do negative work; kinetic energy drops. Stopping distance grows with v².',
        takeaway: 'Energy accounting explains why doubling speed needs ~4× the stopping work.',
      },
    ],
    tryThis:
      'Drop a phone onto a pillow vs a table (carefully!). Same ΔPE — different force over distance.',
    intuition:
      'If you hate integrating F·dr along a messy path, switch to energy when forces are nice.',
  },
  11: {
    hook: 'Momentum is “inertia in motion.” Collisions care about ΣF_ext ≈ 0 ⇒ p conserved.',
    scenes: [
      {
        scene: 'Ice skaters pushing off',
        story:
          'Two skaters push apart. They move opposite ways; total momentum stays ~0 if they started at rest.',
        takeaway: 'Internal forces cancel in pairs; external net force ≈ 0 ⇒ p conserved.',
      },
      {
        scene: 'Car crash crumple zone',
        story:
          'Same Δp to stop you, but a longer crumple time means smaller average force (impulse = FΔt = Δp).',
        takeaway: 'Airbags trade time for force. Impulse is the bridge.',
      },
    ],
    tryThis:
      'Catch a water balloon softly vs stiff-armed. Same Δp — which hurts less, and why?',
    intuition:
      'Before algebra: isolated system? Elastic or inelastic? 1D or 2D components?',
  },
  12: {
    hook: 'Circular motion needs a center-pointing acceleration — something must pull or push inward.',
    scenes: [
      {
        scene: 'Car on a roundabout',
        story:
          'Even at constant speed you feel “thrown out.” That’s your inertia; friction/banking provide centripetal force inward.',
        takeaway: 'a_c = v²/r toward center. Speed can be constant while velocity (direction) changes.',
      },
      {
        scene: 'Satellite / Moon',
        story:
          'Orbit is continuous free-fall sideways. Gravity supplies centripetal acceleration.',
        takeaway: 'Same ΣF = ma; the acceleration just points to the center.',
      },
    ],
    tryThis:
      'Swing a key on a string (safely). What happens to the path if the string breaks?',
    intuition:
      '“Centrifugal force” in the car frame is fictitious. In inertial frames, only real inward forces.',
  },
  13: {
    hook: 'Rotation is linear physics with new labels: τ like F, I like m, ω like v.',
    scenes: [
      {
        scene: 'Opening a heavy door',
        story:
          'Push near the hinges — hard. Push at the handle — easy. Same force, different lever arm → different torque.',
        takeaway: 'τ = rF sinθ. Where you push matters as much as how hard.',
      },
      {
        scene: 'Figure skater spin',
        story:
          'Arms in → spins faster. Angular momentum conserved when external torques are small.',
        takeaway: 'Iω stays roughly constant; smaller I ⇒ larger ω.',
      },
    ],
    tryThis:
      'Hold a textbook outstretched vs tucked. Which is harder to rotate about your body?',
    intuition:
      'Map every linear equation to its rotational twin before memorizing a new formula sheet.',
  },
  14: {
    hook: 'Rolling without slipping links rotation and translation: v = rω is a gear ratio with the ground.',
    scenes: [
      {
        scene: 'Bicycle wheel',
        story:
          'The contact point is instantaneously at rest relative to the road — that’s why static friction can act without doing work.',
        takeaway: 'Rolling condition connects a and α: a = rα (when no slip).',
      },
      {
        scene: 'Yo-yo / spool paradox',
        story:
          'Pull the string at different angles and the spool rolls different ways — torque and friction direction flip.',
        takeaway: 'Always draw FBD + choose rotation axis carefully.',
      },
    ],
    tryThis:
      'Roll a bottle and slide a bottle on a table. Which stops sooner, and why (energy + friction)?',
    intuition:
      'Total KE = ½mv² + ½Iω². Forgetting rotational KE loses points on AP problems.',
  },
  15: {
    hook: 'SHM is restoring force toward equilibrium — springs and small pendulums share the same math.',
    scenes: [
      {
        scene: 'Car suspension',
        story:
          'Hit a bump: the spring + damper oscillate. Ideal spring alone would ring forever; damping settles it.',
        takeaway: 'F = −kx ⇒ a = −ω²x. Solutions are sines and cosines.',
      },
      {
        scene: 'Metronome / playground swing',
        story:
          'Small angles: period independent of amplitude (ideal). Push harder, same period — surprising at first.',
        takeaway: 'ω = √(k/m) or √(g/L) sets the natural rhythm.',
      },
    ],
    tryThis:
      'Hang a weight on a rubber band, pull down slightly, release. What is the “equilibrium” you’re oscillating about?',
    intuition:
      'Energy sloshes between spring PE and KE. Amplitude sets energy; ω sets timing.',
  },
  16: {
    hook: 'Gravity is a field: every mass curves the “rules” for force and PE around it.',
    scenes: [
      {
        scene: 'Orbit altitude',
        story:
          'ISS astronauts aren’t “beyond gravity” — they’re in continuous free-fall around Earth at ~7.6 km/s.',
        takeaway: 'g softens with height; orbital mechanics uses GM/r² and energy.',
      },
      {
        scene: 'Tides',
        story:
          'Moon pulls oceans differently on near vs far sides of Earth — differential gravity.',
        takeaway: 'Force law + geometry explain large-scale effects from a simple inverse square.',
      },
    ],
    tryThis:
      'If Earth suddenly denser but same radius, what happens to surface g? (g = GM/R².)',
    intuition:
      'U = −GMm/r. Zero PE at infinity is a convention — differences in U do the work.',
  },
  17: {
    hook: 'Fluids: pressure is force per area; buoyancy is the weight of fluid displaced.',
    scenes: [
      {
        scene: 'Dam design',
        story:
          'Water pressure grows with depth, so dams are thicker at the bottom — more force on each patch of wall.',
        takeaway: 'P = P₀ + ρgh. Depth, not “total water in the lake,” sets pressure.',
      },
      {
        scene: 'Helium balloon',
        story:
          'Weight of displaced air > weight of balloon + helium → net buoyant force up.',
        takeaway: 'Archimedes: F_b = ρ_fluid V_displaced g.',
      },
    ],
    tryThis:
      'Why does a steel ship float but a steel bolt sink? (Think displaced volume.)',
    intuition:
      'Continuity and Bernoulli connect speed and pressure in flow — airplane wings abuse this carefully.',
  },
  18: {
    hook: 'Differential equations say “the rate of change depends on the current state” — nature’s feedback loops.',
    scenes: [
      {
        scene: 'Cooling coffee',
        story:
          'Hot coffee loses heat faster when it’s much hotter than the room. dT/dt ∝ −(T − T_room).',
        takeaway: 'Exponential approach to equilibrium — same math as charging capacitors later.',
      },
      {
        scene: 'Population / debt interest',
        story:
          'Growth proportional to current size → exponential. Physics uses the same DE structure for many systems.',
        takeaway: 'Separate variables or recognize standard forms; don’t reinvent every time.',
      },
    ],
    tryThis:
      'If doubling time of a bacteria culture is 20 min, what DE model is being assumed?',
    intuition:
      'Write the English sentence as an equation first: “rate of X is proportional to Y.”',
  },
  19: {
    hook: 'AP free response rewards a clear story: principle → symbols → solve → check.',
    scenes: [
      {
        scene: 'Studio critique',
        story:
          'Graders skim for the physics sentence (“conservation of energy because frictionless”) before hunting algebra.',
        takeaway: 'Lead with the law. Algebra is support, not the opening act.',
      },
      {
        scene: 'Limiting-case check',
        story:
          'Set μ → 0 or m → 0 in your final answer. If nonsense appears, you caught an algebra bug early.',
        takeaway: 'Reasonableness beats raw speed on exam day.',
      },
    ],
    tryThis:
      'Take yesterday’s hardest problem and rewrite only the first three lines as an AP rubric would want.',
    intuition:
      'Strategy menu: FBD, energy, momentum, rotation. Pick the shortest honest path.',
  },
  20: {
    hook: 'Mastery is choosing the right tool under time pressure — not knowing every formula by heart.',
    scenes: [
      {
        scene: 'Exam triage',
        story:
          'Scan all FRQs. Start with the one whose principle you can name in one sentence.',
        takeaway: 'Points come from clear setups even if the last algebra step is ugly.',
      },
      {
        scene: 'Lab intuition',
        story:
          'In real labs, graphs and units catch mistakes faster than redoing symbolic work.',
        takeaway: 'Bring that habit to every practice set today.',
      },
    ],
    tryThis:
      'Write your personal 4-step checklist on paper. Keep it visible during today’s mixed practice.',
    intuition:
      'You have the full Mechanics C toolkit. Today is about judgment and communication.',
  },
}

export function getDayRealWorld(day: number): DayRealWorld {
  return DAY_REAL_WORLD[day] ?? DEFAULT
}
