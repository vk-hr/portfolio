import { describe, expect, test } from "bun:test";

import { allProjects, type Project } from "content-collections";

import {
	createProjectStore,
	getProject,
	listFeaturedProjects,
	listProjects,
} from "./projects";

const technologyMap = {
	react: { name: "React", color: "cyan" },
	bun: { name: "Bun", color: "amber" },
} as const;

function project(
	slug: string,
	fields: Partial<Omit<Project, "slug" | "_meta">> = {},
): Project {
	return {
		title: slug,
		description: `About ${slug}`,
		status: "completed",
		featured: false,
		date: "2026-01-01",
		technologies: [],
		content: "",
		html: `<p>${slug}</p>`,
		...fields,
		slug,
		_meta: {
			filePath: `${slug}.md`,
			fileName: `${slug}.md`,
			directory: ".",
			path: slug,
			extension: "md",
		},
	};
}

const store = createProjectStore({
	technologyMap,
	projects: [
		project("old", { date: "2024-03-01", featured: true }),
		project("newest", { date: "2026-05-01", technologies: ["react", "bun"] }),
		project("hidden", {
			date: "2026-12-01",
			status: "archived",
			featured: true,
		}),
		project("middle", { date: "2025-07-15", status: "active", featured: true }),
	],
});

describe("project store", () => {
	test("lists visible projects newest first", () => {
		expect(store.listProjects().map((p) => p.slug)).toEqual([
			"newest",
			"middle",
			"old",
		]);
	});

	test("limits the list after sorting", () => {
		expect(store.listProjects(2).map((p) => p.slug)).toEqual([
			"newest",
			"middle",
		]);
	});

	test("featured lists only visible featured projects, newest first", () => {
		expect(store.listFeaturedProjects().map((p) => p.slug)).toEqual([
			"middle",
			"old",
		]);
		expect(store.listFeaturedProjects(1).map((p) => p.slug)).toEqual([
			"middle",
		]);
	});

	test("selected work puts featured projects first, then the newest of the rest", () => {
		expect(store.listSelectedProjects().map((p) => p.slug)).toEqual([
			"middle",
			"old",
			"newest",
		]);
		expect(store.listSelectedProjects(2).map((p) => p.slug)).toEqual([
			"middle",
			"old",
		]);
	});

	test("selected work falls back to the newest projects when none are featured", () => {
		const plain = createProjectStore({
			technologyMap,
			projects: [
				project("a", { date: "2024-01-01" }),
				project("b", { date: "2025-01-01" }),
			],
		});
		expect(plain.listSelectedProjects().map((p) => p.slug)).toEqual(["b", "a"]);
	});

	test("archived projects are hidden everywhere, including by slug", () => {
		expect(store.getProject("hidden")).toBeUndefined();
		expect(store.listProjects().some((p) => p.slug === "hidden")).toBe(false);
		expect(store.listFeaturedProjects().some((p) => p.slug === "hidden")).toBe(
			false,
		);
		expect(store.listSelectedProjects().some((p) => p.slug === "hidden")).toBe(
			false,
		);
	});

	test("resolves technology slugs to name and colour, in content order", () => {
		expect(store.getProject("newest")?.technologies).toEqual([
			{ slug: "react", name: "React", color: "cyan" },
			{ slug: "bun", name: "Bun", color: "amber" },
		]);
	});

	test("lists carry no rendered body; a single project does", () => {
		for (const summary of store.listProjects()) {
			expect(summary).not.toHaveProperty("html");
		}
		expect(store.getProject("newest")?.html).toBe("<p>newest</p>");
	});

	test("unknown slugs return undefined", () => {
		expect(store.getProject("does-not-exist")).toBeUndefined();
	});
});

// The same queries over the real content/ directory.
describe("content/", () => {
	test("every visible project can be opened by its slug", () => {
		const visible = allProjects.filter((p) => p.status !== "archived");
		expect(listProjects()).toHaveLength(visible.length);
		for (const { slug } of listProjects()) {
			expect(getProject(slug)?.slug).toBe(slug);
		}
	});

	test("every featured project is also listed", () => {
		const listed = new Set(listProjects().map((p) => p.slug));
		for (const { slug } of listFeaturedProjects()) {
			expect(listed.has(slug)).toBe(true);
		}
	});
});
