import { Link } from "@tanstack/react-router";
import { cn } from "cn";

import { ThemeSwitcher } from "#/components/theme-switcher";

const navLinkClassName =
	"group/nav relative flex items-center gap-2 border-l-2 px-4 type-label text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:text-foreground";

export function Header() {
	return (
		// Same name on every page: the header holds still while the page changes.
		<header
			className="border-b-2"
			style={{
				viewTransitionName: "site-header",
				viewTransitionClass: "site-header",
			}}
		>
			<a
				href="#main"
				className="sr-only z-50 bg-foreground px-4 py-2 type-label text-background focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
			>
				Skip to content
			</a>
			<div className="px-4">
				<div className="container mx-auto flex h-14 max-w-5xl items-stretch border-x-2 bg-background">
					<Link
						to="/"
						className="flex items-center gap-2.5 px-4 text-lg font-extrabold tracking-tighter transition-colors hover:bg-muted"
					>
						<span className="size-2.5 bg-foreground" aria-hidden="true" />
						VKHR
					</Link>
					<nav className="ml-auto flex items-stretch" aria-label="Main">
						<Link to="/projects" className={navLinkClassName}>
							<span
								className="size-1.5 bg-primary opacity-0 transition-opacity group-data-[status=active]/nav:opacity-100"
								aria-hidden="true"
							/>
							Projects
						</Link>
						{/*
						 * Exact match: otherwise "/" counts as active on every page.
						 * Hidden on phones, where it doesn't fit and the hero's Email
						 * link is right below.
						 */}
						<Link
							to="/"
							hash="contact"
							activeOptions={{ exact: true, includeHash: true }}
							className={cn(navLinkClassName, "max-sm:hidden")}
						>
							<span
								className="size-1.5 bg-primary opacity-0 transition-opacity group-data-[status=active]/nav:opacity-100"
								aria-hidden="true"
							/>
							Contact
						</Link>
					</nav>
					<div className="flex items-center border-l-2 px-2">
						<ThemeSwitcher />
					</div>
				</div>
			</div>
		</header>
	);
}
