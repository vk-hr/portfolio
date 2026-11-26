import { ArrowUpRight01Icon, Github } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { morph } from "#/components/project-morph";
import { StatusLabel } from "#/components/tech-list";
import { shortDate } from "#/lib/format";
import {
	externalLink,
	listProjects,
	type ProjectSummary,
} from "#/lib/projects";

import { Page, SectionHeading } from "../-layout";

export const Route = createFileRoute("/_home/projects/")({
	loader: () => listProjects(),
	head: () => ({
		meta: [
			{ title: "Projects | VKHR" },
			{ name: "description", content: "Everything I've built, by year." },
		],
	}),
	component: ProjectsPage,
});

const pad = (n: number) => String(n).padStart(2, "0");

const iconLinkClassName =
	"relative z-10 inline-flex size-9 items-center justify-center border-2 bg-background transition-colors hover:bg-foreground hover:text-background";

function ProjectsPage() {
	const projects = Route.useLoaderData();

	// Projects arrive newest first, so years and rows keep that order.
	const years = new Map<
		number,
		Array<{
			project: ProjectSummary;
			n: number;
			link: ReturnType<typeof externalLink>;
		}>
	>();
	projects.forEach((project, i) => {
		const year = new Date(project.date).getUTCFullYear();
		const rows = years.get(year) ?? [];
		rows.push({ project, n: i + 1, link: externalLink(project) });
		years.set(year, rows);
	});

	return (
		<Page>
			<SectionHeading as="h1" index="Index" title="Projects">
				<span className="type-label text-muted-foreground">
					{pad(projects.length)} total
				</span>
			</SectionHeading>

			{projects.length === 0 ? (
				<p className="m-4 border-2 border-dashed p-12 text-center type-label text-muted-foreground">
					No projects yet
				</p>
			) : (
				[...years].map(([year, rows]) => (
					<section
						key={year}
						aria-labelledby={`year-${year}`}
						className="grid grid-cols-1 border-b-2 sm:grid-cols-[9rem_1fr]"
					>
						<div className="border-b-2 px-4 py-4 sm:border-r-2 sm:border-b-0">
							<h2
								id={`year-${year}`}
								className="text-3xl font-extrabold tracking-tighter sm:sticky sm:top-4"
							>
								{year}
							</h2>
						</div>

						<ol>
							{rows.map(({ project, n, link }) => (
								<li
									key={project.slug}
									className="group relative grid grid-cols-[2rem_1fr] gap-x-4 gap-y-3 border-b-2 px-4 py-5 transition-colors last:border-b-0 hover:bg-muted sm:grid-cols-[2rem_1fr_auto]"
								>
									<span className="pt-1.5 type-label text-muted-foreground">
										{pad(n)}
									</span>

									<div className="min-w-0">
										<h3
											style={morph(project.slug, "title")}
											className="w-fit text-xl leading-none font-extrabold tracking-[-0.04em]"
										>
											{/* Stretched link: the whole row is clickable without nesting the external links. */}
											<Link
												to="/projects/$slugId"
												params={{ slugId: project.slug }}
												className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:-outline-offset-4 after:focus-visible:outline-ring"
											>
												{project.title}
											</Link>
										</h3>
										<p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
											{project.description}
										</p>
										<p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
											<StatusLabel status={project.status} />
											{project.technologies.length > 0 && (
												<span className="type-label text-muted-foreground">
													{project.technologies
														.map((tech) => tech.name)
														.join(" / ")}
												</span>
											)}
										</p>
									</div>

									<div className="col-start-2 flex items-center gap-2 sm:col-start-3 sm:flex-col sm:items-end sm:justify-between">
										<time
											dateTime={project.date}
											className="type-label text-muted-foreground sm:pt-1.5"
										>
											{shortDate.format(new Date(project.date))}
										</time>
										<div className="ml-auto flex items-center gap-1.5">
											{project.repository && (
												<a
													href={project.repository}
													target="_blank"
													rel="noopener noreferrer"
													className={iconLinkClassName}
													aria-label={`${project.title} repository`}
												>
													<HugeiconsIcon
														icon={Github}
														strokeWidth={2}
														className="size-4"
													/>
												</a>
											)}
											{link && (
												<a
													href={link.href}
													target="_blank"
													rel="noopener noreferrer"
													className={iconLinkClassName}
													aria-label={`${project.title} ${link.label}`}
												>
													<HugeiconsIcon
														icon={ArrowUpRight01Icon}
														strokeWidth={2}
														className="size-4"
													/>
												</a>
											)}
										</div>
									</div>
								</li>
							))}
						</ol>
					</section>
				))
			)}
		</Page>
	);
}
