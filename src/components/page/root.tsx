import { cn } from "cn";
import type * as React from "react";
import { Card } from "#/components/ui/card";

export function PageRoot({
	className,
	...props
}: React.ComponentProps<typeof Card>) {
	return <Card className={cn("min-w-0 flex-1", className)} {...props} />;
}
