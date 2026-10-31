import { AlertTriangle } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link, rootRouteId, useMatch, useRouter } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export function ErrorPage({ error }: ErrorComponentProps) {
	const router = useRouter();
	const isRoot = useMatch({
		strict: false,
		select: (state) => state.id === rootRouteId,
	});

	console.error(error);

	return (
		<main className="flex w-full items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<HugeiconsIcon
							icon={AlertTriangle}
							strokeWidth={2}
							className="text-destructive size-4"
						/>
						Something went wrong
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<pre className="bg-muted text-muted-foreground overflow-x-auto rounded-md p-3 font-mono text-sm">
						<code>
							{error instanceof Error ? error.message : String(error)}
						</code>
					</pre>
				</CardContent>
				<CardFooter className="justify-end gap-2">
					{isRoot ? (
						<Button
							variant="outline"
							nativeButton={false}
							render={<Link to="/" />}
						>
							Home
						</Button>
					) : (
						<Button variant="outline" onClick={() => window.history.back()}>
							Go Back
						</Button>
					)}
					<Button onClick={() => router.invalidate()}>Try Again</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
