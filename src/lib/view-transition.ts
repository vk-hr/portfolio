/** A single project page: /projects/<slug>, optionally with a trailing slash. */
export const isProjectPage = (pathname?: string) =>
	pathname !== undefined && /^\/projects\/[^/]+\/?$/.test(pathname);

/**
 * The view-transition type for a navigation. src/styles.css uses it to show
 * only the larger rendering of a morphing project title.
 */
export function viewTransitionTypes(
	fromPathname: string | undefined,
	toPathname: string,
): Array<"to-project" | "from-project" | "page"> {
	if (isProjectPage(toPathname)) return ["to-project"];
	if (isProjectPage(fromPathname)) return ["from-project"];
	return ["page"];
}
