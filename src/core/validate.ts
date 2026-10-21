import { CHAKRAS, ELEMENTS, INTENTIONS, ZODIAC_SIGNS } from './vocabulary.ts'

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

function checkVocabulary(
  label: string,
  field: string,
  value: unknown,
  allowed: readonly string[],
  errors: string[],
) {
  if (!isStringArray(value)) {
    errors.push(`${label}: ${field} must be an array of strings`)
    return
  }
  for (const v of value) {
    if (!allowed.includes(v)) errors.push(`${label}: unknown ${field} value "${v}"`)
  }
}

/** Returns human-readable errors; an empty array means the dataset is valid. */
export function validateDataset(data: unknown): string[] {
  if (!Array.isArray(data)) return ['dataset must be an array']

  const errors: string[] = []
  const seen = new Set<string>()

  data.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push(`entry ${index}: must be an object`)
      return
    }
    const slug = entry.slug
    const label = typeof slug === 'string' ? slug : `entry ${index}`

    if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) {
      errors.push(`${label}: slug must be kebab-case`)
    } else if (seen.has(slug)) {
      errors.push(`${label}: duplicate slug "${slug}"`)
    } else {
      seen.add(slug)
    }

    for (const field of ['name', 'metaphysical', 'healing']) {
      if (!isNonEmptyString(entry[field])) errors.push(`${label}: ${field} is required`)
    }
    for (const field of ['aliases', 'colors']) {
      if (!isStringArray(entry[field])) errors.push(`${label}: ${field} must be an array of strings`)
    }

    checkVocabulary(label, 'chakras', entry.chakras, CHAKRAS, errors)
    checkVocabulary(label, 'zodiac', entry.zodiac, ZODIAC_SIGNS, errors)
    checkVocabulary(label, 'elements', entry.elements, ELEMENTS, errors)
    checkVocabulary(label, 'intentions', entry.intentions, INTENTIONS, errors)

    const care = entry.care
    if (!isRecord(care)) {
      errors.push(`${label}: care is required`)
    } else {
      if (typeof care.hardness !== 'number' || care.hardness < 1 || care.hardness > 10) {
        errors.push(`${label}: care.hardness must be between 1 and 10`)
      }
      if (typeof care.waterSafe !== 'boolean') errors.push(`${label}: care.waterSafe must be boolean`)
      if (typeof care.sunSafe !== 'boolean') errors.push(`${label}: care.sunSafe must be boolean`)
      if (!isStringArray(care.cleansing)) errors.push(`${label}: care.cleansing must be an array of strings`)
      if (care.notes !== undefined && typeof care.notes !== 'string') {
        errors.push(`${label}: care.notes must be a string`)
      }
    }

    const image = entry.image
    if (!isRecord(image)) {
      errors.push(`${label}: image is required`)
    } else {
      if (image.file !== `${slug}.webp`) errors.push(`${label}: image.file must be "${slug}.webp"`)
      for (const field of ['credit', 'license', 'sourceUrl']) {
        if (typeof image[field] !== 'string') errors.push(`${label}: image.${field} must be a string`)
      }
    }
  })

  return errors
}
