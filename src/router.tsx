import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

const isProjectPage = (pathname?: string) =>
	pathname !== undefined && /^\/projects\/[^/]+\/?$/.test(pathname);

export function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		// Native view transitions on every navigation, back/forward included.
		// Shared parts: src/components/project-morph.tsx; timing: src/styles.css.
		// The type tells the CSS which way a project title is scaling.
		defaultViewTransition: {
			types: ({ fromLocation, toLocation }) => {
				if (isProjectPage(toLocation.pathname)) return ["to-project"];
				if (isProjectPage(fromLocation?.pathname)) return ["from-project"];
				return ["page"];
			},
		},
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
