import type { Spread } from '../domain/spread'

interface SpreadPickerProps {
  spreads: readonly Spread[]
  selectedId: Spread['id']
  onSelect: (id: Spread['id']) => void
}

export function SpreadPicker({
  spreads,
  selectedId,
  onSelect,
}: SpreadPickerProps) {
  return (
    <fieldset className="spread-picker">
      <legend>Choose a spread</legend>
      {spreads.map((spread) => (
        <label key={spread.id}>
          <input
            checked={spread.id === selectedId}
            name="spread"
            onChange={() => onSelect(spread.id)}
            type="radio"
            value={spread.id}
          />
          {spread.name}
        </label>
      ))}
    </fieldset>
  )
}
