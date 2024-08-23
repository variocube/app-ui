import {ExpandLess, ExpandMore, FilterList} from "@mui/icons-material";
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
	fullWidth?: boolean;
	variant?: TextFieldProps["variant"];
	labels: Labels<"none" | "search">;
}

export function Filter(props: PropsWithChildren<FilterProps>) {
	const {label, active, enableSearch, onSearch, fullWidth, variant, labels, children} = props;

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

	return (
		<Fragment>
			<TextField
				variant={variant}
				label={label}
				onClick={enableSearch ? undefined : setOpen}
				value={value}
				onChange={setValue}
				onKeyDown={handleKeyDown}
				fullWidth={fullWidth}
				InputProps={{
					startAdornment: (
						<Stack direction="row" spacing={1} alignItems="center" sx={{mr: 2}}>
							<IconButton edge="start" onClick={enableSearch ? setOpen : undefined}>
								<FilterList />
							</IconButton>
							{active}
						</Stack>
					),
					endAdornment: (
						<Stack direction={"row"} spacing={1} alignItems="center">
							{active?.filter(node => Boolean(node)).length == 0 && (
								<Chip
									variant="outlined"
									label={labels("none")}
									clickable
									onClick={enableSearch ? setOpen : undefined}
								/>
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
		</Fragment>
	);
}
