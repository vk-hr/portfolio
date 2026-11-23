import { ArrowUpRight01Icon, Mail } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { SOCIAL_LINKS } from "#/lib/constants";

import { SectionHeading } from "./-layout";

const PROFILES = [
	{ label: "GitHub", href: SOCIAL_LINKS.github },
	{ label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
	{ label: "CV", href: SOCIAL_LINKS.cv },
] as const;

/** Closing call to action: email first, profiles for employers after. */
export function Contact({ index }: { index: string }) {
	return (
		<section aria-labelledby="contact-title" id="contact" className="flex-1">
			<SectionHeading index={index} title="Contact" id="contact-title" />
			<div className="px-4 py-12 sm:py-16">
				<p className="max-w-3xl text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
					Tell me what you're building or trying to improve.
				</p>
				<p className="mt-6 max-w-prose text-lg leading-relaxed text-muted-foreground">
					Share your existing website, requirements, and any deadline.
				</p>
				<a
					href={`mailto:${SOCIAL_LINKS.email}`}
					className="group mt-8 inline-flex max-w-full items-center gap-3 bg-foreground px-5 py-4 text-background transition-colors hover:bg-primary hover:text-primary-foreground"
				>
					<HugeiconsIcon
						icon={Mail}
						strokeWidth={1.75}
						className="size-5 shrink-0"
						aria-hidden="true"
					/>
					<span className="truncate font-medium sm:text-lg">
						{SOCIAL_LINKS.email}
					</span>
				</a>
				<ul
					className="mt-8 flex flex-wrap gap-x-6 gap-y-2 type-label"
					aria-label="Profiles"
				>
					{PROFILES.map((profile) => (
						<li key={profile.label}>
							<a
								href={profile.href}
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
							>
								{profile.label}
								<HugeiconsIcon
									icon={ArrowUpRight01Icon}
									strokeWidth={2}
									className="size-3.5"
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
