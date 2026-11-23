import { cn } from "cn";

import { SectionHeading } from "./-layout";

const SERVICES = [
	{
		title: "Websites and web applications",
		body: "Frontend and backend for business websites and web apps: content you can edit through a CMS, forms, and the workflows behind them.",
		examples: ["Next.js", "Payload CMS", "TypeScript"],
	},
	{
		title: "Automation and integrations",
		body: "Python and JavaScript scripts that take over repetitive tasks, collect data from websites, and connect the services you already use through their APIs.",
		examples: ["Python", "Web scraping", "API integrations"],
	},
	{
		title: "Deployment and ongoing improvements",
		body: "Getting the project live, then fixing and improving it as needs change. Deployment and maintenance can be included depending on the project.",
		examples: ["Deployment", "Fixes", "Maintenance"],
	},
] as const;

export function Services({ index }: { index: string }) {
	return (
		<section aria-labelledby="services-title">
			<SectionHeading
				index={index}
				title="What I can help with"
				id="services-title"
			/>
			<ul className="grid grid-cols-1 lg:grid-cols-3">
				{SERVICES.map((service, i) => (
					<li
						key={service.title}
						className={cn(
							"flex flex-col gap-4 border-b-2 px-4 py-8",
							i < SERVICES.length - 1 && "lg:border-r-2",
						)}
					>
						<h3 className="text-xl leading-tight font-bold tracking-tight sm:text-2xl">
							{service.title}
						</h3>
						<p className="leading-relaxed text-muted-foreground">
							{service.body}
						</p>
						<p className="mt-auto type-label text-muted-foreground">
							{service.examples.join(" / ")}
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}
