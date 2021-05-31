import React, {Fragment, useMemo, useState} from "react";
import {
    AppBar,
    Box, createStyles,
    Drawer,
    IconButton,
    List,
    ListItem,
    makeStyles, Theme,
    Toolbar,
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
        minWidth: 150,
        maxHeight: '50px !important'
    },
    navMenu: {
        display: 'flex',
        flexDirection: 'row'
    },
    navMenuItem: {
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        color: theme.palette.grey["800"]
    },
    navMenuActive: {
        color: theme.palette.primary.main
    }
}));

type AppNavbarProps = {
    navItems: { title: string, active?: boolean, prioritised?: boolean, onClick?: () => void }[],
    logoPath?: string
}

export const AppNavbar = ({navItems, logoPath}: AppNavbarProps) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    const classes = useStyles();
    const container = window !== undefined ? () => window.document.body : undefined;
    return (
        <Fragment>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Box display="flex" flexGrow={1}>
                        <IconButton
                            edge="start"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        {logoPath && (
                            <Box p={1} display="flex" alignContent="center">
                                <img className={classes.navLogo} src={logoPath} alt="App" />
                            </Box>
                        )}
                    </Box>
                    <Box display="flex">
                        <List className={classes.navMenu}>
                            {navItems.filter(i => i.prioritised).map((item, index) => (
                                <NavItem key={'nav-item-' + index}
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
                    <Box p={1} my={1} display="flex" alignContent="center">
                        <img className={classes.navLogo} src={logoPath} alt="App" />
                    </Box>
                )}
                <List>
                    {navItems.map((item, index) => (
                        <NavItem key={'drawer-nav-item-' + index}
                                 isActive={item.active === true}
                                 title={item.title}
                                 onClick={item.onClick}
                        />
                    ))}
                </List>
            </Drawer>
        </Fragment>
    )
}

type NavItemProps = {
    isActive: boolean;
    title: string;
    onClick?: () => void;
}

const NavItem = ({isActive, title, onClick}: NavItemProps) => {
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