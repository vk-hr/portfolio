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

// Email first: it is the main way to get in touch.
const LINKS = [
	{
		label: "Email",
		href: `mailto:${SOCIAL_LINKS.email}`,
		icon: Mail,
		external: false,
	},
	{
		label: "GitHub",
		href: SOCIAL_LINKS.github,
		icon: Github,
		external: true,
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
					Full-stack developer — websites, web apps, automation
				</p>
				<h1 id="hero-title" className="type-display">
					Hi, I'm
					<br />
					Viktor<span className="text-primary">.</span>
				</h1>
				<p className="mt-8 max-w-3xl text-2xl leading-tight font-bold tracking-tight sm:mt-10 sm:text-4xl">
					I build websites, web applications, and automation tools.
				</p>
				<CornerSquare position="bottom-left" />
				<CornerSquare position="bottom-right" />
			</div>

			<div className="relative grid grid-cols-1 border-b-2 sm:grid-cols-[1fr_15rem]">
				<div className="max-w-prose px-4 py-8 text-lg leading-relaxed sm:py-10 sm:text-xl">
					<p>
						I work across frontend and backend development, using JavaScript,
						TypeScript, and Python to turn requirements into working software —
						from editable business websites to integrations and scripts that cut
						down repetitive work.
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
