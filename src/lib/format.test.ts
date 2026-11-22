import { afterEach, describe, expect, test } from "bun:test";

// Project dates are date-only strings parsed as UTC midnight. Formatting them
// in local time would show the previous day west of UTC, so a server in UTC
// and a browser in California would disagree. The formatters are built when
// the module loads, so each time zone gets a fresh copy of the module.
const originalTZ = process.env.TZ;
afterEach(() => {
	process.env.TZ = originalTZ;
});

async function loadFormatIn(tz: string) {
	process.env.TZ = tz;
	return (await import(
		`./format.ts?tz=${encodeURIComponent(tz)}`
	)) as typeof import("./format");
}

describe.each(["UTC", "America/Los_Angeles", "Pacific/Kiritimati"])(
	"in time zone %s",
	(tz) => {
		test("formats the calendar date written in the content", async () => {
			const { shortDate, mediumDate, longDate } = await loadFormatIn(tz);
			const date = new Date("2026-01-01");
			expect(shortDate.format(date)).toBe("Jan 1");
			expect(mediumDate.format(date)).toBe("Jan 1, 2026");
			expect(longDate.format(date)).toBe("January 1, 2026");
		});
	},
);
