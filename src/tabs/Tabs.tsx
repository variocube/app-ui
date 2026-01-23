import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack} from "@mui/material";
import MuiTab, {TabProps as MuiTabProps} from "@mui/material/Tab";
import MuiTabs, {TabsProps as MuiTabsProps} from "@mui/material/Tabs";
import React, {Fragment, SyntheticEvent, useEffect, useRef, useState} from "react";

interface TabItem {
	index: number;
	width: number;
}

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

	const ref = useRef(null);
	const [dropdownEl, setDropdownEl] = useState<null | HTMLElement>(null);

	const [overflowIndex, setOverflowIndex] = useState<number>(items.length);

	const selectedIndex = items.findIndex((item) => item.value == value);

	function handleTabOverflow(root: Element, items: TabItem[]) {
		// clientWidth: what the user can see
		// scrollWidth: actual size of the DOM object
		const {clientWidth} = root;

		// this basically loop through each item size and adding up the width of all items
		// if the width exceed the clientWidth of the root node, item will be hidden from the horizontal tab display
		// else the item remains visible and its ref from the dropdown list will be hidden otherwise
		let overflowIndex = 0;
		let itemsWidth = 0;
		for (let i = 0; i < items.length; i++) {
			itemsWidth += items[i].width;
			if (itemsWidth < clientWidth) {
				overflowIndex++;
			}
		}
		setOverflowIndex(overflowIndex);
	}

	useEffect(() => {
		if (ref.current) {
			// fetch the root node of tabs
			const root = Array.from((ref.current as HTMLButtonElement).children).find(e =>
				e.className.includes("tabRoot")
			);
			if (root) {
				// from the root node, traverse down to list node of tab items
				const list = Array.from(root.children).find(e => e.className.includes("tabList"));
				const items = list ? Array.from(list.children).map((e, index) => ({index, width: e.clientWidth})) : [];

				// apply the resize observer to the root node and watch for the size changes
				const resizeObserver = new ResizeObserver(() => handleTabOverflow(root, items));
				resizeObserver.observe(root);
				return () => resizeObserver.disconnect();
			}
		}
	}, [ref]);

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
