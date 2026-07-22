import {Duration} from "../temporal";
import {
	buildRows,
	changeRowUnit,
	DEFAULT_DURATION_FIELD_UNITS,
	DurationFieldRow,
	durationFromRows,
	getUnitOptions,
	normalizeRows,
	sortUnits,
} from "./DurationFieldModel";

const units = DEFAULT_DURATION_FIELD_UNITS;

function row(unit: DurationFieldRow["unit"], text: string): DurationFieldRow {
	return {unit, text};
}

describe("sortUnits", () => {
	test("orders units from largest to smallest and removes duplicates", () => {
		expect(sortUnits(["days", "years", "days", "months"])).toEqual(["years", "months", "days"]);
	});
});

describe("buildRows", () => {
	test("null value shows two empty pairs with the largest units", () => {
		expect(buildRows(null, units)).toEqual([row("years", ""), row("months", "")]);
	});

	test("null value with constrained units", () => {
		expect(buildRows(null, ["years", "months", "days"])).toEqual([row("years", ""), row("months", "")]);
	});

	test("value rows are followed by one empty pair with the next smaller unit", () => {
		expect(buildRows(Duration.from({months: 5, days: 10}), units)).toEqual([
			row("months", "5"),
			row("days", "10"),
			row("hours", ""),
		]);
	});

	test("no trailing pair after the smallest unit", () => {
		expect(buildRows(Duration.from({days: 3}), ["years", "months", "days"])).toEqual([
			row("days", "3"),
		]);
	});

	test("365 days stay 365 days", () => {
		expect(buildRows(Duration.from({days: 365}), units)).toEqual([
			row("days", "365"),
			row("hours", ""),
		]);
	});

	test("units outside the allowed set are still displayed", () => {
		expect(buildRows(Duration.from({weeks: 2}), ["years", "months", "days"])).toEqual([
			row("weeks", "2"),
			row("days", ""),
		]);
	});
});

describe("normalizeRows", () => {
	test("typing into the first pair keeps the empty second pair", () => {
		// [5][y] [<empty>][m]
		const rows = normalizeRows([row("years", "5"), row("months", "")], units, 0);
		expect(rows).toEqual([row("years", "5"), row("months", "")]);
	});

	test("typing into the trailing pair adds another pair with the next smaller unit", () => {
		// [5][m] [10][d] -> [5][m] [10][d] [<empty>][h]
		const rows = normalizeRows([row("months", "5"), row("days", "10")], units, 1);
		expect(rows).toEqual([row("months", "5"), row("days", "10"), row("hours", "")]);
	});

	test("clearing the last filled pair removes the trailing pair again", () => {
		// [5][m] [<cleared>][d] [<empty>][h] -> [5][m] [<empty>][d]
		const rows = normalizeRows([row("months", "5"), row("days", ""), row("hours", "")], units, 1);
		expect(rows).toEqual([row("months", "5"), row("days", "")]);
	});

	test("clearing the only filled pair restores the two empty pairs", () => {
		const rows = normalizeRows([row("years", "")], units, 0);
		expect(rows).toEqual([row("years", ""), row("months", "")]);
	});

	test("a cleared pair in the middle is kept while it is being edited", () => {
		const rows = normalizeRows(
			[row("years", "5"), row("months", ""), row("days", "20"), row("hours", "")],
			units,
			1,
		);
		expect(rows).toEqual([row("years", "5"), row("months", ""), row("days", "20"), row("hours", "")]);
	});
});

describe("changeRowUnit", () => {
	test("changing the unit moves a conflicting empty pair to the next smaller unit", () => {
		// [5][y] [<empty>][m], change years to months -> [5][m] [<empty>][d]
		const rows = changeRowUnit([row("years", "5"), row("months", "")], units, 0, "months");
		expect(rows).toEqual([row("months", "5"), row("days", "")]);
	});

	test("changing the unit to the smallest removes the trailing empty pair", () => {
		const rows = changeRowUnit([row("years", "5"), row("months", "")], ["years", "months"], 0, "months");
		expect(rows).toEqual([row("months", "5")]);
	});

	test("an empty pair conflicting with a following filled pair is removed", () => {
		// [5][y] [<empty>][m] [20][d], change years to months
		const rows = changeRowUnit(
			[row("years", "5"), row("months", ""), row("days", "20"), row("hours", "")],
			units,
			0,
			"months",
		);
		expect(rows).toEqual([row("months", "5"), row("days", "20"), row("hours", "")]);
	});
});

describe("getUnitOptions", () => {
	test("first pair offers all allowed units", () => {
		const rows = [row("years", ""), row("months", "")];
		expect(getUnitOptions(rows, units, 0)).toEqual(units);
	});

	test("subsequent pairs only offer units smaller than the previous pair", () => {
		const rows = [row("months", "5"), row("days", "")];
		expect(getUnitOptions(rows, units, 1)).toEqual(["days", "hours", "minutes", "seconds"]);
	});

	test("pairs before a filled pair only offer larger units", () => {
		const rows = [row("years", "5"), row("days", "20"), row("hours", "")];
		expect(getUnitOptions(rows, units, 0)).toEqual(["years", "months"]);
	});

	test("the current unit is offered even when outside the allowed set", () => {
		const rows = [row("weeks", "2"), row("days", "")];
		expect(getUnitOptions(rows, ["years", "months", "days"], 0)).toEqual(["years", "months", "weeks", "days"]);
	});
});

describe("durationFromRows", () => {
	test("builds a duration from the filled pairs", () => {
		const duration = durationFromRows([row("months", "5"), row("days", "10"), row("hours", "")]);
		expect(duration?.toString()).toBe("P5M10D");
	});

	test("does not convert units", () => {
		const duration = durationFromRows([row("days", "365"), row("hours", "")]);
		expect(duration?.toString()).toBe("P365D");
	});

	test("returns null when nothing is entered", () => {
		expect(durationFromRows([row("years", ""), row("months", "")])).toBeNull();
	});

	test("ignores zero amounts", () => {
		expect(durationFromRows([row("years", "0"), row("months", "")])).toBeNull();
	});
});
