import type { Crystal } from '../core/types.ts'
import type { Facet } from '../core/filters.ts'
import { CHAKRAS, CHAKRA_LABELS, ELEMENTS, ZODIAC_SIGNS } from '../core/vocabulary.ts'

export interface FacetOption {
  value: string
  label: string
}

export const FACET_LABELS: Record<Facet, string> = {
  chakras: 'Chakra',
  colors: 'Color',
  zodiac: 'Zodiac',
  elements: 'Element',
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function facetOptions(facet: Facet, crystals: Crystal[]): FacetOption[] {
  switch (facet) {
    case 'chakras':
      return CHAKRAS.map((c) => ({ value: c, label: CHAKRA_LABELS[c] }))
    case 'zodiac':
      return ZODIAC_SIGNS.map((z) => ({ value: z, label: capitalize(z) }))
    case 'elements':
      return ELEMENTS.map((e) => ({ value: e, label: capitalize(e) }))
    case 'colors':
      return [...new Set(crystals.flatMap((c) => c.colors))]
        .sort()
        .map((c) => ({ value: c, label: capitalize(c) }))
  }
}
