import { normalize } from './text.ts'
import type { Crystal } from './types.ts'

function nameScore(name: string, query: string): number {
  if (name === query) return 100
  if (name.startsWith(query)) return 80
  if (name.includes(query)) return 60
  return 0
}

function score(crystal: Crystal, query: string): number {
  let best = 0
  for (const name of [crystal.name, ...crystal.aliases]) {
    best = Math.max(best, nameScore(normalize(name), query))
  }
  for (const intention of crystal.intentions) {
    const value = normalize(intention)
    if (value === query) best = Math.max(best, 50)
    else if (value.includes(query)) best = Math.max(best, 40)
  }
  if (best === 0) {
    const text = normalize(`${crystal.metaphysical} ${crystal.healing}`)
    if (text.includes(query)) best = 20
  }
  return best
}

const byName = (a: Crystal, b: Crystal) => a.name.localeCompare(b.name)

/** Ranked search over names, aliases, intentions, and descriptions. */
export function searchCrystals(crystals: Crystal[], query: string): Crystal[] {
  const q = normalize(query)
  if (!q) return [...crystals].sort(byName)
  return crystals
    .map((crystal) => ({ crystal, score: score(crystal, q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || byName(a.crystal, b.crystal))
    .map((r) => r.crystal)
}
