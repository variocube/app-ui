import {tokenize} from "./tokens";

export interface HighlightPart {
	text: string;
	highlight: boolean;
}

/**
 * Splits `text` into parts, marking the parts matched by any whitespace-separated word of `highlight`.
 *
 * Matching is case-insensitive, folds simple diacritics (é matches e) and matches inside words. Each highlight
 * word is matched at most once (its first occurrence); overlapping matches are merged.
 */
export function splitHighlightParts(text: string, highlight: string | undefined): HighlightPart[] {
	const ranges = findRanges(text, highlight);
	const parts: HighlightPart[] = [];
	let position = 0;
	for (const [start, end] of ranges) {
		if (start > position) {
			parts.push({text: text.substring(position, start), highlight: false});
		}
		parts.push({text: text.substring(start, end), highlight: true});
		position = end;
	}
	if (position < text.length) {
		parts.push({text: text.substring(position), highlight: false});
	}
	return parts;
}

function findRanges(text: string, highlight: string | undefined): Array<[number, number]> {
	const foldedText = fold(text);
	const ranges: Array<[number, number]> = [];
	for (const word of tokenize(highlight ?? "")) {
		const foldedWord = fold(word);
		const index = foldedText.indexOf(foldedWord);
		if (index >= 0) {
			ranges.push([index, index + foldedWord.length]);
		}
	}
	return mergeRanges(ranges);
}

function mergeRanges(ranges: Array<[number, number]>): Array<[number, number]> {
	const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
	const merged: Array<[number, number]> = [];
	for (const [start, end] of sorted) {
		const last = merged[merged.length - 1];
		if (last && start <= last[1]) {
			// Safe to mutate: the pushed tuples below are copies, not the caller's.
			last[1] = Math.max(last[1], end);
		}
		else {
			merged.push([start, end]);
		}
	}
	return merged;
}

const NON_ASCII = /[^\x00-\x7F]/;

/**
 * Case-folds and strips simple diacritics from a string, preserving its length so that indexes into the folded
 * string are valid indexes into the original string.
 */
function fold(value: string): string {
	// Fast path: pure ASCII has nothing to decompose, and its lowercasing is length-preserving. Worth it because
	// the per-character path below calls normalize() for every character of every rendered option.
	if (!NON_ASCII.test(value)) {
		return value.toLowerCase();
	}
	let folded = "";
	for (let i = 0; i < value.length; i++) {
		folded += foldChar(value.charAt(i));
	}
	return folded;
}

/**
 * Non-decomposable Latin letters that NFD leaves intact, mapped to an ASCII base letter. Ligatures (æ, œ) and
 * letters without a single-character ASCII equivalent (þ, ß) fold to their first/closest letter so that the
 * folded string keeps the original length.
 */
const FOLD_MAP: Record<string, string> = {
	"ø": "o",
	"ł": "l",
	"đ": "d",
	"ð": "d",
	"þ": "t",
	"æ": "a",
	"œ": "o",
	"ß": "s",
	"ı": "i",
};

function foldChar(char: string): string {
	// NFD decomposes a precomposed character into its base character followed by combining marks; keeping only
	// the first character strips the diacritic while preserving the string length.
	const base = char.normalize("NFD").charAt(0) || char;
	const lower = base.toLowerCase().charAt(0) || char;
	return FOLD_MAP[lower] ?? lower;
}
