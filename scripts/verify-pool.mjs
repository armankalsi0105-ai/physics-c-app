// Verifies candidate YouTube IDs via oEmbed and prints titles.
const candidates = [
  // From searches (should be good)
  'W-5aqdBitlQ', // FP terminal velocity
  'KvPb33VWY74', // FP work/energy/power review
  'nEsqBVtXRsE', // FP SHM review
  'WtUbnIr7WbU', // FP momentum/impulse/CoM review
  'WqzY3xibFL8', // Khan quotient rule
  '5yfh5cf4-0w', // OCT Calculus 1 derivatives
  'AdLAkD-r9Rs', // OCT differentiation formulas
  'IvLpN1G1Ncg', // OCT basic differentiation rules
  // Guesses to test
  'ihNZlp7iUHE', // Khan intro vectors & scalars?
  'F21S9Wpi0y8', // Khan basic trigonometry?
  'G-T_6hCdMQc', // trig alt?
  'w4QFJb9a8vo', // CC Physics work energy power?
  'fo_pmp5rtzo', // CC friction?
  'fmXFWi-WfyU', // CC rotational motion?
  'jxstE6A_CYQ', // CC SHM?
  'Y-QOfc2XqOk', // CC momentum?
  '2QjdcVTgTTA', // Khan visualizing vectors 2d?
  'aY8z2qO44WA', // FP projectile intro?
  'rGWTfVbAMDM', // OCT torque?
  'Wnj-eQqLAg8', // OCT moment of inertia?
]

for (const id of candidates) {
  const url = `https://www.youtube.com/watch?v=${id}`
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    )
    if (!res.ok) {
      console.log(`DEAD ${id} (${res.status})`)
      continue
    }
    const data = await res.json()
    console.log(`OK   ${id} -> ${data.title} [${data.author_name}]`)
  } catch (e) {
    console.log(`ERR  ${id} ${e}`)
  }
}
