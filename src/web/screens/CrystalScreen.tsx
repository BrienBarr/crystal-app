import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCrystal } from '../../hooks/useCrystals.ts'
import { useFavorites } from '../../hooks/favorites.tsx'
import { useBrowseState } from '../../hooks/browseState.tsx'
import { CHAKRA_COLORS, CHAKRA_LABELS } from '../../core/vocabulary.ts'
import { Badge } from '../components/Badge.tsx'
import { CrystalImage } from '../components/CrystalImage.tsx'
import { NotFound } from '../components/NotFound.tsx'
import { capitalize } from '../facets.ts'
import styles from './CrystalScreen.module.css'

function SafeFlag({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={ok ? styles.yes : styles.no}>
      <span aria-hidden="true">{ok ? '✓ ' : '✗ '}</span>
      {ok ? label : `Not ${label.toLowerCase()}`}
    </span>
  )
}

export function CrystalScreen() {
  const { slug = '' } = useParams()
  const { crystal, loading } = useCrystal(slug)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { searchIntention } = useBrowseState()
  const navigate = useNavigate()
  const location = useLocation()

  if (loading) return <main className="page" />
  if (!crystal) return <NotFound message="Crystal not found" />

  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/'))
  const favorite = isFavorite(crystal.slug)
  const { care, image } = crystal

  return (
    <main className="page">
      <div className={styles.hero}>
        <CrystalImage crystal={crystal} className={styles.heroImage} alt={crystal.name} loading="eager" />
        <button type="button" className={styles.back} onClick={goBack} aria-label="Back">
          ‹
        </button>
      </div>

      <div className={styles.titleRow}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            {crystal.name}
          </h1>
          {crystal.aliases.length > 0 && <p className={styles.aliases}>{crystal.aliases.join(' · ')}</p>}
        </div>
        <button
          type="button"
          className={styles.favorite}
          aria-label="Favorite"
          aria-pressed={favorite}
          onClick={() => toggleFavorite(crystal.slug)}
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>

      <div className={styles.badges}>
        {crystal.chakras.map((c) => (
          <Badge key={c} color={CHAKRA_COLORS[c]}>
            {CHAKRA_LABELS[c]}
          </Badge>
        ))}
        {crystal.zodiac.map((z) => (
          <Badge key={z}>{capitalize(z)}</Badge>
        ))}
        {crystal.elements.map((e) => (
          <Badge key={e}>{capitalize(e)}</Badge>
        ))}
      </div>

      <div className={styles.intentions}>
        {crystal.intentions.map((intention) => (
          <button
            key={intention}
            type="button"
            className={styles.intention}
            onClick={() => {
              searchIntention(intention)
              navigate('/')
            }}
          >
            {intention}
          </button>
        ))}
      </div>

      <section className={styles.section}>
        <h2>Metaphysical properties</h2>
        <p>{crystal.metaphysical}</p>
      </section>

      <section className={styles.section}>
        <h2>Healing properties</h2>
        <p>{crystal.healing}</p>
      </section>

      <section className={styles.care}>
        <h2>Care</h2>
        <ul className={styles.careList}>
          <li>Hardness: Mohs {care.hardness}</li>
          <li>
            <SafeFlag ok={care.waterSafe} label="Water safe" />
          </li>
          <li>
            <SafeFlag ok={care.sunSafe} label="Sun safe" />
          </li>
          <li>Cleanse with: {care.cleansing.join(', ')}</li>
        </ul>
        {care.notes && (
          <p className={styles.note} role="note">
            ⚠️ {care.notes}
          </p>
        )}
      </section>

      <p className={styles.credit}>
        Photo: {image.credit} ·{' '}
        <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">
          {image.license}
        </a>
      </p>
    </main>
  )
}
