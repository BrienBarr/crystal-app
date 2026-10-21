import { validateDataset } from './validate.ts'
import type { Crystal } from './types.ts'

function valid(overrides: Partial<Crystal> = {}): Crystal {
  return {
    slug: 'rose-quartz',
    name: 'Rose Quartz',
    aliases: ['Pink Quartz'],
    colors: ['pink'],
    chakras: ['heart'],
    zodiac: ['taurus', 'libra'],
    elements: ['water'],
    intentions: ['love', 'self-love'],
    metaphysical: 'The stone of unconditional love.',
    healing: 'Traditionally used to soothe the heart.',
    care: {
      hardness: 7,
      waterSafe: true,
      sunSafe: false,
      cleansing: ['moonlight'],
    },
    image: {
      file: 'rose-quartz.webp',
      credit: 'Someone',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rose.jpg',
    },
    ...overrides,
  }
}

test('accepts a valid dataset', () => {
  expect(validateDataset([valid()])).toEqual([])
})

test('rejects a non-array', () => {
  expect(validateDataset({})).toHaveLength(1)
})

test('rejects duplicate slugs', () => {
  const errors = validateDataset([valid(), valid()])
  expect(errors.some((e) => e.includes('rose-quartz'))).toBe(true)
})

test('rejects a slug that is not kebab-case', () => {
  expect(validateDataset([valid({ slug: 'Rose Quartz', image: { ...valid().image, file: 'Rose Quartz.webp' } })])).not.toEqual([])
})

test('rejects unknown chakra, zodiac, element, and intention values by name', () => {
  for (const [field, value] of [
    ['chakras', 'spleen'],
    ['zodiac', 'ophiuchus'],
    ['elements', 'metal'],
    ['intentions', 'world peace'],
  ] as const) {
    const errors = validateDataset([valid({ [field]: [value] })])
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain(value)
  }
})

test('rejects missing or empty descriptions', () => {
  const noMeta = { ...valid() } as Partial<Crystal>
  delete noMeta.metaphysical
  expect(validateDataset([noMeta])).not.toEqual([])
  expect(validateDataset([valid({ healing: '' })])).not.toEqual([])
})

test('rejects hardness outside 1–10', () => {
  expect(validateDataset([valid({ care: { ...valid().care, hardness: 11 } })])).not.toEqual([])
  expect(validateDataset([valid({ care: { ...valid().care, hardness: 0 } })])).not.toEqual([])
})

test('rejects an image file that does not match the slug', () => {
  expect(validateDataset([valid({ image: { ...valid().image, file: 'other.webp' } })])).not.toEqual([])
})
