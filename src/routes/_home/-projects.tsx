import {
	ArrowRight,
	Briefcase,
	Github,
	Link as LinkIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { Badge } from "#/components/ui/badge";
import { Separator } from "#/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { COLORS } from "#/lib/colors";
import type { ProjectSummary } from "#/lib/projects";

import { CornerSquare } from "./-layout";

const springTransition = { type: "spring", bounce: 0, duration: 0.3 } as const;

type Project = ProjectSummary;

type ProjectsProps = {
	recentProjects: Array<Project>;
	featuredProjects: Array<Project>;
};

export function Projects({ recentProjects, featuredProjects }: ProjectsProps) {
	"use no memo";
	const [tab, setTab] = React.useState<"recent" | "featured">("recent");
	const [selectedProject, setSelectedProject] = React.useState<Project | null>(
		null,
	);

	const handleProjectClick = (project: Project) => {
		setSelectedProject(project);
	};

	const projects = tab === "recent" ? recentProjects : featuredProjects;

	return (
		<section className="relative border-t-2 py-8">
			<CornerSquare position="top-left" />
			<CornerSquare position="top-right" />

			<div className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
				<Link
					to="/projects"
					className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<h2 className="text-xl font-semibold text-foreground sm:text-2xl">
						{tab === "recent" ? "Recent Projects" : "Featured Projects"}
					</h2>
					<HugeiconsIcon icon={ArrowRight} strokeWidth={2} className="size-5" />
					<span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-200 group-hover:max-w-20">
						see more
					</span>
				</Link>

				<div className="self-start border-2 bg-background px-1 sm:self-auto">
					<Tabs
						value={tab}
						onValueChange={(value) => setTab(value as "recent" | "featured")}
					>
						<TabsList variant="line">
							<TabsTrigger value="recent">Recent</TabsTrigger>
							<TabsTrigger value="featured">Featured</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>

			{!projects || projects.length === 0 ? (
				<div className="mx-4 mt-6 flex flex-col items-center justify-center border-2 border-dashed bg-muted/50 p-12 text-center">
					<HugeiconsIcon
						icon={Briefcase}
						strokeWidth={2}
						className="mb-4 size-8 text-muted-foreground/50"
					/>
					<p className="text-muted-foreground">
						{tab === "recent" ? "No projects yet." : "No featured projects."}
					</p>
				</div>
			) : (
				<div className="relative mt-6 grid sm:grid-cols-2 lg:grid-cols-3">
					{projects.map((project) => (
						<ProjectCard
							key={project.slug}
							project={project}
							onClick={handleProjectClick}
						/>
					))}
				</div>
			)}

			<AnimatePresence>
				{selectedProject && (
					<ProjectModal
						project={selectedProject}
						onClose={() => setSelectedProject(null)}
					/>
				)}
			</AnimatePresence>
		</section>
	);
}

type ProjectCardProps = {
	project: Project;
	onClick: (project: Project) => void;
};

function ProjectCard({ project, onClick }: ProjectCardProps) {
	"use no memo";
	const hasLinks = project.repository || project.demo;

	return (
		<motion.div
			layoutId={`project-${project.slug}`}
			transition={springTransition}
			style={{ willChange: "transform, opacity" }}
			className={cn(
				"group relative transform-gpu rounded-none bg-background py-0 ring-0",
				"border-t-2 border-r-0 border-b-0",
				"transition-[border-width] duration-300",
				"last:border-b-2",
				"sm:odd:border-r-2",
				"sm:nth-last-[-n+2]:border-b-2",
				"lg:nth-[3n]:border-r-0",
				"lg:not-nth-[3n]:border-r-2",
				"lg:nth-last-[-n+3]:border-b-2",
			)}
		>
			<CornerSquare
				position="top-right"
				mode="offset"
				className="-mt-px -mr-px"
				layoutId={`corner-tr-${project.slug}`}
				transition={springTransition}
			/>
			<CornerSquare
				position="top-left"
				mode="offset"
				className="-mt-px -ml-px"
				layoutId={`corner-tl-${project.slug}`}
				transition={springTransition}
			/>
			<CornerSquare
				position="bottom-left"
				mode="offset"
				className="-mb-px -ml-px"
				layoutId={`corner-bl-${project.slug}`}
				transition={springTransition}
			/>
			<CornerSquare
				position="bottom-right"
				mode="offset"
				className="-mr-px -mb-px"
				layoutId={`corner-br-${project.slug}`}
				transition={springTransition}
			/>

			<div className="relative overflow-hidden py-4">
				<span className="pointer-events-none absolute -top-1/2 -left-full z-10 h-[200%] w-3/4 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-0 group-hover:translate-x-[350%] group-hover:duration-1000" />

				<button
					type="button"
					onClick={() => onClick(project)}
					className="block w-full cursor-pointer p-4 text-left"
				>
					<motion.h3
						layoutId={`project-title-${project.slug}`}
						className="text-base font-semibold sm:text-lg"
						transition={springTransition}
					>
						{project.title}
					</motion.h3>
					{project.description && (
						<motion.p
							layoutId={`project-description-${project.slug}`}
							className="mt-2 line-clamp-2 text-sm text-muted-foreground"
							transition={springTransition}
						>
							{project.description}
						</motion.p>
					)}
				</button>

				{hasLinks && (
					<div className="pointer-events-none absolute top-4 right-4 z-10 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
						<motion.div
							layoutId={`project-links-${project.slug}`}
							transition={springTransition}
							className="flex border-2 bg-background"
						>
							{project.repository && (
								<a
									href={project.repository}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center p-2 transition-colors hover:bg-muted"
									onClick={(e) => e.stopPropagation()}
									aria-label="View repository"
								>
									<HugeiconsIcon
										icon={Github}
										strokeWidth={2}
										className="size-4"
									/>
								</a>
							)}
							{project.repository && project.demo && (
								<Separator className="w-0.5!" orientation="vertical" />
							)}
							{project.demo && (
								<a
									href={project.demo}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center p-2 transition-colors hover:bg-muted"
									onClick={(e) => e.stopPropagation()}
									aria-label="View demo"
								>
									<HugeiconsIcon
										icon={LinkIcon}
										strokeWidth={2}
										className="size-4"
									/>
								</a>
							)}
						</motion.div>
					</div>
				)}
			</div>
		</motion.div>
	);
}

type ProjectModalProps = {
	project: Project;
	onClose: () => void;
};

function ProjectModal({ project, onClose }: ProjectModalProps) {
	"use no memo";
	const dialogRef = React.useRef<HTMLDivElement>(null);

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
				style={{ willChange: "opacity" }}
				className="fixed inset-0 z-40 transform-gpu bg-black/10 backdrop-blur-xs"
				onClick={onClose}
			/>

			<motion.div
				layoutId={`project-${project.slug}`}
				transition={springTransition}
				style={{ willChange: "transform, opacity" }}
				ref={dialogRef}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-labelledby={`project-dialog-title-${project.slug}`}
				className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 transform-gpu outline-none"
			>
				<div className="relative border-2 bg-background">
					<CornerSquare
						position="top-left"
						mode="offset"
						layoutId={`corner-tl-${project.slug}`}
						transition={springTransition}
					/>
					<CornerSquare
						position="top-right"
						mode="offset"
						layoutId={`corner-tr-${project.slug}`}
						transition={springTransition}
					/>
					<CornerSquare
						position="bottom-left"
						mode="offset"
						layoutId={`corner-bl-${project.slug}`}
						transition={springTransition}
					/>
					<CornerSquare
						position="bottom-right"
						mode="offset"
						layoutId={`corner-br-${project.slug}`}
						transition={springTransition}
					/>

					<div className="relative">
						{project.cover ? (
							<div className="h-64 w-full overflow-hidden">
								<img
									src={project.cover}
									alt={project.title}
									className="h-full w-full object-cover"
								/>
							</div>
						) : (
							<div className="relative h-64 w-full overflow-hidden bg-linear-to-br from-muted via-muted/80 to-muted/60">
								<div className="pointer-events-none absolute inset-0 bg-diagonal-dashed opacity-20" />
								<svg
									className="pointer-events-none absolute inset-0 size-full"
									role="img"
									aria-label="Grain texture overlay"
								>
									<title>Grain texture</title>
									<filter id="grain" colorInterpolationFilters="sRGB">
										<feTurbulence
											type="fractalNoise"
											baseFrequency="0.9"
											numOctaves="2"
											stitchTiles="stitch"
										/>
										<feColorMatrix type="saturate" values="0" />
									</filter>
									<rect
										width="100%"
										height="100%"
										filter="url(#grain)"
										opacity="0.15"
									/>
								</svg>
							</div>
						)}

						<div className="p-4 sm:p-6">
							<div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
								<motion.h2
									id={`project-dialog-title-${project.slug}`}
									layoutId={`project-title-${project.slug}`}
									className="text-xl font-bold sm:text-2xl"
									transition={springTransition}
								>
									{project.title}
								</motion.h2>

								{(project.repository || project.demo) && (
									<motion.div
										layoutId={`project-links-${project.slug}`}
										transition={springTransition}
										className="flex w-full shrink-0 border-2 bg-background sm:w-auto"
									>
										{project.repository && (
											<a
												href={project.repository}
												target="_blank"
												rel="noopener noreferrer"
												className="flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted sm:flex-none"
											>
												<HugeiconsIcon
													icon={Github}
													strokeWidth={2}
													className="size-4"
												/>
												Repository
											</a>
										)}
										{project.repository && project.demo && (
											<Separator className="w-0.5!" orientation="vertical" />
										)}
										{project.demo && (
											<a
												href={project.demo}
												target="_blank"
												rel="noopener noreferrer"
												className="flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted sm:flex-none"
											>
												<HugeiconsIcon
													icon={LinkIcon}
													strokeWidth={2}
													className="size-4"
												/>
												Demo
											</a>
										)}
									</motion.div>
								)}
							</div>

							{project.technologies && project.technologies.length > 0 && (
								<div className="mb-4">
									<div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
										Tech Stack
									</div>
									<div className="flex flex-wrap gap-2">
										{project.technologies.map((tech) => (
											<Badge
												key={tech.slug}
												variant="outline"
												className={cn(
													COLORS[tech.color].text,
													COLORS[tech.color].border,
													"rounded-none border bg-transparent",
												)}
											>
												{tech.name}
											</Badge>
										))}
									</div>
								</div>
							)}

							{project.description && (
								<div className="mb-6">
									<div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
										Description
									</div>
									<motion.p
										layoutId={`project-description-${project.slug}`}
										className="text-sm leading-relaxed text-muted-foreground"
										transition={springTransition}
									>
										{project.description}
									</motion.p>
								</div>
							)}

							<div className="flex justify-end border-t-2 pt-4">
								<Link
									to="/projects/$slugId"
									params={{ slugId: project.slug }}
									onClick={onClose}
									className="group flex items-center gap-2 border-2 bg-background px-4 py-2 font-medium transition-colors hover:bg-muted"
								>
									See Full Project
									<HugeiconsIcon
										icon={ArrowRight}
										strokeWidth={2}
										className="size-4 transition-transform group-hover:translate-x-1"
									/>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</>
	);
}
