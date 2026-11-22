import { createFileRoute } from "@tanstack/react-router";

import { listFeaturedProjects, listProjects } from "#/lib/projects";

import { Footer } from "./-footer";
import { Header } from "./-header";
import { Hero } from "./-hero";
import { CornerSquare, Layout } from "./-layout";
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
		<Layout>
			<Header />
			<div className="flex h-full flex-1 flex-col px-4">
				<main className="relative container mx-auto max-w-4xl flex-1 border-r-2 border-l-2 bg-background">
					<CornerSquare position="top-left" />
					<CornerSquare position="top-right" />

					<Hero />

					<Projects
						recentProjects={recentProjects}
						featuredProjects={featuredProjects}
					/>

					<CornerSquare position="bottom-left" />
					<CornerSquare position="bottom-right" />
				</main>
			</div>
			<Footer />
		</Layout>
	);
}
