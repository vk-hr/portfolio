import {
	type ColumnDef,
	metaHelper,
	rowSortingFeature,
	tableFeatures,
} from "@tanstack/react-table";

export type DataTableColumnMeta = {
	headerClassName?: string;
	cellClassName?: string;
};

export const dataTableFeatures = tableFeatures({
	rowSortingFeature,
	columnMeta: metaHelper<DataTableColumnMeta>(),
});

export type DataTableColumnDef<TData extends object = object> = ColumnDef<
	typeof dataTableFeatures,
	TData
>;
