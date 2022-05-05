import React, {Fragment, ReactElement, useMemo, useState} from "react";
import {
    alpha,
    AppBar,
    Box,
    Drawer,
    IconButton, Link,
    List,
    ListItem,
    Theme,
    Toolbar, Typography,
} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {MenuIcon} from "../icons";

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        boxShadow: `0 2px 8px ${alpha('#000', 0.15)} !important`,
        backgroundImage: 'none !important',
        backgroundColor: `${theme.palette.mode === 'light' ? '#fff' : theme.palette.background.paper} !important`
    },
    drawerPaper: {
        width: 280
    },
    navLogo: {
        display: 'flex',
        alignItems: 'center',
        '& svg': {
            height: '25px !important'
        }
    },
    navAppTitle: {
        fontSize: '1rem !important',
        lineHeight: '1em !important',
        paddingLeft: 27
    },
    navMenu: {
        display: 'flex',
        flexDirection: 'row',
        [theme.breakpoints.down("sm")]: {
            display: 'none'
        }
    },
    navMenuItem: {
        width: '100%',
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        color: '#777 !important',
        cursor: 'pointer',
        textDecoration: 'none !important',
        '&:hover': {
            color: theme.palette.primary.main + ' !important'
        }
    },
    navMenuActive: {
        color: theme.palette.primary.main
    }
}));

export type NavItem = { title: string, active?: boolean, prioritised?: boolean, onClick?: () => void };

type AppNavbarProps = {
    navItems: NavItem[],
    appName?: string,
    logo?: ReactElement,
    disableDrawer?: boolean,
}

export const AppNavbar = ({navItems, appName, logo, disableDrawer}: AppNavbarProps) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    const handleDrawerMenuClick = (navItem: NavItem) => {
        toggleDrawer();
        if (navItem.onClick) {
            navItem.onClick()
        }
    }

    const classes = useStyles();
    const container = window !== undefined ? () => window.document.body : undefined;
    return (
        <Fragment>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Box display="flex" flexGrow={1} alignItems="center">
                        {!disableDrawer && (
                            <IconButton
                                edge="start"
                                onClick={toggleDrawer}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', px: 2, py: 1.5 }}>
                            {logo && <a href="/" className={classes.navLogo}>{logo}</a>}
                            {appName && <Typography className={classes.navAppTitle} component="h4" color="textPrimary"><strong>{appName}</strong></Typography>}
                        </Box>
                    </Box>
                    <Box display="flex">
                        <List className={classes.navMenu}>
                            {navItems.filter(i => i.prioritised).map((item, index) => (
                                <AppNavItem key={'nav-item-' + index}
                                         isActive={item.active === true}
                                         title={item.title}
                                         onClick={item.onClick}
                                />
                            ))}
                        </List>
                    </Box>
                </Toolbar>
            </AppBar>
            {!disableDrawer && (
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true
                    }}
                >
                    {logo && <Box p={2} className={classes.navLogo}>{logo}</Box>}
                    <List disablePadding>
                        {navItems.map((item, index) => (
                            <AppNavItem key={'drawer-nav-item-' + index}
                                        isActive={item.active === true}
                                        title={item.title}
                                        onClick={() => handleDrawerMenuClick(item)}
                            />
                        ))}
                    </List>
                </Drawer>
            )}
        </Fragment>
    )
}

type AppNavItemProps = {
    isActive: boolean;
    title: string;
    onClick?: () => void;
}

const AppNavItem = ({isActive, title, onClick}: AppNavItemProps) => {
    const classes = useStyles();
    const className = useMemo(() => {
        const cls = [classes.navMenuItem];
        if (isActive) cls.push(classes.navMenuActive);
        return cls.join(' ');
    }, [isActive]);

    return (
        <ListItem>
            <Link className={className} onClick={onClick}>{title}</Link>
        </ListItem>
    )
}