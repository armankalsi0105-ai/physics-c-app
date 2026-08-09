export type ProblemType = 'mc' | 'numeric'

export type Problem = {
  id: string
  prompt: string
  type: ProblemType
  options?: string[]
  answer: string | number
  tolerance?: number
  hint: string
  steps: string[]
  solution: string
  /** Optional progressive hints; falls back to splitting `hint` if absent. */
  hints?: { concept: string; formula: string; setup: string }
}

export type AccessTier = 'free' | 'freemium-risk' | 'paywalled' | 'unknown'

export type ResourceKind = 'video' | 'article' | 'sim' | 'doc'

export type CuratedResource = {
  id: string
  kind: ResourceKind
  title: string
  url: string
  channelOrSource: string
  access: AccessTier
  verifiedAt: string
  notes?: string
  replacesId?: string
  tags?: string[]
}

export type Video = {
  title: string
  url: string
  channel: string
  /** Phase 2: must be free-to-watch without login/paywall. */
  access?: AccessTier
  verifiedAt?: string
  resourceId?: string
}

export type PracticeSetKind =
  | 'warmup'
  | 'heavy'
  | 'synthesis'
  | 'technique'
  | 'speed'
  | 'challenge'
  | 'mastery'
  | 'cooldown'

/** Local adaptive misconception tags */
export type MisconceptionTag =
  | 'chain_rule'
  | 'sign_error'
  | 'fbd'
  | 'units'
  | 'product_rule'
  | 'limits'
  | 'energy'
  | 'momentum'
  | 'rotation'
  | 'vectors'
  | 'integrals'
  | 'general'

export type KineticSetKind =
  | 'warmup'
  | 'technique'
  | 'speed'
  | 'challenge'
  | 'mastery'
  | 'cooldown'

export type KineticSetResult = {
  day: number
  setKind: KineticSetKind
  setId: string
  accuracy: number
  seconds: number
  confidence: number
  xpEarned: number
  mistakes: MisconceptionTag[]
  completedAt: string
}

export type AdaptiveState = {
  misconceptionCounts: Partial<Record<MisconceptionTag, number>>
  focusTags: MisconceptionTag[]
  lastRecommendedDay: number | null
}

export type PracticeSet = {
  id: string
  kind: PracticeSetKind
  label: string
  problemIds: string[]
}

export type IntegratorKind = 'euler' | 'semiImplicitEuler'

export type OdeSandboxConfig = {
  type: 'odeSandbox'
  label: string
  model: 'linearDrag' | 'quadraticDrag' | 'shm' | 'constantForce'
  params: {
    m?: number
    b?: number
    k?: number
    g?: number
    x0?: number
    v0?: number
    omega?: number
    F?: number
    tMax?: number
  }
  dt: { min: number; max: number; step: number; default: number }
  integrator?: IntegratorKind
  compareExact?: boolean
}

export type GraphConfig = {
  type:
    | 'function'
    | 'motion'
    | 'projectile'
    | 'drag'
    | 'force'
    | 'shm'
    | 'vector'
    | 'fbd'
    | 'area'
    | 'impulse'
    | 'odeSandbox'
  label: string
  expression?: string
  domain?: [number, number]
  samples?: number
  kind?: 'position' | 'velocity' | 'acceleration'
  points?: { t?: number; y?: number; F?: number; x?: number }[]
  v0?: number
  angle?: number
  g?: number
  m?: number
  k?: number
  tMax?: number
  A?: number
  omega?: number
  shadeFrom?: number
  shadeTo?: number
  vectors?: { x: number; y: number; label: string; color?: string }[]
  forces?: { name: string; angleDeg: number; magnitude: number }[]
  /** odeSandbox fields */
  model?: OdeSandboxConfig['model']
  params?: OdeSandboxConfig['params']
  dt?: OdeSandboxConfig['dt']
  integrator?: IntegratorKind
  compareExact?: boolean
  [key: string]: unknown
}

export type DaySection = {
  lesson: string
  example?: { prompt: string; steps: string[] }
  derivation?: { title: string; steps: string[] }
  videos: Video[]
  resources?: CuratedResource[]
  graph: GraphConfig
  problems: Problem[]
  /** Phase 2 workout sets (physics application). */
  practiceSets?: PracticeSet[]
}

