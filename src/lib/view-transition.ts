import type { CSSProperties } from "react";

export type ProjectPart = "frame" | "title" | "description" | "cover";

/**
 * Shared view-transition name for one part of a project, so the same part
 * morphs between the home card/modal, the projects index and the detail page.
 * A name must be unique on the page at snapshot time: give it to only one
 * element per project (e.g. the modal OR its card, never both).
 */
export function projectTransition(slug: string, part: ProjectPart) {
	const id = slug.replace(/[^\w-]/g, "-");
	return {
		viewTransitionName: `project-${part}-${id}`,
		viewTransitionClass: `project-${part}`,
	} satisfies CSSProperties;
}
