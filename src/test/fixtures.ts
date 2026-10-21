import type { Crystal } from '../core/types.ts'

/** Builds a minimal valid crystal for tests; override any field. */
export function makeCrystal(overrides: Partial<Crystal> & { name: string }): Crystal {
  const slug = overrides.slug ?? overrides.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    slug,
    aliases: [],
    colors: [],
    chakras: [],
    zodiac: [],
    elements: [],
    intentions: [],
    metaphysical: '',
    healing: '',
    care: { hardness: 7, waterSafe: true, sunSafe: true, cleansing: [] },
    image: { file: `${slug}.webp`, credit: '', license: '', sourceUrl: '' },
    ...overrides,
  }
}
