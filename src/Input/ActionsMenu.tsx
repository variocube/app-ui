import {ExpandMore} from "@mui/icons-material";
import {Button, ButtonGroup, ButtonPropsSizeOverrides, Menu, MenuItem} from "@mui/material";
import {OverridableStringUnion} from "@mui/types";
import * as React from "react";
import {PropsWithChildren, useState} from "react";

export interface ActionMenuItem {
	label: string;
	onClick: () => void;
}

export interface ActionsMenuProps {
	actions: ActionMenuItem[];
}

export function ActionsMenu(props: ActionsMenuProps) {
	const {actions} = props;

	if (actions.length == 0) {
		return null;
	}

	if (actions.length == 1) {
		return <SimpleButton label={actions[0].label} onClick={actions[0].onClick} />;
	}

	return (
		<PushButtonWithMenu label={actions[0].label} onClick={actions[0].onClick}>
			{actions.slice(1).map((action, index) => (
				<MenuItem key={index} onClick={action.onClick}>{action.label}</MenuItem>
			))}
		</PushButtonWithMenu>
	);
}

interface SimpleButtonProps {
	label: string;
	onClick: () => void;
	primary?: boolean;
	size?: OverridableStringUnion<"small" | "medium" | "large", ButtonPropsSizeOverrides>;
	loading?: boolean;
}

function SimpleButton({label, onClick, primary, size, loading}: SimpleButtonProps) {
	return (
		<Button
			color={primary ? "primary" : undefined}
			variant={primary ? "contained" : "outlined"}
			size={size}
			disabled={loading}
			onClick={onClick}
		>
			{label}
		</Button>
	);
}

interface PushButtonWithMenuProps extends PropsWithChildren<any> {
	label: string;
	onClick: () => void;
	disabled?: boolean;
	size?: "small" | "medium" | "large";
}

function PushButtonWithMenu(props: PushButtonWithMenuProps) {
	const {label, onClick, disabled, size, children} = props;

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	return (
		<React.Fragment>
			<ButtonGroup size={size}>
				<Button variant="outlined" disabled={disabled} onClick={onClick}>{label}</Button>
				<Button
					variant="outlined"
					disabled={disabled}
					size="small"
					onClick={(e) => setAnchorEl(e.currentTarget)}
				>
					<ExpandMore />
				</Button>
			</ButtonGroup>
			{children
				&& (
					<Menu
						open={Boolean(anchorEl)}
						anchorEl={anchorEl}
						onClose={() => setAnchorEl(null)}
						keepMounted
						onClick={() => setAnchorEl(null)}
						anchorOrigin={{vertical: "bottom", horizontal: "center"}}
						transformOrigin={{vertical: "top", horizontal: "center"}}
					>
						{children}
					</Menu>
				)}
		</React.Fragment>
	);
}
