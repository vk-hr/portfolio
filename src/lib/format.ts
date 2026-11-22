// Project dates are date-only ISO strings (UTC midnight); format them in UTC so
// the server and every browser render the same day.
export const shortDate = new Intl.DateTimeFormat("en-US", {
	timeZone: "UTC",
	month: "short",
	day: "numeric",
});

export const mediumDate = new Intl.DateTimeFormat("en-US", {
	timeZone: "UTC",
	year: "numeric",
	month: "short",
	day: "numeric",
});

export const longDate = new Intl.DateTimeFormat("en-US", {
	timeZone: "UTC",
	year: "numeric",
	month: "long",
	day: "numeric",
});
