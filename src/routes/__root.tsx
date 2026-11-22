import { createRootRoute, Outlet } from "@tanstack/react-router";
import { RootProviders } from "#/components/providers";
import { getTheme } from "#/functions/theme";
import appCss from "../styles.css?url";
import { NotFound } from "./_home/-not-found";

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
				title: "VKHR | Portfolio",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
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
