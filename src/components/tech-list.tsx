import { cn } from "cn";

import { COLORS } from "#/lib/colors";
import type { ProjectSummary, Technology } from "#/lib/projects";

type TechListProps = {
	technologies: Array<Technology>;
	className?: string;
};

/** Technologies as small mono tags, each marked with its palette colour. */
export function TechList({ technologies, className }: TechListProps) {
	if (technologies.length === 0) return null;

	return (
		<ul
			className={cn("flex flex-wrap gap-1.5", className)}
			aria-label="Technologies"
		>
			{technologies.map((tech) => (
				<li
					key={tech.slug}
					className={cn(
						"inline-flex items-center gap-1.5 border px-1.5 py-0.5 type-label",
						COLORS[tech.color].border,
						COLORS[tech.color].text,
					)}
				>
					<span className="size-1.5 bg-current" aria-hidden="true" />
					{tech.name}
				</li>
			))}
		</ul>
	);
}

type StatusLabelProps = {
	status: ProjectSummary["status"];
	className?: string;
};

export function StatusLabel({ status, className }: StatusLabelProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-2 type-label",
				status === "active" ? "text-primary" : "text-muted-foreground",
				className,
			)}
		>
			<span
				className={cn(
					"size-1.5",
					status === "active" ? "bg-primary" : "bg-muted-foreground",
				)}
				aria-hidden="true"
			/>
			{status}
		</span>
	);
}
