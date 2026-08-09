export type FormulaEntry = {
  id: string
  section: string
  title: string
  latex: string
  note?: string
}

/** AP Physics C Mechanics–oriented formula sheet for the overlay drawer. */
export const FORMULA_SHEET: FormulaEntry[] = [
  {
    id: 'kin-1',
    section: 'Kinematics',
    title: 'Velocity & acceleration',
    latex: 'v=\\dfrac{dx}{dt},\\quad a=\\dfrac{dv}{dt}=\\dfrac{d^{2}x}{dt^{2}}',
  },
  {
    id: 'kin-2',
    section: 'Kinematics',
    title: 'Constant acceleration',
    latex: 'v=v_{0}+at,\\quad x=x_{0}+v_{0}t+\\tfrac{1}{2}at^{2},\\quad v^{2}=v_{0}^{2}+2a\\Delta x',
  },
  {
    id: 'kin-3',
    section: 'Kinematics',
    title: 'Projectile range (level)',
    latex: 'R=\\dfrac{v_{0}^{2}\\sin 2\\theta}{g}',
  },
  {
    id: 'vec-1',
    section: 'Vectors',
    title: 'Dot product',
    latex: '\\mathbf{A}\\cdot\\mathbf{B}=|A||B|\\cos\\theta=A_{x}B_{x}+A_{y}B_{y}+A_{z}B_{z}',
  },
  {
    id: 'vec-2',
    section: 'Vectors',
    title: 'Cross product',
    latex: '|\\mathbf{A}\\times\\mathbf{B}|=|A||B|\\sin\\theta',
  },
  {
    id: 'dyn-1',
    section: 'Dynamics',
    title: "Newton's 2nd law",
    latex: '\\sum\\mathbf{F}=m\\mathbf{a}',
  },
  {
    id: 'dyn-2',
    section: 'Dynamics',
    title: 'Friction',
    latex: 'f_{k}=\\mu_{k}N,\\quad f_{s}\\le\\mu_{s}N',
  },
  {
    id: 'dyn-3',
    section: 'Dynamics',
    title: 'Incline (no friction)',
    latex: 'a=g\\sin\\theta,\\quad N=mg\\cos\\theta',
  },
  {
    id: 'en-1',
    section: 'Energy',
    title: 'Work–energy',
    latex: 'W_{\\mathrm{net}}=\\Delta K=\\tfrac{1}{2}mv^{2}-\\tfrac{1}{2}mv_{0}^{2}',
  },
  {
    id: 'en-2',
    section: 'Energy',
    title: 'Variable force work',
    latex: 'W=\\int\\mathbf{F}\\cdot d\\mathbf{r}',
  },
  {
    id: 'en-3',
    section: 'Energy',
    title: 'Potential / spring',
    latex: 'U_{g}=mgy,\\quad U_{s}=\\tfrac{1}{2}kx^{2},\\quad F=-\\dfrac{dU}{dx}',
  },
  {
    id: 'mom-1',
    section: 'Momentum',
    title: 'Impulse–momentum',
    latex: '\\mathbf{J}=\\int\\mathbf{F}\\,dt=\\Delta\\mathbf{p}',
  },
  {
    id: 'mom-2',
    section: 'Momentum',
    title: 'Conservation',
    latex: '\\sum\\mathbf{p}_{i}=\\sum\\mathbf{p}_{f}\\quad(\\text{no ext. impulse})',
  },
  {
    id: 'rot-1',
    section: 'Rotation',
    title: 'Angular kinematics',
    latex: '\\omega=\\dfrac{d\\theta}{dt},\\quad\\alpha=\\dfrac{d\\omega}{dt}',
  },
  {
    id: 'rot-2',
    section: 'Rotation',
    title: 'Torque & energy',
    latex: '\\sum\\tau=I\\alpha,\\quad K=\\tfrac{1}{2}I\\omega^{2},\\quad\\tau=rF\\sin\\theta',
  },
  {
    id: 'shm-1',
    section: 'SHM',
    title: 'Mass–spring',
    latex: 'x=A\\cos(\\omega t+\\phi),\\quad\\omega=\\sqrt{\\dfrac{k}{m}},\\quad T=\\dfrac{2\\pi}{\\omega}',
  },
  {
    id: 'calc-1',
    section: 'Calculus',
    title: 'Power / product / chain',
    latex: '(x^{n})^{\\prime}=nx^{n-1},\\quad(uv)^{\\prime}=u^{\\prime}v+uv^{\\prime},\\quad(f\\circ g)^{\\prime}=f^{\\prime}(g)g^{\\prime}',
  },
  {
    id: 'calc-2',
    section: 'Calculus',
    title: 'Integrals',
    latex: '\\int x^{n}\\,dx=\\dfrac{x^{n+1}}{n+1}+C\\ (n\\neq-1),\\quad\\dfrac{d}{dx}\\int_{a}^{x}f=f(x)',
  },
]

export const FORMULA_SECTIONS = [
  ...new Set(FORMULA_SHEET.map((f) => f.section)),
]
