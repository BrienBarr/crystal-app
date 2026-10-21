import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useCrystals } from '../../hooks/useCrystals.ts'
import { useBrowseState } from '../../hooks/browseState.tsx'
import { filterCrystals } from '../../core/filters.ts'
import type { Facet } from '../../core/filters.ts'
import { searchCrystals } from '../../core/search.ts'
import { CHAKRA_COLORS } from '../../core/vocabulary.ts'
import { CrystalGrid } from '../components/CrystalGrid.tsx'
import { FilterChips } from '../components/FilterChips.tsx'
import { FilterSheet } from '../components/FilterSheet.tsx'
import { FACET_LABELS, facetOptions } from '../facets.ts'
import { saveBrowseScroll, takeBrowseScroll } from '../scrollMemory.ts'
import styles from './BrowseScreen.module.css'

export function BrowseScreen() {
  const { crystals, loading, error, retry } = useCrystals()
  const { query, setQuery, filters, toggleFilter, clearFilters } = useBrowseState()
  const [openFacet, setOpenFacet] = useState<Facet | null>(null)
  const closeSheet = useCallback(() => setOpenFacet(null), [])

  const results = useMemo(
    () => searchCrystals(filterCrystals(crystals, filters), query),
    [crystals, filters, query],
  )

  // Restore the grid position on return; save it when leaving.
  const searchKey = JSON.stringify([query, filters])
  const searchKeyRef = useRef(searchKey)
  searchKeyRef.current = searchKey
  useLayoutEffect(() => {
    if (loading) return
    const y = takeBrowseScroll(searchKeyRef.current)
    if (y !== null) window.scrollTo(0, y)
  }, [loading])
  useEffect(() => () => saveBrowseScroll(searchKeyRef.current, window.scrollY), [])

  const resetAll = () => {
    setQuery('')
    clearFilters()
  }

  return (
    <main className="page">
      <div className={styles.header}>
        <h1 className="visually-hidden">Crystals</h1>
        <input
          type="search"
          className={styles.search}
          aria-label="Search crystals"
          placeholder="Search by name or intention"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          enterKeyHint="search"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
        />
        <FilterChips filters={filters} onOpen={setOpenFacet} onClear={clearFilters} />
      </div>

      {error ? (
        <div className={styles.status}>
          <p>Couldn't load crystals.</p>
          <button type="button" className={styles.button} onClick={retry}>
            Try again
          </button>
        </div>
      ) : loading ? (
        <p className={styles.status}>Loading…</p>
      ) : results.length === 0 ? (
        <div className={styles.empty}>
          <p>No crystals match</p>
          <button type="button" className={styles.button} onClick={resetAll}>
            Clear filters
          </button>
        </div>
      ) : (
        <CrystalGrid crystals={results} />
      )}

      {openFacet && (
        <FilterSheet
          title={FACET_LABELS[openFacet]}
          options={facetOptions(openFacet, crystals)}
          selected={filters[openFacet]}
          swatches={openFacet === 'chakras' ? CHAKRA_COLORS : undefined}
          onToggle={(value) => toggleFilter(openFacet, value)}
          onClose={closeSheet}
        />
      )}
    </main>
  )
}
