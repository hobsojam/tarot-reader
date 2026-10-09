export type ReadingFocusId =
  | 'general-guidance'
  | 'relationships'
  | 'work-and-purpose'
  | 'a-decision'
  | 'personal-growth'
  | 'something-else'

export interface ReadingFocus {
  readonly id: ReadingFocusId
  readonly label: string
  readonly narrativeFraming: string
}
