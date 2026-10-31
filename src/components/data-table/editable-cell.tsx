import { cn } from "cn";
import type { EditableCellProps } from "./types";

export function DataTableEditableCell({
	isEditing,
	displayValue,
	onDoubleClick,
	className,
	children,
}: EditableCellProps) {
	if (isEditing) {
		return <>{children}</>;
	}

	return (
		<button
			type="button"
			className={cn(
				"w-full cursor-text truncate text-left select-none",
				className,
			)}
			title="Double-click to edit"
			onDoubleClick={onDoubleClick}
		>
			{displayValue}
		</button>
	);
}
