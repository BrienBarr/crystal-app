import type { Facet, FilterState } from '../../core/filters.ts'
import { FACETS, activeFilterCount } from '../../core/filters.ts'
import { FACET_LABELS } from '../facets.ts'
import styles from './FilterChips.module.css'

interface Props {
  filters: FilterState
  onOpen(facet: Facet): void
  onClear(): void
}

export function FilterChips({ filters, onOpen, onClear }: Props) {
  return (
    <div className={styles.row}>
      {FACETS.map((facet) => {
        const count = filters[facet].length
        return (
          <button
            key={facet}
            type="button"
            className={`${styles.chip} ${count ? styles.active : ''}`}
            onClick={() => onOpen(facet)}
          >
            {FACET_LABELS[facet]}
            {count > 0 && <span className={styles.count}>{count}</span>}
          </button>
        )
      })}
      {activeFilterCount(filters) > 0 && (
        <button type="button" className={styles.clear} onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  )
}
