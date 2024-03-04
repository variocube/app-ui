import {AppBar, Box, Breakpoint, Drawer, IconButton, useMediaQuery, useTheme} from "@mui/material";
import React, {PropsWithChildren, useEffect} from "react";
import {useFlag} from "../utils";
import {MenuIcon} from "../icons";
import {LayoutProvider} from "../layout";
import {VCAppLogo} from "../logo/VCAppLogo";

interface AppShellProps {
    appName: string;
    sideNav?: JSX.Element | null | undefined;
    sideNavWidth?: number;
    sideNavFixed?: Breakpoint;
    topNav?: JSX.Element | null | undefined;
    footer?: JSX.Element | null | undefined;
}

export function AppShell(props: PropsWithChildren<AppShellProps>) {

    const {
        children,
        appName,
        sideNav,
        sideNavWidth = 200,
        topNav,
        sideNavFixed = "md",
        footer,
    } = props;

    const [drawerOpen, setDrawerOpen, clearDrawerOpen, toggleDrawerOpen] = useFlag(false);

    const theme = useTheme();

    const drawerPermanent = useMediaQuery(theme.breakpoints.up(sideNavFixed));
    useEffect(() => {
        if (drawerPermanent) {
            setDrawerOpen();
        }
    }, [drawerPermanent]);

    return (
        <LayoutProvider appName={appName}>
            <Box sx={{
                display: "flex",
                flexFlow: "column nowrap",
                "@media screen": {
                    height: "100vh",
                    overflowY: "scroll"
                },
                "@media print": {
                    padding:0,
                    margin:0
                }
            }}>
                <AppBar
                    elevation={0}
                    position="static"
                    color="inherit"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        backgroundColor: "paper.elevation1",
                        color: "text.primary",
                        displayPrint: "none"
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            flexFlow: "row nowrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 2
                        }}
                    >
                        {!drawerPermanent && (
                            <IconButton
                                edge="start"
                                sx={{marginRight: 1}}
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawerOpen}
                                disabled={!sideNav}
                                size="large"
                            >
                                <MenuIcon/>
                            </IconButton>
                        )}
						<VCAppLogo
							appName={drawerPermanent ? appName : undefined}
							sx={{
								py: 1,
								...(!drawerPermanent && {
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)"
								})
							}}
						/>
                        {topNav}
                        {!topNav && <Box/>}
                    </Box>
                </AppBar>
                <Box sx={{
                    flex: "1 1 auto",
                    display: "flex",
                    flexFlow: "row nowrap",
                }}>
                    {sideNav && (
                        <Drawer
                            variant={!drawerPermanent ? "temporary" : "permanent"}
                            sx={{
                                displayPrint: "none",
                                [`& .MuiDrawer-paper`]: {
                                    position: "relative",
                                    whiteSpace: "nowrap",
                                    overflowX: "hidden",
                                    width: sideNavWidth,
                                    boxSizing: "border-box"
                                },
                                ["& .MuiPaper-elevation0"]: {
                                    backgroundColor: "paper.elevation1"
                                }
                            }}
                            open={drawerOpen}
                            onClick={!drawerPermanent ? clearDrawerOpen : undefined}
                            onClose={clearDrawerOpen}
                        >
                            {!drawerPermanent && (
                                <VCAppLogo
                                    appName={appName}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                    }}
                                />
                            )}
                            {sideNav}
                        </Drawer>
                    )}
                    <Box sx={{
                        py: 4,
                        flex: 1,
                        maxWidth: "100%",
                        "@media print": { padding:0, margin:0 }
                    }}>
                        {children}
                    </Box>
                </Box>
                {footer && (
                    <Box sx={{
                            borderTop: 1,
                            borderColor: "divider",
                            backgroundColor: theme.palette.background.paper,
                            color: "text.primary",
                            displayPrint: "none"
                    }}>
                        {footer}
                    </Box>
                )}
            </Box>
        </LayoutProvider>
    );
}
