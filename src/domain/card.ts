export type Orientation = 'upright' | 'reversed'

export type Arcana = 'major' | 'minor'

export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'

export interface Card {
  id: string
  name: string
  uprightMeaning: string
  reversedMeaning: string
  themes: readonly string[]
  arcana: Arcana
  suit?: Suit
}

export interface DealtCard extends Card {
  orientation: Orientation
}
