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
			{
				rel: "icon",
				href: "/favicon.ico",
			},
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
