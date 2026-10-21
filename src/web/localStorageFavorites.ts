import type { FavoritesStore } from '../core/favorites.ts'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

function parse(raw: string | null): string[] {
  if (!raw) return []
  try {
    const value: unknown = JSON.parse(raw)
    if (!Array.isArray(value)) return []
    return [...new Set(value.filter((v): v is string => typeof v === 'string'))]
  } catch {
    return []
  }
}

/**
 * Favorites persisted in localStorage. If storage is unavailable or throws
 * (private browsing, quota), favorites keep working in memory for the session.
 */
export function createLocalStorageFavoritesStore(
  storage?: StorageLike,
  key = 'crystals.favorites.v1',
): FavoritesStore {
  let fallback: string[] | null = null

  const resolve = (): StorageLike | undefined => {
    if (storage) return storage
    try {
      return globalThis.localStorage
    } catch {
      return undefined
    }
  }

  return {
    load() {
      if (fallback) return [...fallback]
      try {
        return parse(resolve()?.getItem(key) ?? null)
      } catch {
        return []
      }
    },
    save(slugs) {
      try {
        const target = resolve()
        if (!target) throw new Error('storage unavailable')
        target.setItem(key, JSON.stringify(slugs))
        fallback = null
      } catch {
        fallback = [...slugs]
      }
    },
  }
}
