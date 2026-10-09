export interface SpreadPosition {
  id: string
  label: string
  row: number
  column: number
  readingOrder: number
  prompt: string
  lens: string
  synthesisTemplate: string
}

export interface Spread {
  id: 'three-card' | 'five-card' | 'celtic-cross'
  name: string
  positions: readonly SpreadPosition[]
  reflectionAnchorPositionId: string
}
