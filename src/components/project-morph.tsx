import { cn } from "cn";
import type { CSSProperties } from "react";

export type MorphPart = "frame" | "title" | "cover";

/**
 * Shared view-transition name for one part of a project. Elements with the
 * same name on the old and new page morph into each other when the router
 * runs a view transition (`defaultViewTransition` in src/router.tsx).
 *
 * Names must be unique on a page, so they are only used where a page shows
 * each project once: the home modal, the /projects rows and the project page
 * (never the home cards, which coexist with the open modal). Layers are
 * styled by class in src/styles.css (`.project-<part>`).
 *
 * React's <ViewTransition> would apply names just in time, but TanStack Router
 * commits route changes through useSyncExternalStore, which React never runs
 * as a transition, so it does not fire for navigations.
 */
export function morph(slug: string, part: MorphPart) {
	return {
		viewTransitionName: `project-${part}-${slug.replace(/[^\w-]/g, "-")}`,
		viewTransitionClass: `project-${part}`,
	} satisfies CSSProperties;
}

type MorphFrameProps = {
	slug: string;
	className?: string;
};

/**
 * Empty surface behind a container's content. Morphing an empty box hides the
 * aspect-ratio distortion a snapshot of the whole container would show; the
 * title and cover morph as their own layers on top. The parent must create a
 * stacking context (e.g. `isolate`) so `-z-10` stays inside it.
 */
export function MorphFrame({ slug, className }: MorphFrameProps) {
	return (
		<div
			aria-hidden="true"
			style={morph(slug, "frame")}
			className={cn("pointer-events-none absolute inset-0 -z-10", className)}
		/>
	);
}
