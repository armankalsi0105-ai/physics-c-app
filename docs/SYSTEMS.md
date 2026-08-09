# Systems API — Phase A + B + C

## Kinetic Progression

[`PracticeWorkout`](../src/components/practice/PracticeWorkout.tsx) runs Warm-Up → Technique → Speed → Challenge → Mastery → Cooldown with 30s rest. Persists via `recordKineticSet`.

## Knowledge Graph

Data: [`src/data/knowledgeGraph.ts`](../src/data/knowledgeGraph.ts)  
UI: [`KnowledgeGraphPanel`](../src/components/study/KnowledgeGraphPanel.tsx)

## Formula Explorer

Data: [`src/data/formulaExplorer.ts`](../src/data/formulaExplorer.ts)  
UI: lazy [`FormulaExplorer`](../src/components/study/FormulaExplorer.tsx)  
Opens from formula **Explore** via [`FormulaExplorerContext`](../src/context/FormulaExplorerContext.tsx).

## Local Adaptive Engine

[`src/lib/adaptive/index.ts`](../src/lib/adaptive/index.ts) — misconception tags + daily focus chip.

## Physics Sandboxes

[`SandboxHost`](../src/components/sims/SandboxHost.tsx): day 5 projectile, 11 incline, 15 collision, 19 mass–spring.

## Logic Debugger (Phase C)

[`LogicDebugger`](../src/components/debug/LogicDebugger.tsx) + [`logicDebug.ts`](../src/lib/logicDebug.ts) — step through derivations with variable memory, autoplay, jump.

## FRQ ECF + Exam Mode

- Data: [`src/data/frqs.ts`](../src/data/frqs.ts) (days 11 / 13 / 15)
- Engine: [`src/lib/frq/ecf.ts`](../src/lib/frq/ecf.ts)
- UI: `/exam` → [`ExamMode`](../src/components/exam/ExamMode.tsx) + [`FrqPanel`](../src/components/exam/FrqPanel.tsx)
- Progress: `examHistory[]`

## Auditory Kinematics

[`kinematicsAudio.ts`](../src/lib/audio/kinematicsAudio.ts) — velocity→pitch, accel→gain, jerk→vibrato. Sonify toggle on ProjectileSim + motion graphs. Mute by default (`audioEnabled`).

## Local Notebook

Highlight in `.day-view` → [`HighlightNotebook`](../src/components/notebook/HighlightNotebook.tsx) → `notebookCards[]` → FlashcardDeck **My cards** tab.

## Practice variants & hints

Curriculum `hints: { concept, formula, setup }` + [`makeProblemVariant`](../src/lib/variants.ts) / Socratic pause in PracticeProblem.

## Gamification depth

Weekly [`QuestCard`](../src/components/study/QuestCard.tsx), [`BossBattle`](../src/components/practice/BossBattle.tsx) on days 5/10/15/20, DailyQuiz speedrun → `speedrunBest`, hidden achievements (sonify / notebook / ECF).

## Analytics

Route `/analytics` → local XP, weak tags, kinetic history, exam history.

## Progress store actions (selected)

`hydrate`, `completeDay`, `recordProblemResult`, `recordKineticSet`, `recordExam`, `recordSpeedrun`, `addNotebookCard`, `bumpQuest`, `clearBoss`, `setAudioEnabled`, `unlockHidden`

## Tests

- Vitest: `npm test`
- Playwright: `npm run test:e2e`
