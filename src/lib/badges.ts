import type { BadgeId, ProgressState } from './types'

export const BADGE_META: Record<
  BadgeId,
  { title: string; description: string }
> = {
  'calculus-rookie': {
    title: 'Calculus Rookie',
    description: 'Complete Days 1–5 (derivatives & kinematics).',
  },
  'vector-master': {
    title: 'Vector Master',
    description: 'Complete Days 6–8 (trig, dot, cross).',
  },
  'mechanics-pro': {
    title: 'Mechanics Pro',
    description: 'Complete Days 11–18 (dynamics through rotation).',
  },
  'streak-7': {
    title: 'Week Warrior',
    description: 'Maintain a 7-day study streak.',
  },
  'streak-14': {
    title: 'Fortnight Focus',
    description: 'Maintain a 14-day study streak.',
  },
  'perfect-quiz': {
    title: 'Perfect Quiz',
    description: 'Score 3/3 on any daily quiz.',
  },
  'xp-500': {
    title: 'XP Climber',
    description: 'Earn 500 total XP.',
  },
  'xp-1500': {
    title: 'XP Legend',
    description: 'Earn 1500 total XP.',
  },
  'workout-warrior': {
    title: 'Workout Warrior',
    description: 'Finish 5 full physics practice workouts (all sets).',
  },
  'boss-slayer': {
    title: 'Boss Slayer',
    description: 'Clear any boss battle (Days 5/10/15/20).',
  },
  'quest-champion': {
    title: 'Quest Champion',
    description: 'Claim 3 weekly quests.',
  },
  'speed-demon': {
    title: 'Speed Demon',
    description: 'Set a day quiz speedrun under 90 seconds.',
  },
  sonifier: {
    title: 'Sonifier',
    description: 'Turn on auditory kinematics once.',
  },
  'notebook-scholar': {
    title: 'Notebook Scholar',
    description: 'Save a card from a text highlight.',
  },
  'ecf-thinker': {
    title: 'ECF Thinker',
    description: 'Earn method points on an FRQ with error carried forward.',
  },
}

export function computeNewBadges(state: ProgressState): BadgeId[] {
  const earned = new Set(state.badges)
  const add = (id: BadgeId) => {
    if (!earned.has(id)) earned.add(id)
  }

  const done = new Set(state.completedDays)
  if ([1, 2, 3, 4, 5].every((d) => done.has(d))) add('calculus-rookie')
  if ([6, 7, 8].every((d) => done.has(d))) add('vector-master')
  if ([11, 12, 13, 14, 15, 16, 17, 18].every((d) => done.has(d))) {
    add('mechanics-pro')
  }
  if (state.streak >= 7) add('streak-7')
  if (state.streak >= 14) add('streak-14')
  if (Object.values(state.quizScores).some((s) => s >= 3)) add('perfect-quiz')
  if (state.xp >= 500) add('xp-500')
  if (state.xp >= 1500) add('xp-1500')
  if ((state.setReps?.workoutsCompleted ?? 0) >= 5) add('workout-warrior')
  if ((state.bossClears?.length ?? 0) >= 1) add('boss-slayer')
  if ((state.quests?.claimed?.length ?? 0) >= 3) add('quest-champion')
  if (Object.values(state.speedrunBest ?? {}).some((s) => s > 0 && s < 90)) {
    add('speed-demon')
  }
  if (state.hiddenAchievements?.includes('sonifier')) add('sonifier')
  if (state.hiddenAchievements?.includes('notebook-scholar')) {
    add('notebook-scholar')
  }
  if (state.hiddenAchievements?.includes('ecf-thinker')) add('ecf-thinker')

  return [...earned]
}

export const XP = {
  practiceCorrect: 10,
  practiceFirstTry: 5,
  quizQuestion: 8,
  dayComplete: 25,
  flashcardKnown: 2,
  srsReview: 12,
  setClear: 6,
  workoutComplete: 20,
} as const

export const SET_XP_MULT: Record<string, number> = {
  warmup: 1,
  heavy: 1.5,
  synthesis: 2,
  technique: 1.2,
  speed: 1.4,
  challenge: 1.8,
  mastery: 2.2,
  cooldown: 0.8,
}
