import { useCrystals } from '../../hooks/useCrystals.ts'
import styles from './AboutScreen.module.css'

export function AboutScreen() {
  const { crystals } = useCrystals()

  return (
    <main className="page">
      <h1 className="page-title">About</h1>

      <section className={styles.section}>
        <p className={styles.notice}>
          The properties described in this app reflect spiritual and traditional beliefs about crystals. They are
          not medical advice and are not a substitute for care from a qualified professional.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Install on iPhone</h2>
        <ol>
          <li>Open this page in Safari.</li>
          <li>Tap the Share button.</li>
          <li>Choose “Add to Home Screen”.</li>
        </ol>
        <p>The app then works offline, including all photos.</p>
      </section>

      <section className={styles.section}>
        <h2>Photo credits</h2>
        <p>Photos from Wikimedia Commons, used under their listed licenses.</p>
        <ul className={styles.credits} aria-label="Photo credits">
          {crystals.map((c) => (
            <li key={c.slug}>
              {c.name}: {c.image.credit} ·{' '}
              <a href={c.image.sourceUrl} target="_blank" rel="noopener noreferrer">
                {c.image.license}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className={styles.version}>Version {import.meta.env.VITE_APP_VERSION}</p>
    </main>
  )
}
