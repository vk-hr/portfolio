import { ArrowLeft, ExternalLink, Github } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { MarkdownContent } from "#/components/markdown-content";
import { Badge } from "#/components/ui/badge";
import { COLORS } from "#/lib/colors";
import { longDate } from "#/lib/format";
import { getProject } from "#/lib/projects";

import { CornerSquare, Layout } from "../-layout";

export const Route = createFileRoute("/_home/projects/$slugId")({
	loader: ({ params }) => {
		const project = getProject(params.slugId);
		if (!project) throw notFound();
		return project;
	},
	head: ({ loaderData }) => ({
		meta: loaderData
			? [
					{ title: `${loaderData.title} | VKHR` },
					{ name: "description", content: loaderData.description },
				]
			: [],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const project = Route.useLoaderData();

	return (
		<Layout>
			<article className="relative mx-4 my-4 max-w-4xl border-2 bg-background sm:mx-auto sm:my-8 sm:w-full">
				<CornerSquare position="top-left" mode="offset" />
				<CornerSquare position="top-right" mode="offset" />
				<CornerSquare position="bottom-left" mode="offset" />
				<CornerSquare position="bottom-right" mode="offset" />

				{project.cover && (
					<div className="relative border-b-2">
						<img
							src={project.cover}
							alt=""
							className="h-[35vh] w-full object-cover"
						/>
						<div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent" />
						<Link
							to="/projects"
							className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5 text-sm backdrop-blur-md transition-colors hover:bg-background/80"
						>
							<HugeiconsIcon
								icon={ArrowLeft}
								strokeWidth={2}
								className="size-4"
							/>
							Back
						</Link>

						{(project.repository || project.demo) && (
							<div className="absolute top-4 right-4 flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
								{project.repository && (
									<a
										href={project.repository}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5 text-sm backdrop-blur-md transition-colors hover:bg-background/80"
									>
										<HugeiconsIcon
											icon={Github}
											strokeWidth={2}
											className="size-4"
										/>
										Repository
									</a>
								)}
								{project.demo && (
									<a
										href={project.demo}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5 text-sm backdrop-blur-md transition-colors hover:bg-background/80"
									>
										<HugeiconsIcon
											icon={ExternalLink}
											strokeWidth={2}
											className="size-4"
										/>
										Live Demo
									</a>
								)}
							</div>
						)}
					</div>
				)}

				<div className="mx-auto w-full max-w-3xl px-4 pb-10">
					{!project.cover && (
						<div className="mt-10 mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
							<Link
								to="/projects"
								className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<HugeiconsIcon
									icon={ArrowLeft}
									strokeWidth={2}
									className="size-4"
								/>
								Back to projects
							</Link>

							{(project.repository || project.demo) && (
								<div className="flex items-center gap-3 text-sm">
									{project.repository && (
										<a
											href={project.repository}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
										>
											<HugeiconsIcon
												icon={Github}
												strokeWidth={2}
												className="size-4"
											/>
											Repository
										</a>
									)}
									{project.demo && (
										<a
											href={project.demo}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
										>
											<HugeiconsIcon
												icon={ExternalLink}
												strokeWidth={2}
												className="size-4"
											/>
											Live Demo
										</a>
									)}
								</div>
							)}
						</div>
					)}

					<div
						className={`${project.cover ? "mt-4" : ""} mb-4 flex flex-wrap items-end gap-3`}
					>
						<h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
							{project.title}
						</h1>
						<div className="mb-1 flex items-center gap-3 text-sm text-muted-foreground">
							<Badge
								variant={project.status === "active" ? "default" : "secondary"}
								className="h-6 rounded-none border-2 border-border bg-transparent py-2 text-sm font-bold tracking-wider uppercase"
							>
								{project.status}
							</Badge>
							<span aria-hidden="true">|</span>
							<time dateTime={project.date}>
								{longDate.format(new Date(project.date))}
							</time>
						</div>
					</div>

					{project.technologies.length > 0 && (
						<div className="mb-4 flex flex-wrap gap-1.5">
							{project.technologies.map((tech) => {
								const palette = COLORS[tech.color];

								return (
									<Badge
										key={tech.slug}
										variant="outline"
										className={`${palette.text} ${palette.border} rounded-none border bg-transparent`}
									>
										{tech.name}
									</Badge>
								);
							})}
						</div>
					)}

					{project.description && (
						<p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
							{project.description}
						</p>
					)}

					<MarkdownContent
						html={project.html}
						className="prose max-w-none prose-amber dark:prose-invert"
					/>
				</div>
			</article>
		</Layout>
	);
}
