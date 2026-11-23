import { createRootRoute, Outlet } from "@tanstack/react-router";

import { RootProviders } from "#/components/providers";
import { getTheme } from "#/functions/theme";
import { HOME_DESCRIPTION, HOME_TITLE } from "#/lib/site";

import { NotFound } from "./_home/-not-found";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: HOME_TITLE,
			},
			{
				name: "description",
				content: HOME_DESCRIPTION,
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			// "V." mark: SVG for browsers that follow the colour scheme, ICO
			// (16/32/48) for the rest, and a padded PNG for iOS home screens.
			{ rel: "icon", href: "/favicon.ico", sizes: "32x32" },
			{ rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
		],
	}),
	loader: () => getTheme(),
	notFoundComponent: NotFound,
	shellComponent: ShellComponent,
});

function ShellComponent() {
	const theme = Route.useLoaderData();
	return (
		<RootProviders theme={theme}>
			<Outlet />
		</RootProviders>
	);
}
