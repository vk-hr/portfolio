import { Page } from "./-layout";

export function Loading() {
	return (
		<Page header={false} className="items-center justify-center">
			<div
				className="flex flex-col items-center gap-4 py-24"
				role="status"
				aria-live="polite"
			>
				<div className="flex gap-1.5" aria-hidden="true">
					{[0, 1, 2].map((i) => (
						<span
							key={i}
							className="size-2.5 bg-foreground motion-safe:animate-pulse"
							style={{ animationDelay: `${i * 150}ms` }}
						/>
					))}
				</div>
				<p className="type-label text-muted-foreground">Loading</p>
			</div>
		</Page>
	);
}
