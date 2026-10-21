import { createMemoryFavoritesStore } from './favorites.ts'

test('load returns the initial slugs', () => {
  expect(createMemoryFavoritesStore(['amethyst']).load()).toEqual(['amethyst'])
})

test('save then load round-trips', () => {
  const store = createMemoryFavoritesStore()
  store.save(['citrine', 'jade'])
  expect(store.load()).toEqual(['citrine', 'jade'])
})
