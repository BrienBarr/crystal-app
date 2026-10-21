import { createLocalStorageFavoritesStore } from './localStorageFavorites.ts'

function fakeStorage(initial: Record<string, string> = {}) {
  const data = { ...initial }
  return {
    getItem: (key: string) => data[key] ?? null,
    setItem: (key: string, value: string) => {
      data[key] = value
    },
  }
}

const KEY = 'crystals.favorites.v1'

test('persists across store instances', () => {
  const storage = fakeStorage()
  createLocalStorageFavoritesStore(storage).save(['amethyst', 'jade'])
  expect(createLocalStorageFavoritesStore(storage).load()).toEqual(['amethyst', 'jade'])
})

test('invalid JSON loads as empty', () => {
  expect(createLocalStorageFavoritesStore(fakeStorage({ [KEY]: 'not json' })).load()).toEqual([])
})

test('a non-array value loads as empty', () => {
  expect(createLocalStorageFavoritesStore(fakeStorage({ [KEY]: '{"a":1}' })).load()).toEqual([])
})

test('drops non-string entries and duplicates', () => {
  const storage = fakeStorage({ [KEY]: '["amethyst", 3, null, "amethyst", "jade"]' })
  expect(createLocalStorageFavoritesStore(storage).load()).toEqual(['amethyst', 'jade'])
})

test('falls back to memory when storage throws', () => {
  const broken = {
    getItem: () => {
      throw new Error('denied')
    },
    setItem: () => {
      throw new Error('quota')
    },
  }
  const store = createLocalStorageFavoritesStore(broken)
  expect(store.load()).toEqual([])
  expect(() => store.save(['amethyst'])).not.toThrow()
  expect(store.load()).toEqual(['amethyst'])
})

test('uses the real localStorage by default', () => {
  localStorage.clear()
  createLocalStorageFavoritesStore().save(['ruby'])
  expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(['ruby'])
})
