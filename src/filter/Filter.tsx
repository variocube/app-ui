import {Clear, ExpandLess, ExpandMore, FilterList} from "@mui/icons-material";
import {Box, Chip, Collapse, IconButton, Paper, Stack} from "@mui/material";
import React, {KeyboardEvent, PropsWithChildren, ReactNode, useEffect, useState} from "react";
import {TextField, TextFieldProps} from "../Input";
import {Labels} from "../localization";
import {useFlag} from "../utils";

export interface FilterProps {
	label?: string;
	active?: ReactNode[];
	enableSearch?: boolean;
	onSearch?: (search: string) => any;
	onClear?: () => any;
	variant?: TextFieldProps["variant"];
	labels: Labels<"none" | "search" | "reset">;

	/**
	 * Whether the `children` are placed in a paper (default: true).
	 */
	paper?: boolean;

	/**
	 * Called when the filter is opened.
	 *
	 * @deprecated use `onChangeOpen` instead.
	 */
	onFilterClick?: () => void;

	/**
	 * Called when the open state of the filter changes.
	 * @param open Whether the filter is opened.
	 */
	onChangeOpen?: (open: boolean) => void;
}

export function Filter(props: PropsWithChildren<FilterProps>) {
	const {
		label,
		active,
		enableSearch,
		onSearch,
		onClear,
		variant,
		labels,
		paper = true,
		onFilterClick,
		onChangeOpen,
		children,
	} = props;

	const [open, setOpen, , toggleOpen] = useFlag(false);

	const [value, setValue] = useState("");

	function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
		if (onSearch) {
			if (e.key == "Enter") {
				onSearch(value);
				setValue("");
			}
		}
	}

	useEffect(() => {
		if (open && onFilterClick) {
			onFilterClick();
		}
	}, [onFilterClick, open]);

	useEffect(() => {
		if (onChangeOpen) {
			onChangeOpen(open);
		}
	}, [onChangeOpen, open]);

	const hasActiveFilter = Boolean(active?.filter(node => Boolean(node)).length);

	return (
		<Box>
			<TextField
				variant={variant}
				label={label}
				onClick={enableSearch ? undefined : toggleOpen}
				value={value}
				onChange={setValue}
				onKeyDown={handleKeyDown}
				fullWidth
				InputProps={{
					startAdornment: (
						<Stack direction="row" spacing={1} alignItems="center" sx={{mr: 2}}>
							<IconButton edge="start" onClick={enableSearch ? toggleOpen : undefined}>
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
									onClick={enableSearch ? setOpen : undefined}
								/>
							)}
							{hasActiveFilter && onClear && (
								<IconButton onClick={onClear} title={labels("reset")}>
									<Clear />
								</IconButton>
							)}
							<IconButton onClick={enableSearch ? toggleOpen : undefined} edge="end">
								{open ? <ExpandLess /> : <ExpandMore />}
							</IconButton>
						</Stack>
					),
					readOnly: !enableSearch,
					placeholder: enableSearch ? labels("search") : undefined,
				}}
			/>
			{children && (
				<Collapse in={open} mountOnEnter unmountOnExit>
					{paper
						? (
							<Paper elevation={2}>
								{children}
							</Paper>
						)
						: children}
				</Collapse>
			)}
		</Box>
	);
}
