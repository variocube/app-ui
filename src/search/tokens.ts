/**
 * Splits a search input into whitespace-separated tokens, dropping empty entries.
 */
export function tokenize(value: string): string[] {
	return value.trim().split(/\s+/).filter(Boolean);
}

/**
 * Whether two token lists are equal (same tokens in the same order).
 */
export function tokensEqual(a: readonly string[], b: readonly string[]): boolean {
	return a.length === b.length && a.every((token, index) => token === b[index]);
}
