import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import type * as React from "react";

/**
 * Renders `ui` as the page at `/` of an in-memory router, so `<Link>` works.
 * The app's other paths exist as empty routes, so links to them resolve to
 * real hrefs.
 */
export async function renderWithRouter(ui: React.ReactNode) {
	const rootRoute = createRootRoute();
	const routeTree = rootRoute.addChildren([
		createRoute({
			getParentRoute: () => rootRoute,
			path: "/",
			component: () => ui,
		}),
		createRoute({ getParentRoute: () => rootRoute, path: "/projects" }),
		createRoute({
			getParentRoute: () => rootRoute,
			path: "/projects/$slugId",
		}),
	]);
	const router = createRouter({
		routeTree,
		history: createMemoryHistory({ initialEntries: ["/"] }),
	});
	await router.load();
	return { router, ...render(<RouterProvider router={router} />) };
}
