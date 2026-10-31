import { cn } from "cn";
import type * as React from "react";
import { CardHeader } from "#/components/ui/card";

export function PageHeader({
	className,
	...props
}: React.ComponentProps<typeof CardHeader>) {
	return <CardHeader className={cn("items-center", className)} {...props} />;
}
