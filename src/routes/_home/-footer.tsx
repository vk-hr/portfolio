import { SOCIAL_LINKS } from "#/lib/constants";

const SOURCE_URL = "https://github.com/vk-hr/portfolio";

const footerLinkClassName =
	"flex items-center border-l-2 px-4 transition-colors hover:bg-muted hover:text-foreground";

export function Footer() {
	return (
		<footer className="border-t-2">
			<div className="px-4">
				<div className="container mx-auto flex h-14 max-w-5xl items-stretch border-x-2 bg-background type-label text-muted-foreground">
					<span className="flex items-center px-4">
						© {new Date().getUTCFullYear()} VKHR
					</span>
					<nav className="ml-auto flex items-stretch" aria-label="Footer">
						<a
							href={SOCIAL_LINKS.github}
							target="_blank"
							rel="noopener noreferrer"
							className={footerLinkClassName}
						>
							GitHub ↗
						</a>
						<a
							href={SOURCE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className={footerLinkClassName}
						>
							Source ↗
						</a>
					</nav>
				</div>
			</div>
		</footer>
	);
}
