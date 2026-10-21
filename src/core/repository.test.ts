import { getAllCrystals, getCrystalBySlug } from './repository.ts'

test('getCrystalBySlug finds a crystal', async () => {
  expect((await getCrystalBySlug('amethyst'))?.name).toBe('Amethyst')
})

test('getCrystalBySlug returns undefined for unknown slugs', async () => {
  expect(await getCrystalBySlug('nope')).toBeUndefined()
})

test('getAllCrystals is sorted by name', async () => {
  const names = (await getAllCrystals()).map((c) => c.name)
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
})
