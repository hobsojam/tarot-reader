export function reversedChanceFromStartupOption(
  disableReversals: string | undefined,
): number {
  return disableReversals === 'true' ? 0 : 0.2
}
