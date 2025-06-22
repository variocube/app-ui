import {List as MuiList, ListProps as MuiListProps} from "@mui/material";
import React from "react";
import {ErrorAlert} from "../ErrorAlert";
import {SkeletonListItem, SkeletonListItemProps} from "./SkeletonListItem";

export type ListProps = MuiListProps & {
	/** Whether the list is loading and skeleton list items should be shown. */
	loading?: boolean;

	/** The error that should be shown. */
	error?: any;

	/** The number of skeleton items to show. */
	items?: number;

	/** Properties of the skeleton list items. */
	skeleton?: SkeletonListItemProps;
};

export function List(props: ListProps) {
	const {
		children,
		error,
		loading,
		items = 3,
		skeleton = {},
		...listProps
	} = props;

	if (error) {
		return <ErrorAlert error={error} />;
	}
	return (
		<MuiList {...listProps}>
			{loading
				? Array.from({length: items}).map(() => <SkeletonListItem {...skeleton} />)
				: children}
		</MuiList>
	);
}
