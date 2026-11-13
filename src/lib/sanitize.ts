/**
 * Escapes characters that have special meaning in regular expressions.
 * Prevents ReDoS (Regular Expression Denial of Service) and regex injection.
 */
export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Sanitizes search input to prevent injection and excessive query lengths.
 */
export function sanitizeSearchQuery(input: string | null | undefined, maxLength: number = 80): string {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();
  if (trimmed.length > maxLength) {
    return escapeRegex(trimmed.slice(0, maxLength));
  }
  return escapeRegex(trimmed);
}
