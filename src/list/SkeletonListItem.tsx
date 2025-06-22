import {ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Skeleton} from "@mui/material";
import React, {Fragment} from "react";

export interface SkeletonListItemProps {
	/** Whether the list item has an icon. */
	icon?: boolean;

	/** Whether the list item has a primary text. */
	primary?: boolean;

	/** The number of lines in the secondary text. */
	secondary?: number;

	/** Whether the list item has a secondary action. */
	action?: boolean;

	/** Whether the list item has a divider. */
	divider?: boolean;
}

export function SkeletonListItem(props: Readonly<SkeletonListItemProps>) {
	const {
		icon = true,
		primary = true,
		secondary = 1,
		action = false,
		divider = false,
	} = props;

	return (
		<ListItem divider={divider}>
			{icon && (
				<ListItemIcon>
					<Skeleton variant="circular" width={40} height={40} />
				</ListItemIcon>
			)}
			<ListItemText
				primary={primary && <Skeleton variant="text" />}
				secondary={
					<Fragment>
						{Array.from({length: secondary}).map(() => <Skeleton variant="text" />)}
					</Fragment>
				}
			/>
			<ListItemSecondaryAction>
				{action && <Skeleton variant="rounded" width={40} height={40} />}
			</ListItemSecondaryAction>
		</ListItem>
	);
}
