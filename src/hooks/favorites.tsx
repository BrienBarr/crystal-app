import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { FavoritesStore } from '../core/favorites.ts'

interface FavoritesValue {
  slugs: string[]
  isFavorite(slug: string): boolean
  toggleFavorite(slug: string): void
}

const FavoritesContext = createContext<FavoritesValue | null>(null)

export function FavoritesProvider({ store, children }: { store: FavoritesStore; children: ReactNode }) {
  const [slugs, setSlugs] = useState(() => store.load())

  const toggleFavorite = useCallback(
    (slug: string) => {
      setSlugs((current) => {
        const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]
        store.save(next)
        return next
      })
    },
    [store],
  )

  const value = useMemo(
    () => ({ slugs, isFavorite: (slug: string) => slugs.includes(slug), toggleFavorite }),
    [slugs, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesValue {
  const value = useContext(FavoritesContext)
  if (!value) throw new Error('useFavorites must be used inside a FavoritesProvider')
  return value
}
