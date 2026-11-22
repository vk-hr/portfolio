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

type Content = {
	projects: typeof allProjects;
	technologyMap: typeof technologyMap;
};

/**
 * Project queries over a set of content. The app uses the instance below,
 * built from content/; tests build their own from fixtures.
 */
export function createProjectStore(content: Content) {
	function toDetail(project: Content["projects"][number]): ProjectDetail {
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
				...content.technologyMap[slug],
			})),
		};
	}

	function toSummary({
		html: _html,
		...summary
	}: ProjectDetail): ProjectSummary {
		return summary;
	}

	/** Visible projects (everything but archived), newest first. */
	const visibleProjects = content.projects
		.filter((project) => project.status !== "archived")
		.map(toDetail)
		.sort((a, b) => b.date.localeCompare(a.date));

	return {
		listProjects(limit?: number): Array<ProjectSummary> {
			return visibleProjects.slice(0, limit).map(toSummary);
		},

		listFeaturedProjects(limit?: number): Array<ProjectSummary> {
			return visibleProjects
				.filter((project) => project.featured)
				.slice(0, limit)
				.map(toSummary);
		},

		getProject(slug: string): ProjectDetail | undefined {
			return visibleProjects.find((project) => project.slug === slug);
		},
	};
}

export const { listProjects, listFeaturedProjects, getProject } =
	createProjectStore({ projects: allProjects, technologyMap });
