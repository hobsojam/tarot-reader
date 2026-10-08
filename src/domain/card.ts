export type Orientation = 'upright' | 'reversed'

export interface Card {
  id: string
  name: string
  uprightMeaning: string
  themes: readonly string[]
}

export interface DealtCard extends Card {
  orientation: Orientation
}
