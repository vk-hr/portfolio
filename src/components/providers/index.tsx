import { HeadContent, Scripts } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import type * as React from "react";
import { type Theme, ThemeProvider } from "start-theme";

import { Devtools } from "#/components/devtools";
import { setTheme } from "#/functions/theme";

type RootProvidersProps = {
	children: React.ReactNode;
	theme?: Theme;
};

export function RootProviders({ children, theme }: RootProvidersProps) {
	return (
		<ThemeProvider
			theme={theme ?? "system"}
			setThemeFn={(theme) => setTheme({ data: theme })}
		>
			<html lang="en" suppressHydrationWarning>
				<head>
					<HeadContent />
				</head>
				<body>
					{children}
					<Devtools />
					<Analytics />
					<SpeedInsights />
					<Scripts />
				</body>
			</html>
		</ThemeProvider>
	);
}
