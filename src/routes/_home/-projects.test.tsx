/// <reference lib="dom" />
import { describe, expect, mock, test } from "bun:test";

import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import * as motion from "motion/react";

import type { ProjectSummary } from "#/lib/projects";

import { renderWithRouter } from "../../../test/render-with-router";

// The dialog shares a layoutId with its card, so AnimatePresence keeps it
// mounted until the card's layout animation ends. happy-dom has no layout,
// that animation never starts, and the dialog would never leave. The exit
// animation is Motion's job; these tests check what opens and closes it.
function ImmediatePresence({ children }: { children?: React.ReactNode }) {
	return children;
}
mock.module("motion/react", () => ({
	...motion,
	AnimatePresence: ImmediatePresence,
}));
const { SelectedWork } = await import("./-projects");

function summary(
	slug: string,
	fields: Partial<ProjectSummary> = {},
): ProjectSummary {
	return {
		slug,
		title: `Title ${slug}`,
		description: `About ${slug}`,
		status: "completed",
		featured: false,
		date: "2026-03-14",
		technologies: [],
		...fields,
	};
}

const alpha = summary("alpha", {
	status: "active",
	repository: "https://github.com/example/alpha",
	demo: "https://alpha.example",
	technologies: [{ slug: "react", name: "React", color: "cyan" }],
});
const beta = summary("beta", { featured: true });

function renderProjects(projects = [alpha, beta]) {
	return renderWithRouter(<SelectedWork index="02" projects={projects} />);
}

const openCard = (title: string) =>
	fireEvent.click(screen.getByRole("button", { name: new RegExp(title) }));

const dialogGone = () =>
	waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

describe("project cards", () => {
	test("list the given projects in order, numbered", async () => {
		await renderProjects();
		const cards = screen.getAllByRole("button", { name: /Title/ });
		expect(cards.map((c) => c.textContent)).toEqual([
			expect.stringContaining("01"),
			expect.stringContaining("02"),
		]);
		expect(cards[0]).toHaveTextContent("Title alpha");
	});

	test("say so when there are no projects", async () => {
		await renderProjects([]);
		expect(screen.getByText("No projects yet")).toBeInTheDocument();
	});

	test("link to the full project index", async () => {
		await renderProjects();
		expect(screen.getByRole("link", { name: "All projects" })).toHaveAttribute(
			"href",
			"/projects",
		);
	});
});

describe("project dialog", () => {
	test("opens with the project's details and links", async () => {
		await renderProjects();
		openCard("Title alpha");

		const dialog = await screen.findByRole("dialog", { name: "Title alpha" });
		expect(dialog).toHaveAttribute("aria-modal", "true");
		const d = within(dialog);
		expect(d.getByText("About alpha")).toBeInTheDocument();
		expect(d.getByText("active")).toBeInTheDocument();
		expect(d.getByText("Mar 14, 2026", { exact: false })).toBeInTheDocument();
		expect(d.getByRole("list", { name: "Technologies" })).toHaveTextContent(
			"React",
		);
		expect(d.getByRole("link", { name: "Repository" })).toHaveAttribute(
			"href",
			"https://github.com/example/alpha",
		);
		expect(d.getByRole("link", { name: "Demo" })).toHaveAttribute(
			"href",
			"https://alpha.example",
		);
		expect(d.getByRole("link", { name: "Full project" })).toHaveAttribute(
			"href",
			"/projects/alpha",
		);
	});

	test("leaves out links the project doesn't have", async () => {
		await renderProjects();
		openCard("Title beta");
		const d = within(await screen.findByRole("dialog"));
		expect(d.queryByRole("link", { name: "Repository" })).toBeNull();
		expect(d.queryByRole("link", { name: "Demo" })).toBeNull();
		expect(d.getByRole("link", { name: "Full project" })).toBeInTheDocument();
	});

	test("moves focus into the dialog and back to the card on close", async () => {
		await renderProjects();
		const card = screen.getByRole("button", { name: /Title alpha/ });
		card.focus();
		fireEvent.click(card);

		const dialog = await screen.findByRole("dialog");
		expect(document.activeElement).toBe(dialog);

		fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
		await dialogGone();
		expect(document.activeElement).toBe(card);
	});

	test("closes on Escape", async () => {
		await renderProjects();
		openCard("Title alpha");
		await screen.findByRole("dialog");
		fireEvent.keyDown(document, { key: "Escape" });
		await dialogGone();
	});

	test("closes when the backdrop is clicked", async () => {
		const { container } = await renderProjects();
		openCard("Title alpha");
		const dialog = await screen.findByRole("dialog");
		const backdrop = dialog.previousElementSibling;
		expect(backdrop).toHaveAttribute("aria-hidden", "true");
		fireEvent.click(backdrop as Element);
		await dialogGone();
		expect(container).toBeInTheDocument();
	});

	test("ignores other keys", async () => {
		await renderProjects();
		openCard("Title alpha");
		await screen.findByRole("dialog");
		fireEvent.keyDown(document, { key: "Enter" });
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});
});
