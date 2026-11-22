import {
	ArrowLeft,
	ArrowUpRight01Icon,
	Github,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { MarkdownContent } from "#/components/markdown-content";
import { StatusLabel, TechList } from "#/components/tech-list";
import { longDate } from "#/lib/format";
import { getProject } from "#/lib/projects";
import { projectTransition } from "#/lib/view-transition";

import { CornerSquare, Page } from "../-layout";

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

const actionClassName =
	"group flex items-center gap-2 px-4 py-3 type-label transition-colors hover:bg-foreground hover:text-background";

function ProjectPage() {
	const project = Route.useLoaderData();
	const hasLinks = Boolean(project.repository || project.demo);

	return (
		<Page>
			<div className="relative flex h-14 items-stretch justify-between border-b-2">
				<Link
					to="/projects"
					className="group flex items-center gap-2 border-r-2 px-4 type-label transition-colors hover:bg-foreground hover:text-background"
				>
					<HugeiconsIcon
						icon={ArrowLeft}
						strokeWidth={2}
						className="size-3.5 transition-transform group-hover:-translate-x-0.5"
					/>
					Projects
				</Link>
				<span className="flex items-center px-4 type-label text-muted-foreground">
					{new Date(project.date).getUTCFullYear()}
				</span>
				<CornerSquare position="bottom-left" />
				<CornerSquare position="bottom-right" />
			</div>

			<header
				style={projectTransition(project.slug, "frame")}
				className="relative border-b-2 px-4 pt-12 pb-8 sm:pt-16 sm:pb-10"
			>
				<StatusLabel status={project.status} className="mb-6" />
				<h1
					style={projectTransition(project.slug, "title")}
					className="text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9] font-extrabold tracking-[-0.045em]"
				>
					{project.title}
				</h1>
				<p
					style={projectTransition(project.slug, "description")}
					className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
				>
					{project.description}
				</p>
				<CornerSquare position="bottom-left" />
				<CornerSquare position="bottom-right" />
			</header>

			<dl className="grid grid-cols-1 border-b-2 sm:grid-cols-[12rem_1fr_auto]">
				<div className="border-b-2 px-4 py-4 sm:border-r-2 sm:border-b-0">
					<dt className="mb-2 type-label text-muted-foreground">Date</dt>
					<dd className="font-medium">
						<time dateTime={project.date}>
							{longDate.format(new Date(project.date))}
						</time>
					</dd>
				</div>
				<div className="px-4 py-4">
					<dt className="mb-2 type-label text-muted-foreground">Stack</dt>
					<dd>
						{project.technologies.length > 0 ? (
							<TechList technologies={project.technologies} />
						) : (
							<span className="text-muted-foreground">—</span>
						)}
					</dd>
				</div>
				{hasLinks && (
					<div className="flex border-t-2 sm:flex-col sm:border-t-0 sm:border-l-2">
						<dt className="sr-only">Links</dt>
						{project.repository && (
							<dd className="flex-1">
								<a
									href={project.repository}
									target="_blank"
									rel="noopener noreferrer"
									className={`${actionClassName} h-full`}
								>
									<HugeiconsIcon
										icon={Github}
										strokeWidth={2}
										className="size-3.5"
									/>
									Repository
								</a>
							</dd>
						)}
						{project.demo && (
							<dd
								className={
									project.repository
										? "flex-1 border-l-2 sm:border-t-2 sm:border-l-0"
										: "flex-1"
								}
							>
								<a
									href={project.demo}
									target="_blank"
									rel="noopener noreferrer"
									className={`${actionClassName} h-full`}
								>
									<HugeiconsIcon
										icon={ArrowUpRight01Icon}
										strokeWidth={2}
										className="size-3.5"
									/>
									Live demo
								</a>
							</dd>
						)}
					</div>
				)}
			</dl>

			{project.cover && (
				<img
					src={project.cover}
					alt=""
					style={projectTransition(project.slug, "cover")}
					className="aspect-video w-full border-b-2 object-cover"
				/>
			)}

			{project.html && (
				<article className="px-4 py-10 sm:py-14">
					<MarkdownContent
						html={project.html}
						className="mx-auto prose max-w-[68ch] dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:border-b-2 prose-h2:pb-3 prose-h2:text-2xl prose-a:text-primary prose-a:underline-offset-4 prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:font-normal prose-blockquote:not-italic prose-code:font-mono prose-code:font-medium prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-none prose-pre:border-2 prose-pre:bg-muted prose-pre:text-foreground prose-th:type-label prose-th:text-muted-foreground prose-img:border-2 prose-hr:border-t-2"
					/>
				</article>
			)}
		</Page>
	);
}
