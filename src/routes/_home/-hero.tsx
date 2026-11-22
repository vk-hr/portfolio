import {
	ArrowUpRight01Icon,
	Document,
	Github,
	Linkedin,
	Mail,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { SOCIAL_LINKS } from "#/lib/constants";

import { CornerSquare } from "./-layout";

const LINKS = [
	{
		label: "GitHub",
		href: SOCIAL_LINKS.github,
		icon: Github,
		external: true,
	},
	{
		label: "Email",
		href: `mailto:${SOCIAL_LINKS.email}`,
		icon: Mail,
		external: false,
	},
	{
		label: "LinkedIn",
		href: SOCIAL_LINKS.linkedin,
		icon: Linkedin,
		external: true,
	},
	{ label: "CV", href: SOCIAL_LINKS.cv, icon: Document, external: true },
] as const;

export function Hero() {
	return (
		<section aria-labelledby="hero-title">
			<div className="relative border-b-2 px-4 pt-12 pb-8 sm:pt-20 sm:pb-10">
				<p className="mb-8 type-label text-muted-foreground sm:mb-12">
					Software developer — frontend, backend, DevOps
				</p>
				<h1 id="hero-title" className="type-display">
					Hi, I'm
					<br />
					Viktor<span className="text-primary">.</span>
				</h1>
				<CornerSquare position="bottom-left" />
				<CornerSquare position="bottom-right" />
			</div>

			<div className="relative grid grid-cols-1 border-b-2 sm:grid-cols-[1fr_15rem]">
				<div className="max-w-prose space-y-4 px-4 py-8 text-lg leading-relaxed sm:py-10 sm:text-xl">
					<p>
						I'm a software developer who loves building web applications,
						whether it's frontend, backend, or DevOps — I've worked across all
						of them.
					</p>
					<p className="text-muted-foreground">
						Even if that sounds like a jack of all trades, I know I don't know
						everything. I'm eager to learn new things and grow.
					</p>
				</div>

				<ul
					className="grid grid-cols-2 gap-0.5 border-t-2 bg-border sm:grid-cols-1 sm:border-t-0 sm:border-l-2"
					aria-label="Contact and profiles"
				>
					{LINKS.map((link) => (
						<li key={link.label} className="bg-background">
							<a
								href={link.href}
								{...(link.external && {
									target: "_blank",
									rel: "noopener noreferrer",
								})}
								className="group flex h-full min-h-14 items-center gap-3 px-4 transition-colors hover:bg-foreground hover:text-background"
							>
								<HugeiconsIcon
									icon={link.icon}
									strokeWidth={1.75}
									className="size-4.5"
									aria-hidden="true"
								/>
								<span className="font-medium">{link.label}</span>
								<HugeiconsIcon
									icon={ArrowUpRight01Icon}
									strokeWidth={2}
									className="ml-auto size-4 opacity-40 transition-[opacity,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
									aria-hidden="true"
								/>
							</a>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
