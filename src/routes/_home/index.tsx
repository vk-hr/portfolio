import { createFileRoute } from "@tanstack/react-router";

import { listSelectedProjects } from "#/lib/projects";
import { HOME_DESCRIPTION, HOME_TITLE } from "#/lib/site";

import { Contact } from "./-contact";
import { Hero } from "./-hero";
import { Page } from "./-layout";
import { SelectedWork } from "./-projects";
import { Services } from "./-services";
import { WorkingTogether } from "./-working-together";

export const Route = createFileRoute("/_home/")({
	loader: () => ({ projects: listSelectedProjects(6) }),
	head: () => ({
		meta: [
			{ title: HOME_TITLE },
			{ name: "description", content: HOME_DESCRIPTION },
			{ property: "og:title", content: HOME_TITLE },
			{ property: "og:description", content: HOME_DESCRIPTION },
		],
	}),
	component: HomePage,
});

function HomePage() {
	const { projects } = Route.useLoaderData();

	return (
		<Page>
			<Hero />
			<Services index="01" />
			<SelectedWork index="02" projects={projects} />
			<WorkingTogether index="03" />
			<Contact index="04" />
		</Page>
	);
}
