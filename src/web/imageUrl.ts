import type { Crystal } from '../core/types.ts'

export function imageUrl(crystal: Crystal): string {
  return `${import.meta.env.BASE_URL}crystals/${crystal.image.file}`
}
