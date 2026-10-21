import { useEffect } from 'react'
import type { FacetOption } from '../facets.ts'
import styles from './FilterSheet.module.css'

interface Props {
  title: string
  options: FacetOption[]
  selected: string[]
  swatches?: Record<string, string>
  onToggle(value: string): void
  onClose(): void
}

/** Bottom sheet with a multi-select list of facet values. */
export function FilterSheet({ title, options, selected, swatches, onToggle, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <button type="button" className={styles.backdrop} aria-label="Close" tabIndex={-1} onClick={onClose} />
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.handle} aria-hidden="true" />
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.done} onClick={onClose}>
            Done
          </button>
        </div>
        <div className={styles.options}>
          {options.map((option) => (
            <label key={option.value} className={styles.option}>
              <input
                type="checkbox"
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={() => onToggle(option.value)}
              />
              {swatches?.[option.value] && (
                <span className={styles.swatch} style={{ background: swatches[option.value] }} aria-hidden="true" />
              )}
              {option.label}
            </label>
          ))}
        </div>
      </div>
    </>
  )
}
