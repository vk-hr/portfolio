import { ArrowLeft } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";

import { Page } from "./-layout";

export function NotFound() {
	return (
		<Page className="justify-center">
			<div className="px-4 py-16 sm:py-24">
				<p className="mb-6 type-label text-muted-foreground">Error — 404</p>
				<h1 className="type-display">
					Not
					<br />
					found<span className="text-primary">.</span>
				</h1>
				<p className="mt-8 max-w-md text-lg text-muted-foreground">
					The page you're looking for doesn't exist or has moved.
				</p>
				<Link
					to="/"
					className="group mt-8 inline-flex items-center gap-2 border-2 px-4 py-3 type-label transition-colors hover:bg-foreground hover:text-background"
				>
					<HugeiconsIcon
						icon={ArrowLeft}
						strokeWidth={2}
						className="size-3.5 transition-transform group-hover:-translate-x-0.5"
					/>
					Back home
				</Link>
			</div>
		</Page>
	);
}
