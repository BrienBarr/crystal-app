import data from './data/crystals.json'
import type { Crystal } from './types.ts'

// The only module that knows where crystal data lives. When the API exists,
// reimplement these two functions with fetch; callers stay the same.
const crystals = ([...data] as Crystal[]).sort((a, b) => a.name.localeCompare(b.name))

export function getAllCrystals(): Promise<Crystal[]> {
  return Promise.resolve([...crystals])
}

export function getCrystalBySlug(slug: string): Promise<Crystal | undefined> {
  return Promise.resolve(crystals.find((c) => c.slug === slug))
}
