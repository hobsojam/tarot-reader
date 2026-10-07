export interface SpreadPosition {
  id: string
  label: string
  row: number
  column: number
}

export interface Spread {
  id: 'three-card' | 'five-card' | 'celtic-cross'
  name: string
  positions: readonly SpreadPosition[]
}
