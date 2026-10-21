import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { EMPTY_FILTERS } from '../core/filters.ts'
import type { Facet, FilterState } from '../core/filters.ts'

interface BrowseStateValue {
  query: string
  setQuery(query: string): void
  filters: FilterState
  toggleFilter(facet: Facet, value: string): void
  clearFilters(): void
  /** Shows every crystal with this intention: sets the query and clears filters. */
  searchIntention(intention: string): void
}

const BrowseStateContext = createContext<BrowseStateValue | null>(null)

/** Holds search text and filters above the routes so they survive navigation. */
export function BrowseStateProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)

  const toggleFilter = useCallback((facet: Facet, value: string) => {
    setFilters((current) => {
      const selected = current[facet]
      const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
      return { ...current, [facet]: next }
    })
  }, [])

  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), [])

  const searchIntention = useCallback((intention: string) => {
    setQuery(intention)
    setFilters(EMPTY_FILTERS)
  }, [])

  const value = useMemo(
    () => ({ query, setQuery, filters, toggleFilter, clearFilters, searchIntention }),
    [query, filters, toggleFilter, clearFilters, searchIntention],
  )

  return <BrowseStateContext.Provider value={value}>{children}</BrowseStateContext.Provider>
}

export function useBrowseState(): BrowseStateValue {
  const value = useContext(BrowseStateContext)
  if (!value) throw new Error('useBrowseState must be used inside a BrowseStateProvider')
  return value
}
