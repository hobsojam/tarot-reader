import { cardImageWidths, type CardImageVariant } from '../domain/card-image'
import manifest from './card-image-manifest.json'

export interface CardImageSize {
  readonly width: number
  readonly height: number
}

type Variants = Readonly<Record<string, CardImageSize>>

const faces: Readonly<Record<string, { readonly variants: Variants }>> =
  manifest.cards

/** Intrinsic size of a card face variant, from the generated manifest. */
export function cardFaceSize(
  id: string,
  variant: CardImageVariant = 'full',
): CardImageSize | undefined {
  return faces[id]?.variants[cardImageWidths[variant]]
}

export const cardBackSize: CardImageSize =
  manifest.back.variants[cardImageWidths.full]
