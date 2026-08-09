// Audits every video URL + enforces Phase 2 free-access rule.
// Usage: node scripts/check-videos.mjs
import { readFileSync } from 'node:fs'

const FREEMIUM_RISK = new Set(['The Organic Chemistry Tutor'])
const BLOCKED = [/patreon\.com/i, /curiositystream/i, /masterclass\.com/i]

const curriculum = JSON.parse(
  readFileSync(new URL('../src/data/curriculum.json', import.meta.url), 'utf8'),
)

async function check(url) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    )
    if (!res.ok) return { ok: false, status: res.status }
    const data = await res.json()
    return { ok: true, title: data.title }
  } catch (e) {
    return { ok: false, status: String(e) }
  }
}

function accessOk(v) {
  if (v.access && v.access !== 'free') return false
  if (FREEMIUM_RISK.has(v.channel)) return false
  if (BLOCKED.some((re) => re.test(v.url))) return false
  return true
}

const results = []
let accessFails = 0
for (const day of curriculum.days) {
  for (const section of ['math', 'physics']) {
    for (const v of day[section].videos ?? []) {
      if (!accessOk(v)) {
        accessFails++
        console.log(
          `PAY  d${String(day.day).padStart(2, '0')} ${section.padEnd(7)} ${v.channel} ${v.url}`,
        )
      }
      const r = await check(v.url)
      results.push({
        day: day.day,
        section,
        title: v.title,
        channel: v.channel,
        url: v.url,
        access: v.access,
        ...r,
      })
      process.stdout.write(
        `${r.ok ? 'OK  ' : 'DEAD'} d${String(day.day).padStart(2, '0')} ${section.padEnd(7)} ${v.url} ${r.ok ? `-> ${r.title}` : `(${r.status})`}\n`,
      )
    }
  }
}

const dead = results.filter((r) => !r.ok)
console.log(`\nTotal: ${results.length}, dead: ${dead.length}, access violations: ${accessFails}`)
if (accessFails > 0 || dead.length > 0) process.exitCode = 1
