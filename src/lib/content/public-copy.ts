export const PLACEHOLDER_MARK = "CONTENT REQUIRED";

export function isPlaceholderCopy(value: string | null | undefined): boolean {
  const text = value?.trim();
  return !text || text.includes(PLACEHOLDER_MARK);
}

/** Visitor-facing text. Placeholder and empty values stay unpublished. */
export function publicText(value: string | null | undefined, unpublished: string): string {
  return isPlaceholderCopy(value) ? unpublished : value!.trim();
}
