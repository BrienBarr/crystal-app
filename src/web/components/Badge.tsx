import type { ReactNode } from 'react'
import styles from './Badge.module.css'

export function Badge({ color, children }: { color?: string; children: ReactNode }) {
  return (
    <span className={styles.badge}>
      {color && <span className={styles.dot} style={{ background: color }} aria-hidden="true" />}
      {children}
    </span>
  )
}
