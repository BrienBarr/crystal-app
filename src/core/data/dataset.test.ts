import { existsSync } from 'node:fs'
import path from 'node:path'
import crystals from './crystals.json'
import { validateDataset } from '../validate.ts'
import { INTENTIONS } from '../vocabulary.ts'
import type { Crystal } from '../types.ts'

const data = crystals as Crystal[]

test('dataset passes validation', () => {
  expect(validateDataset(data)).toEqual([])
})

test('dataset has at least 55 crystals', () => {
  expect(data.length).toBeGreaterThanOrEqual(55)
})

test('every crystal has a bundled image', () => {
  const missing = data.filter((c) => !existsSync(path.join('public/crystals', c.image.file)))
  expect(missing.map((c) => c.slug)).toEqual([])
})

test('every crystal has image attribution from Wikimedia Commons', () => {
  const bad = data.filter(
    (c) =>
      !c.image.credit ||
      !c.image.license ||
      !c.image.sourceUrl.startsWith('https://commons.wikimedia.org/'),
  )
  expect(bad.map((c) => c.slug)).toEqual([])
})

test('every intention in the vocabulary is used by at least one crystal', () => {
  const used = new Set(data.flatMap((c) => c.intentions))
  expect(INTENTIONS.filter((i) => !used.has(i))).toEqual([])
})
