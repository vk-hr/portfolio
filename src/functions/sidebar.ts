import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

// Kept in sync with the cookie set by the sidebar component (see ui/sidebar).
const SIDEBAR_COOKIE_NAME = "sidebar_state";

export const getSidebarOpenState = createServerFn({ method: "GET" }).handler(
	async () => {
		const cookieValue = getCookie(SIDEBAR_COOKIE_NAME);

		if (cookieValue === "true") {
			return true;
		}

		if (cookieValue === "false") {
			return false;
		}

		return true;
	},
);
