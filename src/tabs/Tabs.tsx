import MuiTabs, {TabsProps} from "@mui/material/Tabs";
import React, {
    Fragment,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import {Box, IconButton, Menu, MenuItem} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


interface TabItem {
    element: Element;
    width: number;
}

export function Tabs(props: TabsProps) {
    const {
        orientation = "horizontal",
        scrollButtons = "auto",
        allowScrollButtonsMobile = true,
        sx,
        onChange,
        ...rest
    } = props;

    const ref = useRef(null);
    const [dropdownEl, setDropdownEl] = useState<null|HTMLElement>(null);

    const [items, setItems] = useState<TabItem[]>([]);
    const [hideIndexes, setHideIndexes] = useState<number[]>([]);

    function handleTabOverflow(root: Element, items: TabItem[]) {
        // clientWidth: what the user can see
        // scrollWidth: actual size of the DOM object
        const {clientWidth} = root;
        console.log('detected tabs width changed', clientWidth);

        // this basically loop through each item size and adding up the width of all items
        // if the width exceed the clientWidth of the root node, item will be hidden from the horizontal tab display
        // else the item remains visible and its ref from the dropdown list will be hidden otherwise
        const hideIndexes: number[] = [];
        let itemsWidth = 0;
        for (let i = 0; i < items.length; i++) {
            itemsWidth += items[i].width;
            if (itemsWidth >= clientWidth) {
                items[i].element.setAttribute('style', 'display: none');
            } else {
                hideIndexes.push(i);
                items[i].element.removeAttribute('style');
            }
        }
        setHideIndexes(hideIndexes);
        console.log('items hidden:', items.length - hideIndexes.length);
    }

    useEffect(() => {
        if (orientation === 'horizontal' && ref.current) {
            // fetch the root node of tabs
            const root = Array.from((ref.current as HTMLButtonElement).children).find(e => e.className.includes('tabRoot'));
            if (root) {
                // from the root node, traverse down to list node of tab items
                const list = Array.from(root.children).find(e => e.className.includes('tabList'));
                const items = list ? Array.from(list.children).map(element => ({ element, width: element.clientWidth })) : [];
                setItems(items);

                // apply the resize observer to the root node and watch for the size changes
                const resizeObserver = new ResizeObserver(() => handleTabOverflow(root, items));
                resizeObserver.observe(root);
                return () => resizeObserver.disconnect();
            }
        }
    }, [ref, orientation])


    function handleOverflowTabChange(ev: SyntheticEvent, index: number) {
        if (items[index]) {
            (items[index].element as HTMLButtonElement|HTMLAnchorElement).click();
        }
    }

    function renderMuiTabs() {
        return (
            <MuiTabs
                ref={ref}
                orientation={orientation}
                visibleScrollbar={false}
                scrollButtons={false}
                allowScrollButtonsMobile={false}
                sx={{
                    ...sx,
                    flex: orientation == "vertical" ? undefined : 1,
                    borderRight: orientation == "vertical" ? 1 : 0,
                    borderBottom: orientation == "horizontal" ? 1 : 0,
                    borderColor: "divider"
                }}
                classes={{
                    scroller: 'tabRoot',
                    flexContainer: 'tabList'
                }}
                onChange={onChange}
                {...rest}
            />
        );
    }

    if (orientation === 'vertical') return renderMuiTabs();

    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            {renderMuiTabs()}
            {(hideIndexes.length < items.length) && (
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
                            .map((tab, i) => {
                            const {element: { textContent }} = tab;
                            return (
                                <MenuItem
                                    key={'tab-' + i}
                                    onClick={ev => handleOverflowTabChange(ev, i)}
                                    sx={{
                                        display: hideIndexes.includes(i) ? 'none' : undefined
                                    }}
                                >
                                    {textContent}
                                </MenuItem>
                            )
                        })}
                    </Menu>
                </Fragment>
            )}

        </Box>
    );
}