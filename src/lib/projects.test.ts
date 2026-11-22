import { describe, expect, test } from "bun:test";

import { allProjects } from "content-collections";

import { getProject, listFeaturedProjects, listProjects } from "./projects";

describe("projects", () => {
	test("hides archived projects", () => {
		const archived = allProjects.filter((p) => p.status === "archived");
		for (const project of archived) {
			expect(getProject(project.slug)).toBeUndefined();
		}
		expect(listProjects().every((p) => p.status !== "archived")).toBe(true);
	});

	test("lists newest first and respects the limit", () => {
		const dates = listProjects().map((p) => p.date);
		expect(dates).toEqual([...dates].sort().reverse());
		expect(listProjects(1)).toHaveLength(Math.min(1, dates.length));
	});

	test("featured is a subset of visible projects", () => {
		const visible = new Set(listProjects().map((p) => p.slug));
		for (const project of listFeaturedProjects()) {
			expect(project.featured).toBe(true);
			expect(visible.has(project.slug)).toBe(true);
		}
	});

	test("resolves technology slugs to name and colour", () => {
		for (const project of listProjects()) {
			for (const tech of project.technologies) {
				expect(tech.name).toBeString();
				expect(tech.color).toBeString();
			}
		}
	});

	test("summaries omit the rendered body; details include it", () => {
		const [first] = listProjects();
		if (!first) return;
		expect("html" in first).toBe(false);
		expect(getProject(first.slug)?.html).toBeString();
	});

	test("unknown slugs return undefined", () => {
		expect(getProject("does-not-exist")).toBeUndefined();
	});
});
