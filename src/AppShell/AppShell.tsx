import {AppBar, Box, Breakpoint, Drawer, IconButton, useMediaQuery, useTheme} from "@mui/material";
import React, {PropsWithChildren, ReactNode, useEffect} from "react";
import {MenuIcon} from "../icons";
import {LayoutProvider} from "../layout";
import {VCAppLogo} from "../logo/VCAppLogo";
import {useFlag} from "../utils";

interface AppShellProps {
	appName: string;
	sideNav?: JSX.Element | null | undefined;
	sideNavWidth?: number;
	sideNavFixed?: Breakpoint;
	topNav?: JSX.Element | null | undefined;
	footer?: JSX.Element | null | undefined;
	/**
	 * Shown in the top bar instead of the Variocube logo and the app name, in the same place. The caller sizes it.
	 */
	logo?: ReactNode;
	/**
	 * The background of the top bar, a palette path such as `background.default` or a CSS colour, applied opaque.
	 * Default: the theme's `background.paper`.
	 */
	barBackground?: string;
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
		logo,
		barBackground,
	} = props;

	const [drawerOpen, setDrawerOpen, clearDrawerOpen, toggleDrawerOpen] = useFlag(false);

	const theme = useTheme();

	const drawerPermanent = useMediaQuery(theme.breakpoints.up(sideNavFixed));
	// The logo's place: in the flow beside a permanent drawer, else centred over the bar.
	const logoPositionSx = {
		py: 1,
		...(!drawerPermanent && {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
		}),
	} as const;
	useEffect(() => {
		if (drawerPermanent) {
			setDrawerOpen();
		}
	}, [drawerPermanent]);

	return (
		<LayoutProvider appName={appName}>
			<Box
				sx={{
					display: "flex",
					flexFlow: "column nowrap",
					"@media screen": {
						height: "100vh",
						overflowY: "scroll",
					},
					"@media print": {
						padding: 0,
						margin: 0,
					},
				}}
			>
				<AppBar
					elevation={0}
					position="static"
					color="inherit"
					sx={{
						borderBottom: 1,
						borderColor: "divider",
						// What the bar shows without `barBackground`: the Paper's default (`color="inherit"` sets none).
						backgroundColor: barBackground ?? "background.paper",
						color: "text.primary",
						displayPrint: "none",
					}}
				>
					<Box
						sx={{
							position: "relative",
							display: "flex",
							flexFlow: "row nowrap",
							justifyContent: "space-between",
							alignItems: "center",
							px: 2,
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
								<MenuIcon />
							</IconButton>
						)}
						{logo !== undefined && logo !== null
							? <Box sx={logoPositionSx}>{logo}</Box>
							: <VCAppLogo appName={drawerPermanent ? appName : undefined} sx={logoPositionSx} />}
						{topNav}
						{!topNav && <Box />}
					</Box>
				</AppBar>
				<Box
					sx={{
						flex: "1 1 auto",
						display: "flex",
						flexFlow: "row nowrap",
					}}
				>
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
									boxSizing: "border-box",
								},
								["& .MuiPaper-elevation0"]: {
									// what a permanent drawer (elevation 0) shows: the Paper's default
									backgroundColor: "background.paper",
								},
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
					<Box
						sx={{
							py: 4,
							flex: 1,
							maxWidth: "100%",
							"@media print": {padding: 0, margin: 0},
						}}
					>
						{children}
					</Box>
				</Box>
				{footer && (
					<Box
						sx={{
							borderTop: 1,
							borderColor: "divider",
							backgroundColor: theme.palette.background.paper,
							color: "text.primary",
							displayPrint: "none",
						}}
					>
						{footer}
					</Box>
				)}
			</Box>
		</LayoutProvider>
	);
}
