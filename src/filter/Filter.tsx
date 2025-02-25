import {Clear, ExpandLess, ExpandMore, FilterList} from "@mui/icons-material";
import {Box, Chip, Collapse, FormControl, IconButton, InputLabel, Paper, Stack, styled} from "@mui/material";
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
	 * Whether the filter input takes up the full width of the container. This is now always true.
	 * If you need a smaller width, place this control in a smaller container.
	 *
	 * @deprecated This is now ignored and always true. Remove this property.
	 */
	fullWidth?: boolean;

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

export const OutlinedContainer = styled(Box)(({theme}) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(1),
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.divider}`,
}));

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
			<FormControl variant={variant} fullWidth onClick={enableSearch ? undefined : toggleOpen}>
				{label && (
					<InputLabel shrink>
						{label}
					</InputLabel>
				)}

				<OutlinedContainer>
					<Stack
						sx={{
							flexDirection: {
								xs: "column",
								sm: "row",
							},
							alignItems: "center",
							width: "100%",
						}}
						spacing={1}
						useFlexGap
					>
						{children && (
							<IconButton
								onClick={enableSearch ? toggleOpen : undefined}
								sx={{
									display: {
										xs: "none",
										sm: "inline-flex",
									},
								}}
							>
								<FilterList />
							</IconButton>
						)}

						<Stack
							direction="row"
							alignItems="center"
							sx={{
								justifyContent: {
									xs: "center",
									sm: "flex-start",
								},
							}}
							flexWrap="wrap"
							spacing={1}
							useFlexGap
							flex={1}
						>
							{active}
							{enableSearch && (
								<TextField
									value={value}
									onChange={setValue}
									onKeyDown={handleKeyDown}
									variant={"standard"}
									placeholder={enableSearch ? labels("search") : undefined}
								/>
							)}
						</Stack>

						<Stack direction="row" spacing={1} alignItems="center">
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
							{children && (
								<IconButton onClick={enableSearch ? toggleOpen : undefined} edge="end">
									{open ? <ExpandLess /> : <ExpandMore />}
								</IconButton>
							)}
						</Stack>
					</Stack>
				</OutlinedContainer>
			</FormControl>

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
