import type { Crystal } from './types.ts'

export type Facet = 'chakras' | 'colors' | 'zodiac' | 'elements'
export type FilterState = Record<Facet, string[]>

export const FACETS: readonly Facet[] = ['chakras', 'colors', 'zodiac', 'elements']

export const EMPTY_FILTERS: FilterState = { chakras: [], colors: [], zodiac: [], elements: [] }

/** AND across facets, OR within a facet; an empty facet imposes no constraint. */
export function filterCrystals(crystals: Crystal[], filters: FilterState): Crystal[] {
  return crystals.filter((crystal) =>
    FACETS.every((facet) => {
      const selected = filters[facet]
      if (selected.length === 0) return true
      const values: string[] = crystal[facet]
      return selected.some((v) => values.includes(v))
    }),
  )
}

export function activeFilterCount(filters: FilterState): number {
  return FACETS.reduce((sum, facet) => sum + filters[facet].length, 0)
}
