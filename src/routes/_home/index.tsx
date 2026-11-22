import { createFileRoute } from "@tanstack/react-router";

import { listFeaturedProjects, listProjects } from "#/lib/projects";

import { Hero } from "./-hero";
import { Page } from "./-layout";
import { Projects } from "./-projects";

export const Route = createFileRoute("/_home/")({
	loader: () => ({
		recentProjects: listProjects(6),
		featuredProjects: listFeaturedProjects(6),
	}),
	component: HomePage,
});

function HomePage() {
	const { recentProjects, featuredProjects } = Route.useLoaderData();

	return (
		<Page>
			<Hero />
			<Projects
				recentProjects={recentProjects}
				featuredProjects={featuredProjects}
			/>
		</Page>
	);
}
