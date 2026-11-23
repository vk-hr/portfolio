/**
 * Smoke tests against the production build, over HTTP: every route renders on
 * the server with the right status, title and content, and the theme cookie
 * reaches the bootstrap script that runs before first paint.
 *
 *   bun --bun vite build && bun test ./e2e
 *
 * Plain `bun test` skips this directory (`*.e2e.ts` is not a test file name
 * it looks for), so the unit tests don't need a build.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { allProjects } from "content-collections";
import { Window } from "happy-dom";

import { SOCIAL_LINKS } from "#/lib/constants";
import { listProjects, listSelectedProjects } from "#/lib/projects";
import { HOME_DESCRIPTION, HOME_TITLE } from "#/lib/site";

const SERVER = ".output/server/index.mjs";

// The test preload installs happy-dom as the global DOM, including its
// browser fetch with CORS. These tests talk to a real server, so they use
// Bun's own fetch and parse HTML with a private happy-dom window.
if (GlobalRegistrator.isRegistered) await GlobalRegistrator.unregister();
const parser = new new Window().DOMParser();
type ParsedElement = NonNullable<
	ReturnType<ReturnType<typeof parser.parseFromString>["querySelector"]>
>;

let server: Bun.Subprocess | undefined;
let base = "";

beforeAll(async () => {
	if (!(await Bun.file(SERVER).exists())) {
		throw new Error(`${SERVER} is missing: run \`bun --bun vite build\` first`);
	}
	// Ask the OS for a free port, then hand it to the server.
	const probe = Bun.serve({ port: 0, fetch: () => new Response() });
	const port = probe.port;
	await probe.stop(true);

	server = Bun.spawn(["bun", SERVER], {
		env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
		stdout: "ignore",
		stderr: "inherit",
	});
	base = `http://127.0.0.1:${port}`;
	for (let i = 0; i < 100; i++) {
		try {
			await fetch(base);
			return;
		} catch {
			await Bun.sleep(50);
		}
	}
	throw new Error(`server did not start on ${base} within 5 s`);
});

afterAll(() => {
	server?.kill();
});

async function get(path: string, headers: Record<string, string> = {}) {
	const response = await fetch(base + path, { headers });
	const html = await response.text();
	const doc = parser.parseFromString(html, "text/html");
	return { status: response.status, html, doc };
}

/** Text as a reader sees it: line breaks become spaces, whitespace collapses. */
function text(el: ParsedElement | null | undefined) {
	if (!el) return undefined;
	const copy = el.cloneNode(true) as ParsedElement;
	for (const br of copy.querySelectorAll("br")) br.replaceWith(" ");
	return copy.textContent?.replace(/\s+/g, " ").trim();
}

/** The theme the bootstrap script applies before first paint. */
function themeBeforePaint(html: string) {
	// start-theme ends its inline script with `})(...["dark","class",…])`.
	const call = html.match(/\}\)\(\.\.\.(\[[^\]]*\])\)/);
	return call?.[1] && (JSON.parse(call[1]) as [string, ...Array<unknown>])[0];
}

const visible = listProjects();

describe("home page", () => {
	test("renders the hero and the selected work", async () => {
		const { status, doc } = await get("/");
		expect(status).toBe(200);
		expect(text(doc.querySelector("#hero-title"))).toBe("Hi, I'm Viktor.");
		const cards = [...doc.querySelectorAll("button[aria-haspopup=dialog]")];
		const selected = listSelectedProjects(6);
		expect(cards).toHaveLength(selected.length);
		selected.forEach((project, i) => {
			expect(text(cards[i])).toContain(project.title);
		});
	});

	test("has exactly one title and description, naming Viktor", async () => {
		const { doc } = await get("/");
		const titles = [...doc.querySelectorAll("title")];
		const descriptions = [...doc.querySelectorAll('meta[name="description"]')];
		expect(titles.map((t) => text(t))).toEqual([HOME_TITLE]);
		expect(descriptions.map((m) => m.getAttribute("content"))).toEqual([
			HOME_DESCRIPTION,
		]);
		expect(HOME_TITLE).toContain("Viktor");
	});

	test("the contact section and the header link lead to email", async () => {
		const { doc } = await get("/");
		expect(
			doc.querySelector('#contact a[href^="mailto:"]')?.getAttribute("href"),
		).toBe(`mailto:${SOCIAL_LINKS.email}`);
		const headerLink = doc.querySelector('header a[href="/#contact"]');
		expect(text(headerLink)).toBe("Contact");
	});

	test("every GitHub profile link points at vk-hr", async () => {
		const { doc } = await get("/");
		const github = [...doc.querySelectorAll('a[href*="github.com/"]')].map(
			(a) => a.getAttribute("href") as string,
		);
		expect(github.length).toBeGreaterThan(0);
		for (const href of github) {
			expect(href).toStartWith("https://github.com/vk-hr");
		}
	});

	test("links its stylesheet, and the stylesheet is served", async () => {
		const { doc } = await get("/");
		const href = doc
			.querySelector('link[rel="stylesheet"]')
			?.getAttribute("href");
		expect(href).toBeString();
		const css = await fetch(new URL(href as string, base));
		expect(css.status).toBe(200);
		expect(css.headers.get("content-type")).toContain("text/css");
		expect(await css.text()).toContain("--background");
	});
});

