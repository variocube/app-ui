import {List as MuiList, ListProps as MuiListProps} from "@mui/material";
import React from "react";
import {ErrorAlert} from "../ErrorAlert";
import {SkeletonListItem, SkeletonListItemProps} from "./SkeletonListItem";

export type ListProps = MuiListProps & {
	loading?: boolean;
	error?: any;
	items?: number;
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
			{loading && Array.from({length: items}).map(() => <SkeletonListItem {...skeleton} />)}
			{!loading && children}
		</MuiList>
	);
}
