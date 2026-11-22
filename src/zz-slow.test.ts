import { expect, test } from "bun:test";
// Sabotage: passes, but takes 31 s; the 30 s test budget must fail CI.
test("slow but green", async () => {
	await Bun.sleep(31_000);
	expect(1).toBe(1);
}, 40_000);
