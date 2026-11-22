import { describe, expect, test } from "bun:test";

import { isProjectPage, viewTransitionTypes } from "./view-transition";

describe("isProjectPage", () => {
	test.each([
		["/projects/portfolio", true],
		["/projects/portfolio/", true],
		["/projects/start-theme", true],
		["/projects", false],
		["/projects/", false],
		["/projects/portfolio/extra", false],
		["/", false],
		["/about/projects/portfolio", false],
		[undefined, false],
	])("%p → %p", (pathname, expected) => {
		expect(isProjectPage(pathname)).toBe(expected);
	});
});

describe("viewTransitionTypes", () => {
	test("entering a project page scales the title up", () => {
		expect(viewTransitionTypes("/", "/projects/portfolio")).toEqual([
			"to-project",
		]);
		expect(viewTransitionTypes("/projects", "/projects/portfolio")).toEqual([
			"to-project",
		]);
	});

	test("leaving a project page scales the title down", () => {
		expect(viewTransitionTypes("/projects/portfolio", "/projects")).toEqual([
			"from-project",
		]);
		expect(viewTransitionTypes("/projects/portfolio", "/")).toEqual([
			"from-project",
		]);
	});

	test("project to project counts as entering", () => {
		expect(
			viewTransitionTypes("/projects/portfolio", "/projects/start-theme"),
		).toEqual(["to-project"]);
	});

	test("other navigations, including the first load, are plain page fades", () => {
		expect(viewTransitionTypes("/", "/projects")).toEqual(["page"]);
		expect(viewTransitionTypes(undefined, "/")).toEqual(["page"]);
	});
});
