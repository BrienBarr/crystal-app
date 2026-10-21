import { useState } from 'react'
import type { Crystal } from '../../core/types.ts'
import { imageUrl } from '../imageUrl.ts'

interface Props {
  crystal: Crystal
  className?: string
  alt?: string
  loading?: 'lazy' | 'eager'
}

/** Crystal photo that falls back to a neutral placeholder if it fails to load. */
export function CrystalImage({ crystal, className, alt = '', loading = 'lazy' }: Props) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <div className={className} data-placeholder role={alt ? 'img' : undefined} aria-label={alt || undefined} />
  }
  return (
    <img
      className={className}
      src={imageUrl(crystal)}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
