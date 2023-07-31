import React, {
    Fragment, SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import {Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack} from "@mui/material";
import MuiTabs, {TabsProps as MuiTabsProps} from "@mui/material/Tabs";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MuiTab, {TabProps as MuiTabProps} from "@mui/material/Tab";

interface TabItem {
    index: number;
    width: number;
}

interface TabProps extends MuiTabProps<React.ElementType> {
}

interface TabsProps extends MuiTabsProps {
    items: TabProps [];
}

const hiddenSx = {
    visibility: 'hidden',
    height: 0,
    maxHeight: 'unset',
    minHeight: 'unset',
    padding: 0
}

export function Tabs(props: TabsProps) {
    const {
        orientation = "horizontal",
        scrollButtons = "auto",
        allowScrollButtonsMobile = true,
        sx,
        onChange,
        items,
        ...rest
    } = props;

    const ref = useRef(null);
    const [dropdownEl, setDropdownEl] = useState<null|HTMLElement>(null);

    const [tabItems, setTabItems] = useState<TabItem[]>([]);
    const [hideIndexes, setHideIndexes] = useState<number[]|null>(null);

    function handleTabOverflow(root: Element, items: TabItem[]) {
        // clientWidth: what the user can see
        // scrollWidth: actual size of the DOM object
        const {clientWidth} = root;
        // console.log('detected tabs width changed', clientWidth);

        // this basically loop through each item size and adding up the width of all items
        // if the width exceed the clientWidth of the root node, item will be hidden from the horizontal tab display
        // else the item remains visible and its ref from the dropdown list will be hidden otherwise
        const hideIndexes: number[] = [];
        let itemsWidth = 0;
        for (let i = 0; i < items.length; i++) {
            itemsWidth += items[i].width;
            if (itemsWidth < clientWidth) {
                hideIndexes.push(i);
            }
        }
        setHideIndexes(hideIndexes);
        // console.log('items hidden:', items.length - hideIndexes.length);
    }

    useEffect(() => {
        if (ref.current) {
            // fetch the root node of tabs
            const root = Array.from((ref.current as HTMLButtonElement).children).find(e => e.className.includes('tabRoot'));
            if (root) {
                // from the root node, traverse down to list node of tab items
                const list = Array.from(root.children).find(e => e.className.includes('tabList'));
                const items = list ? Array.from(list.children).map((e, index) => ({ index, width: e.clientWidth })) : [];
                setTabItems(items);

                // apply the resize observer to the root node and watch for the size changes
                const resizeObserver = new ResizeObserver(() => handleTabOverflow(root, items));
                resizeObserver.observe(root);
                return () => resizeObserver.disconnect();
            }
        }
    }, [ref])

    return (
        <Stack
            flex={1}
            direction="row"
            alignItems="center"
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
                    borderBottom: 1,
                    borderColor: "divider"
                }}
                classes={{
                    scroller: 'tabRoot',
                    flexContainer: 'tabList'
                }}
                onChange={onChange}
                {...rest}
            >
                {items
                    .filter((tabProps, i) => !hideIndexes || hideIndexes.includes(i))
                    .map((tabProps, i) => (
                        <MuiTab
                            key={'muiTab-' + i}
                            iconPosition="start"
                            {...tabProps}
                        />
                    ))}
            </MuiTabs>
            {(hideIndexes && hideIndexes.length < items.length) && (
                <Fragment>
                    <IconButton
                        sx={{
                            ml: 1
                        }}
                        onClick={ev => setDropdownEl(ev.currentTarget)}
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
                                    ...rest
                                } = tabProps;
                                let handleClick = onClick;
                                if (!component && onChange) {
                                    handleClick = (ev: SyntheticEvent) => {
                                        console.log('change', i);
                                        onChange(ev, i)
                                    };
                                }
                                return (
                                    <MenuItem
                                        key={'dropdownItem-' + i}
                                        onClick={handleClick}
                                        component={component}
                                        sx={(hideIndexes && !hideIndexes.includes(i)) ? {} : hiddenSx}
                                        {...rest}
                                    >
                                        {icon && <ListItemIcon>{icon}</ListItemIcon>}
                                        <ListItemText>{label}</ListItemText>
                                    </MenuItem>
                                )
                            })}
                    </Menu>
                </Fragment>
            )}
        </Stack>
    );
}