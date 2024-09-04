import {Clear, ExpandLess, ExpandMore, FilterList} from "@mui/icons-material";
import {Box, Chip, ClickAwayListener, IconButton, Popover, Stack} from "@mui/material";
import React, {Fragment, KeyboardEvent, PropsWithChildren, ReactNode, useState} from "react";
import {TextField, TextFieldProps} from "../Input";
import {Labels} from "../localization";
import {useFlag} from "../utils";

export interface FilterProps {
	label?: string;
	active?: ReactNode[];
	enableSearch?: boolean;
	onSearch?: (search: string) => any;
	onClear?: () => any;
	fullWidth?: boolean;
	variant?: TextFieldProps["variant"];
	labels: Labels<"none" | "search" | "reset">;
	onFilterClick?: () => void;
}

export function Filter(props: PropsWithChildren<FilterProps>) {
	const {label, active, enableSearch, onSearch, onClear, fullWidth, variant, labels, onFilterClick, children} = props;

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [open, setOpen, clearOpen, toggleOpen] = useFlag(false);

	const [value, setValue] = useState("");

	function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
		if (onSearch) {
			if (e.key == "Enter") {
				onSearch(value);
				setValue("");
			}
		}
	}

	function handleSetOpen() {
		setOpen();
		if (onFilterClick) onFilterClick();
	}


	const hasActiveFilter = Boolean(active?.filter(node => Boolean(node)).length);

	return (
		<Fragment>
			<TextField
				variant={variant}
				label={label}
				onClick={enableSearch ? undefined : handleSetOpen}
				value={value}
				onChange={setValue}
				onKeyDown={handleKeyDown}
				fullWidth={fullWidth}
				InputProps={{
					startAdornment: (
						<Stack direction="row" spacing={1} alignItems="center" sx={{mr: 2}}>
							<IconButton edge="start" onClick={enableSearch ? handleSetOpen : undefined}>
								<FilterList />
							</IconButton>
							{active}
						</Stack>
					),
					endAdornment: (
						<Stack direction={"row"} spacing={1} alignItems="center">
							{!hasActiveFilter && (
								<Chip
									variant="outlined"
									label={labels("none")}
									clickable
									onClick={enableSearch ? handleSetOpen : undefined}
								/>
							)}
							{hasActiveFilter && onClear && (
								<IconButton onClick={onClear} title={labels("reset")}>
									<Clear/>
								</IconButton>
							)}
							<IconButton onClick={toggleOpen} edge="end">
								{open ? <ExpandLess /> : <ExpandMore />}
							</IconButton>
						</Stack>
					),
					readOnly: !enableSearch,
					ref: setAnchorEl,
					placeholder: enableSearch ? labels("search") : undefined,
				}}
			/>
			{children && (
				<Popover
					open={open}
					anchorEl={anchorEl}
					onClose={clearOpen}
					anchorOrigin={{
						horizontal: "left",
						vertical: "bottom",
					}}
				>
					<ClickAwayListener onClickAway={clearOpen}>
						<Box width={anchorEl?.clientWidth}>
							{children}
						</Box>
					</ClickAwayListener>
				</Popover>
			)}
		</Fragment>
	);
}