export type DayContent = {
  day: number
  title: string
  overview: string
  math: DaySection & { example: { prompt: string; steps: string[] } }
  physics: DaySection & { derivation: { title: string; steps: string[] } }
  review: {
    quiz: Problem[]
    takeaways: string[]
  }
}

export type Curriculum = {
  appName: string
  totalDays: number
  days: DayContent[]
}

export type DayStatus = 'locked' | 'in-progress' | 'completed'

export type ThemeMode = 'light' | 'dark'

export type BadgeId =
  | 'calculus-rookie'
  | 'vector-master'
  | 'mechanics-pro'
  | 'streak-7'
  | 'streak-14'
  | 'perfect-quiz'
  | 'xp-500'
  | 'xp-1500'
  | 'workout-warrior'
  | 'boss-slayer'
  | 'quest-champion'
  | 'speed-demon'
  | 'sonifier'
  | 'notebook-scholar'
  | 'ecf-thinker'

export type SrsItem = {
  problemId: string
  day: number
  section: 'math' | 'physics' | 'quiz'
  prompt: string
  dueAt: string
  wrongCount: number
}

export type FlashcardProgress = Record<
  string,
  { known: boolean; lastSeen: string | null }
>

export type SetRepProgress = {
  setCompletions: Record<string, string[]>
  setStreak: Record<string, number>
  workoutsCompleted: number
}

export type PedagogyProgress = {
  teachBack: Record<string, string>
  confidence: Record<string, number[]>
  objectivesChecked: Record<string, boolean[]>
}

/** Khan-style mastery ladder per day */
export type MasteryLevel = 'unstarted' | 'practiced' | 'level1' | 'mastered'

export type SkillMasteryMap = Record<string, MasteryLevel>

/** Quizlet Learn Mode phase per flashcard */
export type LearnPhase = 'mcq' | 'fill' | 'write' | 'done'

export type LearnModeState = Record<
  string,
  {
    phase: LearnPhase
    streak: number
    ease: number
    interval: number
    repetitions: number
    dueDate: string | null
  }
>

export type ProgressState = {
  /** Persistence schema version for migrations */
  schemaVersion: number
  completedDays: number[]
  activeDay: number
  streak: number
  lastStudyDate: string | null
  totalSeconds: number
  quizScores: Record<string, number>
  notes: Record<string, string>
  sessionStartedAt: number | null
  xp: number
  dailyGoalXp: number
  dailyXpEarned: number
  dailyXpDate: string | null
  badges: BadgeId[]
  theme: ThemeMode
  srsQueue: SrsItem[]
  flashcards: FlashcardProgress
  solvedProblems: string[]
  setReps: SetRepProgress
  sandboxPrefs: Record<string, { dt: number }>
  pedagogy: PedagogyProgress
  skillMastery: SkillMasteryMap
  learnMode: LearnModeState
  kineticSessions: KineticSetResult[]
  adaptive: AdaptiveState
  examHistory: ExamSessionSummary[]
  notebookCards: NotebookCard[]
  audioEnabled: boolean
  quests: QuestProgress
  bossClears: string[]
  speedrunBest: Record<string, number>
  hiddenAchievements: string[]
}

export type NotebookCard = {
  id: string
  front: string
  back: string
  source: string
  createdAt: string
  day: number
}

export type FRQPart = {
  id: string
  prompt: string
  points: number
  dependsOn?: string
  officialAnswer: number
  tolerance?: number
  methodRubric: string[]
  solution: string
}

export type FRQ = {
  id: string
  day: number
  title: string
  parts: FRQPart[]
}

export type ExamSessionSummary = {
  id: string
  completedAt: string
  mcCorrect: number
  mcTotal: number
  frqPoints: number
  frqMax: number
  methodPoints: number
  predictedScore: number
  secondsUsed: number
}

export type QuestProgress = {
  weekKey: string
  kineticSets: number
  srsReviews: number
  practiceCorrect: number
  claimed: string[]
}
