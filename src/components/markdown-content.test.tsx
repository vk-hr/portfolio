/// <reference lib="dom" />
import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MarkdownContent } from "./markdown-content";

test("renders the compiled HTML", () => {
	render(
		<MarkdownContent html="<h2>Heading</h2><p>Body</p>" className="prose" />,
	);

	expect(screen.getByRole("heading", { name: "Heading" })).toBeInTheDocument();
	expect(screen.getByText("Body").parentElement).toHaveClass("prose");
});