describe("icons", () => {
	test("every icon in the head is served as an image", async () => {
		const { doc } = await get("/");
		const icons = [
			...doc.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]'),
		].map((link) => link.getAttribute("href") as string);
		expect(icons).toEqual(
			expect.arrayContaining([
				"/icon.svg",
				"/favicon.ico",
				"/apple-touch-icon.png",
			]),
		);
		for (const href of icons) {
			const response = await fetch(new URL(href, base));
			expect(response.status).toBe(200);
			expect(response.headers.get("content-type")).toStartWith("image/");
			expect((await response.arrayBuffer()).byteLength).toBeGreaterThan(0);
		}
	});
});

describe("/projects", () => {
	test("lists every visible project, numbered, grouped by year, newest first", async () => {
		const { status, doc } = await get("/projects");
		expect(status).toBe(200);
		expect(text(doc.querySelector("title"))).toBe("Projects | VKHR");

		const years = [...doc.querySelectorAll("section h2")].map((h) =>
			Number(text(h)),
		);
		const expectedYears = [
			...new Set(visible.map((p) => new Date(p.date).getUTCFullYear())),
		];
		expect(years).toEqual(expectedYears);

		const rows = [...doc.querySelectorAll("section li h3 a")];
		expect(rows.map((a) => text(a))).toEqual(visible.map((p) => p.title));
		expect(rows.map((a) => a.getAttribute("href"))).toEqual(
			visible.map((p) => `/projects/${p.slug}`),
		);
	});
});

describe("/projects/$slug", () => {
	test.each(visible.map((p) => [p.slug, p] as const))(
		"%s renders its page and meta tags",
		async (slug, project) => {
			const { status, doc } = await get(`/projects/${slug}`);
			expect(status).toBe(200);
			expect(text(doc.querySelector("title"))).toBe(`${project.title} | VKHR`);
			expect(text(doc.querySelector("h1"))).toBe(project.title);
			expect(
				doc.querySelector('meta[property="og:title"]')?.getAttribute("content"),
			).toBe(project.title);
			expect(
				doc.querySelector('meta[name="description"]')?.getAttribute("content"),
			).toBe(project.description);
		},
	);

	test("archived projects are not served", async () => {
		const archived = allProjects.filter((p) => p.status === "archived");
		for (const { slug } of archived) {
			expect((await get(`/projects/${slug}`)).status).toBe(404);
		}
	});
});

describe("not found", () => {
	test.each(["/projects/does-not-exist", "/no/such/page"])(
		"%s answers 404 with the not-found page",
		async (path) => {
			const { status, doc } = await get(path);
			expect(status).toBe(404);
			expect(text(doc.querySelector("h1"))).toBe("Not found.");
		},
	);
});

describe("theme cookie", () => {
	test.each([
		["_preferred-theme=dark", "dark"],
		["_preferred-theme=light", "light"],
		["_preferred-theme=system", "system"],
		["_preferred-theme=purple", "system"],
		["", "system"],
	])("%p is applied before first paint as %p", async (cookie, expected) => {
		const { html } = await get("/", cookie ? { cookie } : {});
		expect(themeBeforePaint(html)).toBe(expected);
	});
});
