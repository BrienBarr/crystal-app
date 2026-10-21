import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useCrystal, useCrystals } from './useCrystals.ts'
import { FavoritesProvider, useFavorites } from './favorites.tsx'
import { BrowseStateProvider, useBrowseState } from './browseState.tsx'
import { createMemoryFavoritesStore } from '../core/favorites.ts'
import { EMPTY_FILTERS } from '../core/filters.ts'

test('useCrystals loads the dataset', async () => {
  const { result } = renderHook(() => useCrystals())
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.crystals.length).toBeGreaterThanOrEqual(55)
  expect(result.current.error).toBeNull()
})

test('useCrystal loads one crystal by slug', async () => {
  const { result } = renderHook(() => useCrystal('amethyst'))
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.crystal?.name).toBe('Amethyst')
})

test('useCrystal resolves undefined for an unknown slug without error', async () => {
  const { result } = renderHook(() => useCrystal('nope'))
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.crystal).toBeUndefined()
  expect(result.current.error).toBeNull()
})

describe('favorites', () => {
  test('initializes from the store and persists toggles', () => {
    const store = createMemoryFavoritesStore(['jade'])
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FavoritesProvider store={store}>{children}</FavoritesProvider>
    )
    const { result } = renderHook(() => useFavorites(), { wrapper })
    expect(result.current.isFavorite('jade')).toBe(true)

    act(() => result.current.toggleFavorite('amethyst'))
    expect(result.current.isFavorite('amethyst')).toBe(true)
    expect(store.load()).toEqual(['jade', 'amethyst'])

    act(() => result.current.toggleFavorite('amethyst'))
    expect(result.current.isFavorite('amethyst')).toBe(false)
    expect(store.load()).toEqual(['jade'])
  })

  test('throws outside its provider', () => {
    expect(() => renderHook(() => useFavorites())).toThrow(/FavoritesProvider/)
  })
})

describe('browse state', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <BrowseStateProvider>{children}</BrowseStateProvider>
  )

  test('toggleFilter adds and removes a value; clearFilters resets', () => {
    const { result } = renderHook(() => useBrowseState(), { wrapper })
    act(() => result.current.toggleFilter('chakras', 'heart'))
    expect(result.current.filters.chakras).toEqual(['heart'])
    act(() => result.current.toggleFilter('chakras', 'heart'))
    expect(result.current.filters).toEqual(EMPTY_FILTERS)
    act(() => result.current.toggleFilter('colors', 'pink'))
    act(() => result.current.clearFilters())
    expect(result.current.filters).toEqual(EMPTY_FILTERS)
  })

  test('searchIntention sets the query and clears filters', () => {
    const { result } = renderHook(() => useBrowseState(), { wrapper })
    act(() => {
      result.current.toggleFilter('chakras', 'root')
      result.current.setQuery('x')
    })
    act(() => result.current.searchIntention('anxiety'))
    expect(result.current.query).toBe('anxiety')
    expect(result.current.filters).toEqual(EMPTY_FILTERS)
  })

  test('throws outside its provider', () => {
    expect(() => renderHook(() => useBrowseState())).toThrow(/BrowseStateProvider/)
  })
})
