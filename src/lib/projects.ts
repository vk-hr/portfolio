import { allProjects, technologyMap } from "content-collections";

export type Technology = {
	slug: string;
	name: string;
	color: (typeof technologyMap)[string]["color"];
};

export type ProjectSummary = {
	slug: string;
	title: string;
	description: string;
	status: "active" | "completed" | "archived";
	featured: boolean;
	date: string;
	repository?: string;
	demo?: string;
	cover?: string;
	technologies: Array<Technology>;
};

export type ProjectDetail = ProjectSummary & { html: string };

function toDetail(project: (typeof allProjects)[number]): ProjectDetail {
	return {
		slug: project.slug,
		title: project.title,
		description: project.description,
		status: project.status,
		featured: project.featured,
		date: project.date,
		repository: project.repository,
		demo: project.demo,
		cover: project.cover,
		html: project.html,
		technologies: project.technologies.map((slug) => ({
			slug,
			...technologyMap[slug],
		})),
	};
}

function toSummary({ html: _html, ...summary }: ProjectDetail): ProjectSummary {
	return summary;
}

/** Visible projects (everything but archived), newest first. */
const visibleProjects = allProjects
	.filter((project) => project.status !== "archived")
	.map(toDetail)
	.sort((a, b) => b.date.localeCompare(a.date));

export function listProjects(limit?: number): Array<ProjectSummary> {
	return visibleProjects.slice(0, limit).map(toSummary);
}

export function listFeaturedProjects(limit?: number): Array<ProjectSummary> {
	return visibleProjects
		.filter((project) => project.featured)
		.slice(0, limit)
		.map(toSummary);
}

export function getProject(slug: string): ProjectDetail | undefined {
	return visibleProjects.find((project) => project.slug === slug);
}
