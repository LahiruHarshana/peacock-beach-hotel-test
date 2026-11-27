/** Desktop scroll scenes stay off for reduced motion and narrow screens. */
export function allowsPinnedMotion(width: number, reducedMotion: boolean): boolean {
  return !reducedMotion && width >= 768;
}
