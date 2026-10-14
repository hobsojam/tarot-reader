export const cardImageWidths = { thumbnail: 280, full: 420 } as const

export type CardImageVariant = keyof typeof cardImageWidths

// The deck explorer grid slot measures 113–121 CSS px.
export const explorerThumbnailSizes = '8rem'

export function cardFaceSrc(
  id: string,
  baseUrl: string,
  variant: CardImageVariant = 'full',
): string {
  return `${baseUrl}cards/${id}-${cardImageWidths[variant]}.webp`
}

export function cardFaceSrcSet(id: string, baseUrl: string): string {
  return (['thumbnail', 'full'] as const)
    .map(
      (variant) =>
        `${cardFaceSrc(id, baseUrl, variant)} ${cardImageWidths[variant]}w`,
    )
    .join(', ')
}

export function cardBackSrc(baseUrl: string): string {
  return `${baseUrl}card-back-${cardImageWidths.full}.webp`
}
