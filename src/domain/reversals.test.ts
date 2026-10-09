import { expect, it } from 'vitest'

import { reversedChanceFromStartupOption } from './reversals'

it('keeps reversals enabled unless the startup option disables them', () => {
  expect(reversedChanceFromStartupOption(undefined)).toBe(0.2)
  expect(reversedChanceFromStartupOption('true')).toBe(0)
})
