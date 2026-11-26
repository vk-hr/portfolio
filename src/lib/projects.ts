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
	status: "pre-launch" | "active" | "completed" | "archived";
	featured: boolean;
	date: string;
	repository?: string;
	demo?: string;
	package?: string;
	cover?: string;
	coverAlt?: string;
	technologies: Array<Technology>;
};

export type ProjectDetail = ProjectSummary & { html: string };

/**
 * The project's outward link besides the repository: its live demo, or its
 * package page when it ships as a package.
 */
export function externalLink(
	project: Pick<ProjectSummary, "demo" | "package">,
): { href: string; label: "Live demo" | "npm package" } | undefined {
	if (project.demo) return { href: project.demo, label: "Live demo" };
	if (project.package) return { href: project.package, label: "npm package" };
	return undefined;
}

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
			package: project.package,
			cover: project.cover,
			coverAlt: project.coverAlt,
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

		/**
		 * The home page's selection: featured projects first, then the newest
		 * of the rest, each group newest first.
		 */
		listSelectedProjects(limit?: number): Array<ProjectSummary> {
			const featured = visibleProjects.filter((project) => project.featured);
			const rest = visibleProjects.filter((project) => !project.featured);
			return [...featured, ...rest].slice(0, limit).map(toSummary);
		},

		getProject(slug: string): ProjectDetail | undefined {
			return visibleProjects.find((project) => project.slug === slug);
		},
	};
}

export const {
	listProjects,
	listFeaturedProjects,
	listSelectedProjects,
	getProject,
} = createProjectStore({ projects: allProjects, technologyMap });
