import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { days } from './curriculum-days-part1.mjs'
import { daysPart2 } from './curriculum-days-part2.mjs'
import { daysPart3 } from './curriculum-days-part3.mjs'
import { daysPart4 } from './curriculum-days-part4.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'data')
const outFile = join(outDir, 'curriculum.json')
const srcFile = join(root, 'src', 'data', 'curriculum.json')

const allDays = [...days, ...daysPart2, ...daysPart3, ...daysPart4]

const curriculum = {
  appName: 'AP Physics C & Pre-Calc 20-Day Mastery',
  totalDays: 20,
  days: allDays,
}

mkdirSync(outDir, { recursive: true })
mkdirSync(dirname(srcFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(curriculum, null, 2) + '\n', 'utf8')
copyFileSync(outFile, srcFile)

console.log(`Wrote ${outFile}`)
console.log(`Copied ${srcFile}`)
console.log(`Days: ${curriculum.days.length}`)

if (curriculum.days.length !== 20) {
  console.error('ERROR: expected 20 days')
  process.exit(1)
}

for (const day of curriculum.days) {
  if (day.math.problems.length !== 2) {
    console.error(`Day ${day.day}: expected 2 math problems, got ${day.math.problems.length}`)
    process.exit(1)
  }
  if (day.physics.problems.length !== 2) {
    console.error(`Day ${day.day}: expected 2 physics problems, got ${day.physics.problems.length}`)
    process.exit(1)
  }
  if (day.review.quiz.length !== 3) {
    console.error(`Day ${day.day}: expected 3 quiz problems, got ${day.review.quiz.length}`)
    process.exit(1)
  }
  if (day.review.takeaways.length < 3 || day.review.takeaways.length > 5) {
    console.error(`Day ${day.day}: expected 3-5 takeaways, got ${day.review.takeaways.length}`)
    process.exit(1)
  }
}

console.log('Validation passed.')

// Always re-apply the verified video pool so regenerating curriculum
// never reintroduces dead YouTube links.
console.log('\nApplying verified video pool…')
const fix = spawnSync(process.execPath, [join(__dirname, 'fix-videos.mjs')], {
  cwd: root,
  stdio: 'inherit',
})
if (fix.status !== 0) {
  console.error('fix-videos.mjs failed')
  process.exit(fix.status ?? 1)
}
