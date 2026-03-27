import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack} from "@mui/material";
import MuiTab, {TabProps as MuiTabProps} from "@mui/material/Tab";
import MuiTabs, {TabsProps as MuiTabsProps} from "@mui/material/Tabs";
import React, {Fragment, SyntheticEvent, useCallback, useEffect, useRef, useState} from "react";

interface TabProps extends MuiTabProps<React.ElementType> {
}

interface TabsProps extends MuiTabsProps {
	items: TabProps[];
}

const hiddenSx = {
	visibility: "hidden",
	height: 0,
	maxHeight: "unset",
	minHeight: "unset",
	padding: 0,
};

export function Tabs(props: TabsProps) {
	const {
		orientation = "horizontal",
		scrollButtons = "auto",
		allowScrollButtonsMobile = true,
		sx,
		onChange,
		items: inItems,
		value,
		...rest
	} = props;

	const items = inItems.map((item, i) => ({
		...item,
		value: typeof item.value == "undefined" ? i : item.value,
	} as TabProps));

	const ref = useRef<HTMLDivElement>(null);
	const overflowButtonRef = useRef<HTMLButtonElement>(null);
	const [dropdownEl, setDropdownEl] = useState<null | HTMLElement>(null);

	const [overflowIndex, setOverflowIndex] = useState<number>(items.length);

	const selectedIndex = items.findIndex((item) => item.value == value);

	// Store measured tab widths from when all tabs are visible.
	// Uses a ref so the ResizeObserver callback always sees the latest values.
	const tabWidthsRef = useRef<number[]>([]);

	const computeOverflow = useCallback(() => {
		if (!ref.current) return;

		const root = Array.from(ref.current.children).find(e => e.className.includes("tabRoot")) as
			| HTMLElement
			| undefined;
		if (!root) return;

		const list = Array.from(root.children).find(e => e.className.includes("tabList")) as HTMLElement | undefined;
		if (!list) return;

		// Measure tab widths from visible tabs and cache them.
		// Hidden tabs (display: none) have 0 width, so we skip them and keep cached values.
		const children = Array.from(list.children) as HTMLElement[];
		let hasAllWidths = true;
		for (let i = 0; i < children.length; i++) {
			const w = children[i].getBoundingClientRect().width;
			if (w > 0) {
				tabWidthsRef.current[i] = w;
			}
			else if (!tabWidthsRef.current[i]) {
				hasAllWidths = false;
			}
		}

		const widths = tabWidthsRef.current;

		// If we don't have widths for all tabs yet (e.g. some were hidden before measurement),
		// we can't make a correct decision. Show all tabs to allow measurement on next frame.
		if (!hasAllWidths || widths.length < children.length) {
			setOverflowIndex(children.length);
			return;
		}

		const totalTabWidth = widths.reduce((sum, w) => sum + w, 0);

		// Get the full available width from the parent Stack.
		// When the overflow button is shown, the MuiTabs (flex: 1) shrinks to accommodate it.
		// We need the Stack width to know the total available space.
		const stack = root.closest(".MuiStack-root") as HTMLElement | undefined;
		const fullWidth = stack ? stack.clientWidth : root.clientWidth;

		// Two-pass approach:
		// 1. If all tabs fit in the full available width, no overflow needed
		if (totalTabWidth <= fullWidth) {
			setOverflowIndex(children.length);
			return;
		}

		// 2. Some tabs don't fit — reserve space for the overflow button and calculate
		const overflowButtonWidth = overflowButtonRef.current
			? overflowButtonRef.current.getBoundingClientRect().width + 8 // 8px for ml:1 margin
			: 48; // fallback estimate
		const availableWidth = fullWidth - overflowButtonWidth;

		let newOverflowIndex = 0;
		let usedWidth = 0;
		for (let i = 0; i < widths.length; i++) {
			usedWidth += widths[i];
			if (usedWidth <= availableWidth) {
				newOverflowIndex++;
			}
			else {
				break;
			}
		}
		// Ensure at least one tab is visible
		setOverflowIndex(Math.max(1, newOverflowIndex));
	}, []);

	useEffect(() => {
		if (!ref.current) return;

		const root = Array.from(ref.current.children).find(e => e.className.includes("tabRoot")) as
			| HTMLElement
			| undefined;
		if (!root) return;

		const resizeObserver = new ResizeObserver(() => computeOverflow());
		resizeObserver.observe(root);
		return () => resizeObserver.disconnect();
	}, [computeOverflow]);

	// Recompute when items change (e.g., conditional tabs added/removed)
	useEffect(() => {
		// Reset cached widths when item count changes so stale entries are cleared
		tabWidthsRef.current = [];
		computeOverflow();
	}, [inItems.length, computeOverflow]);

	return (
		<Stack
			flex={1}
			direction="row"
			alignItems="center"
			sx={{
				borderBottom: 1,
				borderColor: "divider",
			}}
		>
			<MuiTabs
				ref={ref}
				orientation="horizontal"
				visibleScrollbar={false}
				scrollButtons={false}
				allowScrollButtonsMobile={false}
				sx={{
					...sx,
					flex: 1,
				}}
				classes={{
					scroller: "tabRoot",
					flexContainer: "tabList",
				}}
				value={value}
				onChange={onChange}
				{...rest}
			>
				{items
					.map((tabProps, i) => (
						<MuiTab
							key={"muiTab-" + i}
							iconPosition="start"
							{...tabProps}
							sx={{
								...tabProps.sx,
								...(i >= overflowIndex ? {display: "none"} : undefined),
								minHeight: 48,
							}}
						/>
					))}
			</MuiTabs>
			{(overflowIndex < items.length) && (
				<Fragment>
					<IconButton
						ref={overflowButtonRef}
						sx={{
							ml: 1,
						}}
						onClick={ev => setDropdownEl(ev.currentTarget)}
						color={selectedIndex >= overflowIndex ? "primary" : "default"}
					>
						<MoreHorizIcon fontSize="inherit" />
					</IconButton>
					<Menu
						anchorEl={dropdownEl}
						open={!!dropdownEl}
						onClose={() => setDropdownEl(null)}
					>
						{items
							.map((tabProps, i) => {
								const {
									label,
									icon,
									onClick,
									component,
									value: itemValue,
									...rest
								} = tabProps;

								const selected = value == itemValue;

								function handleClick(ev: SyntheticEvent) {
									if (!selected && onChange) {
										onChange(ev, itemValue);
									}
									if (onClick) {
										onClick(ev);
									}
									setDropdownEl(null);
								}

								return (
									<MenuItem
										key={"dropdownItem-" + i}
										onClick={handleClick}
										component={component ?? "li"}
										sx={i < overflowIndex ? hiddenSx : {}}
										selected={selected}
										{...rest}
									>
										{icon && <ListItemIcon>{icon}</ListItemIcon>}
										<ListItemText>{label}</ListItemText>
									</MenuItem>
								);
							})}
					</Menu>
				</Fragment>
			)}
		</Stack>
	);
}
