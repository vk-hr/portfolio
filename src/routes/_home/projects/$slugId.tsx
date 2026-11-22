import { ArrowLeft, ExternalLink, Github } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { cn } from "cn";

import { MarkdownContent } from "#/components/markdown-content";
import { Badge } from "#/components/ui/badge";
import { COLORS } from "#/lib/colors";
import { longDate } from "#/lib/format";
import { getProject } from "#/lib/projects";

import { Footer } from "../-footer";
import { Header } from "../-header";
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
					{ property: "og:title", content: loaderData.title },
					{ property: "og:description", content: loaderData.description },
				]
			: [],
	}),
	component: ProjectPage,
});

const linkClassName =
	"inline-flex items-center gap-2 border-2 bg-background px-3 py-1.5 text-sm transition-colors hover:bg-muted";

function ProjectPage() {
	const project = Route.useLoaderData();

	return (
		<Layout>
			<Header />
			<div className="flex h-full flex-1 flex-col px-4">
				<main className="relative container mx-auto max-w-4xl flex-1 border-x-2 bg-background">
					<CornerSquare position="top-left" />
					<CornerSquare position="top-right" />
					<CornerSquare position="bottom-left" />
					<CornerSquare position="bottom-right" />

					<div className="relative flex items-center gap-4 border-b-2 p-2 sm:p-4">
						<Link
							to="/projects"
							className="inline-flex items-center justify-center border-2 bg-background p-1.5 transition-colors hover:bg-muted"
							aria-label="Back to projects"
						>
							<HugeiconsIcon
								icon={ArrowLeft}
								strokeWidth={2}
								className="size-5"
							/>
						</Link>
						<h1 className="text-xl font-bold sm:text-2xl">{project.title}</h1>
						<CornerSquare position="bottom-left" />
						<CornerSquare position="bottom-right" />
					</div>

					{project.cover && (
						<img
							src={project.cover}
							alt=""
							className="h-[35vh] w-full border-b-2 object-cover"
						/>
					)}

					<article className="px-4 py-6 sm:py-8">
						<div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
							<Badge
								variant={project.status === "active" ? "default" : "secondary"}
								className="tracking-wider uppercase"
							>
								{project.status}
							</Badge>
							<time dateTime={project.date}>
								{longDate.format(new Date(project.date))}
							</time>
						</div>

						{project.technologies.length > 0 && (
							<ul
								className="mb-6 flex flex-wrap gap-1.5"
								aria-label="Technologies"
							>
								{project.technologies.map((tech) => (
									<li key={tech.slug}>
										<Badge
											variant="outline"
											className={cn(
												COLORS[tech.color].text,
												COLORS[tech.color].border,
												"bg-transparent",
											)}
										>
											{tech.name}
										</Badge>
									</li>
								))}
							</ul>
						)}

						<p className="mb-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
							{project.description}
						</p>

						{(project.repository || project.demo) && (
							<div className="mb-8 flex flex-wrap gap-3">
								{project.repository && (
									<a
										href={project.repository}
										target="_blank"
										rel="noopener noreferrer"
										className={linkClassName}
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
										className={linkClassName}
									>
										<HugeiconsIcon
											icon={ExternalLink}
											strokeWidth={2}
											className="size-4"
										/>
										Live demo
									</a>
								)}
							</div>
						)}

						{project.html && (
							<MarkdownContent
								html={project.html}
								className="prose max-w-none dark:prose-invert prose-a:text-primary"
							/>
						)}
					</article>
				</main>
			</div>
			<Footer />
		</Layout>
	);
}
