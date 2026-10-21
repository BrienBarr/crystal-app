import { Link } from 'react-router-dom'
import type { Crystal } from '../../core/types.ts'
import { CHAKRA_COLORS } from '../../core/vocabulary.ts'
import { CrystalImage } from './CrystalImage.tsx'
import styles from './CrystalCard.module.css'

export function CrystalCard({ crystal }: { crystal: Crystal }) {
  return (
    <Link to={`/crystal/${crystal.slug}`} className={styles.card}>
      <CrystalImage crystal={crystal} className={styles.image} />
      <span className={styles.body}>
        <span className={styles.name}>{crystal.name}</span>
        <span className={styles.dots} aria-hidden="true">
          {crystal.chakras.map((chakra) => (
            <span key={chakra} className={styles.dot} style={{ background: CHAKRA_COLORS[chakra] }} />
          ))}
        </span>
      </span>
    </Link>
  )
}
