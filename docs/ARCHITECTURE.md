# Architecture — AP Physics C Mastery Platform

## Overview

Next.js 16 App Router client study app. Progress is device-local (Zustand + localStorage v2/v3). Curriculum is a fixed 20-day sequence (Pre-Calc → AP Physics C Mechanics).

## Dependency map

```
data/curriculum.json  ──sync──►  src/data/curriculum.json
        │
        ▼
lib/curriculum.ts → app/day/[day] → AppShell → DayGate → DayView
                                              ▲
layout.tsx → Providers (Progress + FormulaExplorer) ┘
        │
        ├── RichText / FormulaWithClip → Formula Explorer
        ├── LogicDebugger (lazy)
        ├── KnowledgeGraphPanel / adaptive focus
        ├── InteractiveGraph / SandboxHost (lazy sims + Sonify)
        ├── PracticeWorkout / BossBattle / variants
        ├── HighlightNotebook → notebookCards
        ├── DailyQuiz (speedrun) → completeDay
        └── /exam ExamMode + FRQ ECF
```

## State

- Store: [`src/store/progressStore.ts`](../src/store/progressStore.ts)
- Facade: [`src/context/ProgressContext.tsx`](../src/context/ProgressContext.tsx) (`useProgress`)
- Persistence key: `ap-physics-mastery-progress-v2` with `schemaVersion: 3`
- Debounced writes + `BroadcastChannel` tab sync
- Theme boot script in root layout (dark-first, no flash)

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Redirect to active/unlocked day |
| `/day/[1-20]` | Lesson surface |
| `/analytics` | Learning analytics dashboard |
| `/exam` | AP Exam Mode (MCQ sample + FRQ) |

## Tests

- Vitest: `npm test` (storage, ECF, audio mute)
- Playwright smoke: `npm run test:e2e` (needs prior `npm run build`)

## Deferred (roadmap)

~~Logic Debugger, FRQ Error-Carried-Forward, Auditory Kinematics, local Notebook, Exam Mode, boss/quests~~ — **shipped in Phase C**.

Still out: cloud LLM tutoring, auth/multi-device sync, visual regression CI.
