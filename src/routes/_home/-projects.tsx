import {
	ArrowRight,
	ArrowUpRight01Icon,
	Cancel01Icon,
	Github,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { morph, MorphFrame } from "#/components/project-morph";
import { StatusLabel, TechList } from "#/components/tech-list";
import { mediumDate } from "#/lib/format";
import type { ProjectSummary } from "#/lib/projects";

import { CornerSquare, SectionHeading } from "./-layout";

const springTransition = { type: "spring", bounce: 0, duration: 0.3 } as const;

type Project = ProjectSummary;

type SelectedWorkProps = {
	index: string;
	projects: Array<Project>;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** The home page's project cards; each opens a dialog with the details. */
export function SelectedWork({ index, projects }: SelectedWorkProps) {
	"use no memo";
	const [selected, setSelected] = React.useState<{
		project: Project;
		index: number;
	} | null>(null);

	return (
		<section aria-labelledby="work-title">
			<SectionHeading index={index} title="Selected work" id="work-title">
				<Link
					to="/projects"
					className="group flex h-9 items-center gap-2 border-2 px-3 type-label transition-colors hover:bg-foreground hover:text-background"
				>
					All projects
					<HugeiconsIcon
						icon={ArrowRight}
						strokeWidth={2}
						className="size-3.5 transition-transform group-hover:translate-x-0.5"
					/>
				</Link>
			</SectionHeading>

			{projects.length === 0 ? (
				<p className="m-4 border-2 border-dashed p-12 text-center type-label text-muted-foreground">
					No projects yet
				</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{projects.map((project, index) => (
						<ProjectCard
							key={project.slug}
							project={project}
							index={index + 1}
							onOpen={() => setSelected({ project, index: index + 1 })}
						/>
					))}
				</div>
			)}

			<AnimatePresence>
				{selected && (
					<ProjectModal
						project={selected.project}
						index={selected.index}
						onClose={() => setSelected(null)}
					/>
				)}
			</AnimatePresence>
		</section>
	);
}

type ProjectCardProps = {
	project: Project;
	index: number;
	onOpen: () => void;
};

function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
	"use no memo";

	return (
		<motion.div
			layoutId={`project-${project.slug}`}
			transition={springTransition}
			className={cn(
				"group relative bg-background",
				"border-b-2",
				"sm:max-lg:odd:border-r-2",
				"lg:not-nth-[3n]:border-r-2",
			)}
		>
			<CornerSquare
				position="bottom-left"
				className="-mb-px -ml-px"
				layoutId={`corner-bl-${project.slug}`}
				transition={springTransition}
			/>
			<CornerSquare
				position="bottom-right"
				className="-mr-px -mb-px"
				layoutId={`corner-br-${project.slug}`}
				transition={springTransition}
			/>

			<button
				type="button"
				onClick={onOpen}
				aria-haspopup="dialog"
				className="flex h-full min-h-56 w-full cursor-pointer flex-col gap-6 p-4 text-left transition-colors hover:bg-muted focus-visible:-outline-offset-4"
			>
				<span className="flex w-full items-center justify-between type-label text-muted-foreground">
					<span>{pad(index)}</span>
					<time dateTime={project.date}>
						{new Date(project.date).getUTCFullYear()}
					</time>
				</span>

				<span className="block">
					<motion.span
						layoutId={`project-title-${project.slug}`}
						transition={springTransition}
						className="line-clamp-3 text-2xl leading-tight font-bold tracking-tight"
					>
						{project.title}
					</motion.span>
					<motion.span
						layoutId={`project-description-${project.slug}`}
						transition={springTransition}
						className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground"
					>
						{project.description}
					</motion.span>
				</span>

				<span className="mt-auto flex w-full items-end justify-between gap-4">
					<span className="truncate type-label text-muted-foreground">
						{project.technologies.map((tech) => tech.name).join(" / ")}
					</span>
					<HugeiconsIcon
						icon={ArrowRight}
						strokeWidth={2}
						className="size-4 shrink-0 -translate-x-1 opacity-0 transition-[opacity,translate] group-hover:translate-x-0 group-hover:opacity-100"
						aria-hidden="true"
					/>
				</span>
			</button>
		</motion.div>
	);
}

type ProjectModalProps = {
	project: Project;
	index: number;
	onClose: () => void;
};

const modalLinkClassName =
	"flex flex-1 items-center justify-center gap-2 px-4 py-2.5 type-label transition-colors hover:bg-foreground hover:text-background sm:flex-none";

function ProjectModal({ project, index, onClose }: ProjectModalProps) {
	"use no memo";
	const dialogRef = React.useRef<HTMLDivElement>(null);
	const titleId = `project-dialog-title-${project.slug}`;

	React.useEffect(() => {
		const previouslyFocused = document.activeElement as HTMLElement | null;
		dialogRef.current?.focus();

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("keydown", handleEscape);
			previouslyFocused?.focus();
		};
	}, [onClose]);

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				className="fixed inset-0 z-40 bg-canvas/70 backdrop-blur-sm"
				onClick={onClose}
				aria-hidden="true"
			/>

			<motion.div
				layoutId={`project-${project.slug}`}
				transition={springTransition}
				ref={dialogRef}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-3xl -translate-y-1/2 p-0.5 outline-none"
			>
				{/* Border and surface live on the frame so they can morph into the project page. */}
				<MorphFrame slug={project.slug} className="border-2 bg-background" />
				<CornerSquare position="top-left" />
				<CornerSquare position="top-right" />
				<CornerSquare
					position="bottom-left"
					layoutId={`corner-bl-${project.slug}`}
					transition={springTransition}
				/>
				<CornerSquare
					position="bottom-right"
					layoutId={`corner-br-${project.slug}`}
					transition={springTransition}
				/>

				<div className="max-h-[calc(100dvh-4rem)] overflow-y-auto">
					<div className="flex h-12 items-stretch justify-between border-b-2">
						<span className="flex items-center px-4 type-label text-muted-foreground">
							{pad(index)} — {mediumDate.format(new Date(project.date))}
						</span>
						<button
							type="button"
							onClick={onClose}
							className="flex cursor-pointer items-center gap-2 border-l-2 px-4 type-label transition-colors hover:bg-foreground hover:text-background"
						>
							Close
							<HugeiconsIcon
								icon={Cancel01Icon}
								strokeWidth={2}
								className="size-3.5"
							/>
						</button>
					</div>

					{project.cover ? (
						<img
							style={morph(project.slug, "cover")}
							src={project.cover}
							alt=""
							className="aspect-[2/1] w-full border-b-2 object-cover"
						/>
					) : (
						<div
							className="flex h-40 items-end border-b-2 bg-diagonal-dashed p-4"
							aria-hidden="true"
						>
							<span className="bg-background px-2 type-display text-muted-foreground/30">
								{pad(index)}
							</span>
						</div>
					)}

					<div className="space-y-6 p-4 sm:p-6">
						<div className="space-y-3">
							<StatusLabel status={project.status} />
							<motion.h2
								style={morph(project.slug, "title")}
								id={titleId}
								layoutId={`project-title-${project.slug}`}
								transition={springTransition}
								className="w-fit text-3xl leading-none font-extrabold tracking-[-0.04em] sm:text-4xl"
							>
								{project.title}
							</motion.h2>
							<motion.p
								layoutId={`project-description-${project.slug}`}
								transition={springTransition}
								className="leading-relaxed text-muted-foreground"
							>
								{project.description}
							</motion.p>
						</div>

						<TechList technologies={project.technologies} />
					</div>

					<div className="flex flex-col border-t-2 sm:flex-row sm:items-stretch">
						{(project.repository || project.demo) && (
							<div className="flex border-b-2 sm:border-r-2 sm:border-b-0">
								{project.repository && (
									<a
										href={project.repository}
										target="_blank"
										rel="noopener noreferrer"
										className={modalLinkClassName}
									>
										<HugeiconsIcon
											icon={Github}
											strokeWidth={2}
											className="size-3.5"
										/>
										Repository
									</a>
								)}
								{project.demo && (
									<a
										href={project.demo}
										target="_blank"
										rel="noopener noreferrer"
										className={cn(
											modalLinkClassName,
											project.repository && "border-l-2",
										)}
									>
										<HugeiconsIcon
											icon={ArrowUpRight01Icon}
											strokeWidth={2}
											className="size-3.5"
										/>
										Demo
									</a>
								)}
							</div>
						)}
						<Link
							to="/projects/$slugId"
							params={{ slugId: project.slug }}
							className="group ml-auto flex w-full items-center justify-center gap-2 bg-foreground px-4 py-3 type-label text-background transition-colors hover:bg-primary hover:text-primary-foreground sm:w-auto"
						>
							Full project
							<HugeiconsIcon
								icon={ArrowRight}
								strokeWidth={2}
								className="size-3.5 transition-transform group-hover:translate-x-0.5"
							/>
						</Link>
					</div>
				</div>
			</motion.div>
		</>
	);
}
