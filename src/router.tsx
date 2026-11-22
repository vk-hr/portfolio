import { createRouter } from "@tanstack/react-router";

import { viewTransitionTypes } from "#/lib/view-transition";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		// Native view transitions on every navigation, back/forward included.
		// Shared parts: src/components/project-morph.tsx; timing: src/styles.css.
		// The type tells the CSS which way a project title is scaling.
		defaultViewTransition: {
			types: ({ fromLocation, toLocation }) =>
				viewTransitionTypes(fromLocation?.pathname, toLocation.pathname),
		},
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
