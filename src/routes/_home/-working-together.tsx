import { SectionHeading } from "./-layout";

const FACTS = [
	{ term: "Location", detail: "Ivano-Frankivsk, Ukraine · Kyiv time" },
	{ term: "Languages", detail: "Ukrainian — native · English — fluent" },
	{
		term: "Open to",
		detail:
			"Freelance projects, and full-time remote roles or on-site work in Ukraine.",
	},
] as const;

/** How a project runs, a little background, and the practical details. */
export function WorkingTogether({ index }: { index: string }) {
	return (
		<section aria-labelledby="working-title">
			<SectionHeading
				index={index}
				title="Working together"
				id="working-title"
			/>
			<div className="grid grid-cols-1 border-b-2 md:grid-cols-[1fr_20rem]">
				<div className="max-w-prose space-y-4 px-4 py-8 text-lg leading-relaxed">
					<p>
						I discuss the requirements with you, clarify them in writing, and
						share demos to gather feedback as the work develops.
					</p>
					<p>
						Most of my client work is long-term: I've built and looked after the
						same three business websites since 2022, from the first WordPress
						versions to the current rebuild.
					</p>
					<p className="text-muted-foreground">
						I've also taken on freelance projects through Freelancehunt and
						Kabanchik, and built websites pro bono for non-profit organisations.
					</p>
				</div>
				<dl className="border-t-2 md:border-t-0 md:border-l-2">
					{FACTS.map((fact) => (
						<div
							key={fact.term}
							className="border-b-2 px-4 py-4 last:border-b-0"
						>
							<dt className="mb-1.5 type-label text-muted-foreground">
								{fact.term}
							</dt>
							<dd className="font-medium">{fact.detail}</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
}
