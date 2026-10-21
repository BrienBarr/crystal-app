import { useMemo } from 'react'
import { useCrystals } from '../../hooks/useCrystals.ts'
import { useFavorites } from '../../hooks/favorites.tsx'
import { CrystalGrid } from '../components/CrystalGrid.tsx'

export function FavoritesScreen() {
  const { crystals, loading } = useCrystals()
  const { slugs } = useFavorites()
  // Slugs for crystals no longer in the dataset are silently skipped.
  const favorites = useMemo(() => crystals.filter((c) => slugs.includes(c.slug)), [crystals, slugs])

  return (
    <main className="page">
      <h1 className="page-title">Favorites</h1>
      {loading ? null : favorites.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No favorites yet. Tap ♥ on any crystal to save it here.</p>
      ) : (
        <CrystalGrid crystals={favorites} />
      )}
    </main>
  )
}
