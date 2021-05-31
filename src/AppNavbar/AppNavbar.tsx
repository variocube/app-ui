import React, {Fragment, useMemo, useState} from "react";
import {
    AppBar,
    Box, createStyles,
    Drawer,
    IconButton,
    List,
    ListItem,
    makeStyles, Theme,
    Toolbar, Typography,
} from "@material-ui/core";
import {MenuIcon} from "../icons";

const useStyles = makeStyles((theme: Theme) => createStyles({
    appBar: {
        zIndex: 1000,
        backgroundColor: '#ffffff'
    },
    drawerPaper: {
        width: 280
    },
    navLogo: {
        display: 'flex',
        alignItems: 'center',
        '& > img': {
            minWidth: 150,
            maxHeight: '50px !important'
        }
    },
    navMenu: {
        display: 'flex',
        flexDirection: 'row'
    },
    navMenuItem: {
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        color: '#777'
    },
    navMenuActive: {
        color: theme.palette.primary.main
    }
}));

export type NavItem = { title: string, active?: boolean, prioritised?: boolean, onClick?: () => void };

type AppNavbarProps = {
    navItems: NavItem[],
    appName?: string,
    logoPath?: string
}

export const AppNavbar = ({navItems, appName, logoPath}: AppNavbarProps) => {
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
                        <IconButton
                            edge="start"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        {logoPath && (
                            <a href="/" className={classes.navLogo}>
                                <img src={logoPath} alt="App" />
                            </a>
                        )}
                        <Box mx={1}/>
                        {appName && (
                            <Typography variant="h6" color="textPrimary"><strong>{appName}</strong></Typography>
                        )}
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
                {logoPath && (
                    <Box p={1} my={1} className={classes.navLogo}>
                        <img src={logoPath} alt="App" />
                    </Box>
                )}
                <List>
                    {navItems.map((item, index) => (
                        <AppNavItem key={'drawer-nav-item-' + index}
                                 isActive={item.active === true}
                                 title={item.title}
                                 onClick={() => handleDrawerMenuClick(item)}
                        />
                    ))}
                </List>
            </Drawer>
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
        <ListItem button className={className} onClick={onClick}>
            {title}
        </ListItem>
    )
}