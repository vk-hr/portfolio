import { Desktop, Moon, Sun } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type Theme, useTheme } from "start-theme";

import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";

const THEMES = [
	{ value: "system", icon: Desktop, label: "System theme" },
	{ value: "light", icon: Sun, label: "Light theme" },
	{ value: "dark", icon: Moon, label: "Dark theme" },
] as const;

type ThemeSwitcherProps = {
	className?: string;
};

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
	"use no memo";
	const { theme, setTheme } = useTheme();

	return (
		<Tabs value={theme} onValueChange={(value: Theme) => setTheme(value)}>
			<TabsList variant="line" aria-label="Colour theme" className={className}>
				{THEMES.map(({ value, icon, label }) => (
					<TabsTrigger
						key={value}
						value={value}
						aria-label={label}
						title={label}
						className="size-8 cursor-pointer"
					>
						<HugeiconsIcon icon={icon} strokeWidth={1.75} />
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
