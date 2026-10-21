export type Chakra =
  | 'root'
  | 'sacral'
  | 'solar-plexus'
  | 'heart'
  | 'throat'
  | 'third-eye'
  | 'crown'

export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces'

export type Element = 'earth' | 'water' | 'fire' | 'air' | 'spirit'

export interface Care {
  /** Mohs hardness; may be fractional (e.g. 5.5). */
  hardness: number
  waterSafe: boolean
  /** False if the stone fades or is damaged by sunlight. */
  sunSafe: boolean
  cleansing: string[]
  /** Warnings, e.g. toxicity. Highlighted in the UI. */
  notes?: string
}

export interface CrystalImage {
  /** File name in public/crystals/, always `${slug}.webp`. */
  file: string
  credit: string
  license: string
  sourceUrl: string
}

export interface Crystal {
  slug: string
  name: string
  aliases: string[]
  colors: string[]
  chakras: Chakra[]
  zodiac: ZodiacSign[]
  elements: Element[]
  intentions: string[]
  metaphysical: string
  healing: string
  care: Care
  image: CrystalImage
}
