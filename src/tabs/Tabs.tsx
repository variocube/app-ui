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

interface Props extends TabsProps {
    overflow?: boolean
}
export function Tabs(props: Props) {
    const {
        orientation = "horizontal",
        scrollButtons = "auto",
        allowScrollButtonsMobile = true,
        sx,
        overflow = false,
        onChange,
        ...rest
    } = props;


    const ref = useRef(null);
    const [dropdownEl, setDropdownEl] = useState<null|HTMLElement>(null);

    const [items, setItems] = useState<Element[]>([]);
    const [hideIndexes, setHideIndexes] = useState<number[]>([]);

    useEffect(() => {
        if (overflow && ref.current) {
            const root = Array.from((ref.current as HTMLButtonElement).children).find(e => e.className.includes('tabRoot'));
            if (root) {
                const list = Array.from(root.children).find(e => e.className.includes('tabList'));
                const items = list ? Array.from(list.children) : [];
                setItems(items);

                const resizeObserver = new ResizeObserver(() => handleTabOverflow(root, items));
                resizeObserver.observe(root);
                return () => resizeObserver.disconnect();
            }
        }
    }, [ref, overflow])

    function handleTabOverflow(root: Element, items: Element[]) {
        const {clientWidth, scrollWidth} = root;
        if (clientWidth <= scrollWidth) {
            const hideIndexes: number[] = [];
            let itemWidth = 0;
            for (let i = 0; i < items.length; i++) {
                itemWidth += items[i].clientWidth;
                if (itemWidth >= clientWidth) {
                    items[i].setAttribute('style', 'display: none');
                } else {
                    hideIndexes.push(i);
                    items[i].removeAttribute('style');
                }
            }
            setHideIndexes(hideIndexes);
        }
    }

    // TODO: support component tab item, such as a link or react router link
    function handleOverflowTabChange(ev: SyntheticEvent, index: number) {
        if (onChange) onChange(ev, index);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <MuiTabs
                ref={ref}
                orientation={orientation}
                scrollButtons={scrollButtons}
                allowScrollButtonsMobile={allowScrollButtonsMobile}
                sx={{
                    ...sx,
                    flex: '1',
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
            {(orientation === 'horizontal' && hideIndexes.length < items.length) && (
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
                            const {textContent} = tab;
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