# AP Physics C & Pre-Calc 20-Day Mastery

Interactive Next.js study app connecting pre-calculus to AP Physics C across 20 days — lessons, verified video embeds, Recharts/Canvas graphs, practice problems, and a daily quiz with local progress tracking.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Progress, streak, study time, notes, and quiz scores persist in `localStorage`.

## Curriculum

Source of truth: `data/curriculum.json` (synced to `src/data/curriculum.json`).

```bash
# Rebuild lessons from scripts/, then re-apply verified YouTube links
node scripts/generate-curriculum.mjs

# Audit every video against YouTube oEmbed (expects 0 dead)
node scripts/check-videos.mjs
```

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Lucide · Recharts · Canvas

## Project agent

`.cursor/agents/physics-mastery-builder.md`
