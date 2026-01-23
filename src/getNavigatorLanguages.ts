/**
 * Returns the users preferred languages selected in the browser, or an empty array if not called in a browser context.
 * @see navigator.languages
 */
export function getNavigatorLanguages() {
	if (typeof navigator != "undefined") {
		return navigator.languages || [navigator.language || (navigator as any).userLanguage];
	}
	return [];
}
