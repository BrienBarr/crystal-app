import styles from './UpdateToast.module.css'

interface Props {
  needRefresh: boolean
  onReload(): void
  onDismiss(): void
}

export function UpdateToast({ needRefresh, onReload, onDismiss }: Props) {
  if (!needRefresh) return null
  return (
    <div className={styles.toast} role="status">
      <button type="button" className={styles.reload} onClick={onReload}>
        Updated — tap to reload
      </button>
      <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  )
}
