import { Footer } from "./-footer";
import { CornerSquare, Layout } from "./-layout";

export function Loading() {
	return (
		<Layout>
			<div className="flex h-full flex-1 flex-col px-4">
				<main className="bg-background relative container mx-auto max-w-4xl flex-1 border-r-2 border-l-2">
					<CornerSquare position="top-left" />
					<CornerSquare position="top-right" />

					<div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
						<div className="border-muted-foreground size-8 animate-spin rounded-full border-4 border-t-transparent" />
						<p className="text-muted-foreground font-mono text-lg">
							Loading ...
						</p>
					</div>

					<CornerSquare position="bottom-left" />
					<CornerSquare position="bottom-right" />
				</main>
			</div>
			<Footer />
		</Layout>
	);
}
