import {Duration} from "../temporal";

/**
 * A unit that can be edited in a `DurationField`.
 */
export type DurationFieldUnit = "years" | "months" | "weeks" | "days" | "hours" | "minutes" | "seconds";

/**
 * All supported units, ordered from largest to smallest.
 */
export const DURATION_FIELD_UNITS: ReadonlyArray<DurationFieldUnit> = [
	"years",
	"months",
	"weeks",
	"days",
	"hours",
	"minutes",
	"seconds",
];

/**
 * The default units offered by `DurationField`.
 * Excludes `weeks`, which callers can opt into via the `units` prop.
 */
export const DEFAULT_DURATION_FIELD_UNITS: ReadonlyArray<DurationFieldUnit> = [
	"years",
	"months",
	"days",
	"hours",
	"minutes",
	"seconds",
];

/**
 * A single number+unit pair displayed by `DurationField`.
 * The amount is kept as the entered text; an empty string means "no amount entered".
 */
export interface DurationFieldRow {
	unit: DurationFieldUnit;
	text: string;
}

function rank(unit: DurationFieldUnit) {
	return DURATION_FIELD_UNITS.indexOf(unit);
}

/**
 * Returns the given units without duplicates, ordered from largest to smallest.
 */
export function sortUnits(units: ReadonlyArray<DurationFieldUnit>): DurationFieldUnit[] {
	return [...new Set(units)].sort((a, b) => rank(a) - rank(b));
}

/**
 * Parses the entered text into a positive integer amount, or null if empty/zero/invalid.
 */
export function parseAmount(text: string): number | null {
	const amount = Number.parseInt(text, 10);
	return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

function isFilled(row: DurationFieldRow) {
	return row.text !== "";
}

function nextSmallerUnit(unit: DurationFieldUnit, units: ReadonlyArray<DurationFieldUnit>) {
	return units.find(candidate => rank(candidate) > rank(unit));
}

/**
 * Builds the rows for a duration value: one row per non-zero component, normalized.
 */
export function buildRows(
	value: Duration | null | undefined,
	units: ReadonlyArray<DurationFieldUnit>,
): DurationFieldRow[] {
	const filled = DURATION_FIELD_UNITS
		.filter(unit => value != null && value[unit] !== 0)
		.map(unit => ({unit, text: String(value![unit])}));
	return normalizeRows(filled, units);
}

/**
 * Normalizes rows after an edit:
 * - While no amount is entered at all, the displayed empty rows are kept (at least two, so the
 *   user sees that a duration can consist of multiple pairs).
 * - Otherwise, empty rows are removed (except the row at `focusIndex`, which the user is editing),
 *   and a single trailing empty row with the next smaller unit is appended as the slot for
 *   entering the next component.
 */
export function normalizeRows(
	rows: ReadonlyArray<DurationFieldRow>,
	units: ReadonlyArray<DurationFieldUnit>,
	focusIndex?: number,
): DurationFieldRow[] {
	if (!rows.some(isFilled)) {
		const result = rows.length > 0 ? [...rows] : units.slice(0, 1).map(unit => ({unit, text: ""}));
		if (result.length === 1) {
			const next = nextSmallerUnit(result[0].unit, units);
			if (next) {
				result.push({unit: next, text: ""});
			}
		}
		return result;
	}
	const result = rows.filter((row, index) => isFilled(row) || index === focusIndex);
	const last = result[result.length - 1];
	if (isFilled(last)) {
		const next = nextSmallerUnit(last.unit, units);
		if (next) {
			result.push({unit: next, text: ""});
		}
	}
	return result;
}

/**
 * Changes the unit of the row at `index` and resolves conflicts with subsequent rows:
 * an empty row whose unit no longer is smaller than its predecessor's is moved to the next
 * smaller available unit, or removed when no such unit exists.
 */
export function changeRowUnit(
	rows: ReadonlyArray<DurationFieldRow>,
	units: ReadonlyArray<DurationFieldUnit>,
	index: number,
	unit: DurationFieldUnit,
): DurationFieldRow[] {
	const result = rows.map((row, i) => i === index ? {...row, unit} : row);
	for (let i = index + 1; i < result.length; i++) {
		if (rank(result[i].unit) > rank(result[i - 1].unit)) {
			continue;
		}
		// only empty rows can conflict, since the unit options of filled rows are constrained
		const next = nextSmallerUnit(result[i - 1].unit, units);
		const followingFilled = result.slice(i + 1).find(isFilled);
		if (next && (!followingFilled || rank(next) < rank(followingFilled.unit))) {
			result[i] = {...result[i], unit: next};
		}
		else {
			result.splice(i, 1);
			i--;
		}
	}
	return result;
}

/**
 * Returns the units selectable for the row at `index`: all allowed units strictly smaller than
 * the previous row's unit and strictly larger than the next filled row's unit. The row's current
 * unit is always included, so a value with units outside the allowed set still displays correctly.
 */
export function getUnitOptions(
	rows: ReadonlyArray<DurationFieldRow>,
	units: ReadonlyArray<DurationFieldUnit>,
	index: number,
): DurationFieldUnit[] {
	const previous = rows[index - 1];
	const nextFilled = rows.slice(index + 1).find(isFilled);
	const options = units.filter(unit =>
		(!previous || rank(unit) > rank(previous.unit))
		&& (!nextFilled || rank(unit) < rank(nextFilled.unit))
	);
	const current = rows[index].unit;
	if (!options.includes(current)) {
		options.push(current);
		options.sort((a, b) => rank(a) - rank(b));
	}
	return options;
}

/**
 * Builds the duration from the entered rows, or null if no amount is entered.
 */
export function durationFromRows(rows: ReadonlyArray<DurationFieldRow>): Duration | null {
	const fields: Partial<Record<DurationFieldUnit, number>> = {};
	for (const row of rows) {
		const amount = parseAmount(row.text);
		if (amount != null) {
			fields[row.unit] = amount;
		}
	}
	return Object.keys(fields).length > 0 ? Duration.from(fields) : null;
}
