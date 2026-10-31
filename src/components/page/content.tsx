import { cn } from "cn";
import type * as React from "react";
import { CardContent } from "#/components/ui/card";

export function PageContent({
	className,
	...props
}: React.ComponentProps<typeof CardContent>) {
	return <CardContent className={cn("min-w-0 flex-1", className)} {...props} />;
}
