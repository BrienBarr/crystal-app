import type { Chakra, Element, ZodiacSign } from './types.ts'

export const CHAKRAS: readonly Chakra[] = [
  'root',
  'sacral',
  'solar-plexus',
  'heart',
  'throat',
  'third-eye',
  'crown',
]

export const ZODIAC_SIGNS: readonly ZodiacSign[] = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
]

export const ELEMENTS: readonly Element[] = ['earth', 'water', 'fire', 'air', 'spirit']

export const INTENTIONS: readonly string[] = [
  'abundance',
  'anxiety',
  'balance',
  'calm',
  'change',
  'clarity',
  'communication',
  'compassion',
  'confidence',
  'courage',
  'creativity',
  'detox',
  'dreams',
  'emotional healing',
  'energy',
  'focus',
  'forgiveness',
  'friendship',
  'grief',
  'grounding',
  'harmony',
  'healing',
  'intuition',
  'joy',
  'love',
  'luck',
  'manifestation',
  'meditation',
  'motivation',
  'patience',
  'protection',
  'psychic abilities',
  'purification',
  'self-love',
  'sleep',
  'spiritual growth',
  'strength',
  'stress relief',
  'success',
  'transformation',
  'truth',
  'wisdom',
]

export const CHAKRA_COLORS: Record<Chakra, string> = {
  root: '#c0392b',
  sacral: '#e67e22',
  'solar-plexus': '#f1c40f',
  heart: '#27ae60',
  throat: '#2e86de',
  'third-eye': '#4b3fa8',
  crown: '#8e44ad',
}

export const CHAKRA_LABELS: Record<Chakra, string> = {
  root: 'Root',
  sacral: 'Sacral',
  'solar-plexus': 'Solar Plexus',
  heart: 'Heart',
  throat: 'Throat',
  'third-eye': 'Third Eye',
  crown: 'Crown',
}
