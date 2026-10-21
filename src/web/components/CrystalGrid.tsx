import type { Crystal } from '../../core/types.ts'
import { CrystalCard } from './CrystalCard.tsx'
import styles from './CrystalGrid.module.css'

export function CrystalGrid({ crystals }: { crystals: Crystal[] }) {
  return (
    <ul className={styles.grid} aria-label="Crystals">
      {crystals.map((crystal) => (
        <li key={crystal.slug}>
          <CrystalCard crystal={crystal} />
        </li>
      ))}
    </ul>
  )
}
