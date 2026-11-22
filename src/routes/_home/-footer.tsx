import { SOCIAL_LINKS } from "#/lib/constants";

const SOURCE_URL = "https://github.com/vk-hr/portfolio";

export function Footer() {
	return (
		<footer className="border-t-2">
			<div className="px-4">
				<div className="container mx-auto flex h-13 max-w-4xl items-center justify-between gap-4 border-x-2 px-4 text-sm text-muted-foreground">
					<span>© {new Date().getUTCFullYear()} VKHR</span>
					<nav className="flex items-center gap-4" aria-label="Footer">
						<a
							href={SOCIAL_LINKS.github}
							target="_blank"
							rel="noopener noreferrer"
							className="transition-colors hover:text-foreground"
						>
							GitHub
						</a>
						<a
							href={SOURCE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="transition-colors hover:text-foreground"
						>
							Source
						</a>
					</nav>
				</div>
			</div>
		</footer>
	);
}
