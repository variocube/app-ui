import {
	AspectRatio,
	CalendarMonth,
	DynamicForm,
	Edit,
	Error,
	Help,
	Language,
	Palette,
	Psychology,
	SvgIconComponent,
	Tab,
	ViewList,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Container,
	Grid,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";
import * as React from "react";
import {useLocation} from "react-router";
import {BrowserRouter, Link, Outlet, Route, Routes} from "react-router-dom";
import {
	AppShell,
	ContainerLayout,
	ContainerSettingsContextProvider,
	ContainerWidthControl,
	HelpButton,
	HelpSettingsContextProvider,
	render,
	UserNav,
	VCThemeProvider,
} from "../src";
import {ConfirmDemo} from "./confirm";
import {ContentTableDemo} from "./content-table";
import {DataTableDemo} from "./data-table";
import {Pickers} from "./date-pickers";
import {DemoError} from "./error";
import {Forms} from "./forms";
import {Inputs} from "./inputs";
import {Localization} from "./localization";
import {TabsDemo} from "./tabs";
import {Theme} from "./theme";

function Demo() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />}>
					<Route index element={<Start />} />
					<Route path="theme" element={<Theme />} />
					<Route path="localization" element={<Localization />} />
					<Route path="date-pickers" element={<Pickers />} />
					<Route path="content-table" element={<ContentTableDemo />} />
					<Route path="data-table" element={<DataTableDemo />} />
					<Route path="inputs" element={<Inputs />} />
					<Route path="forms" element={<Forms />} />
					<Route path="error" element={<DemoError />} />
					<Route path="tabs" element={<TabsDemo />} />
					<Route path="container" element={<ContainerDemo />} />
					<Route path="help" element={<HelpDemo />} />
					<Route path="confirm" element={<ConfirmDemo />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

function App() {
	return (
		<VCThemeProvider>
			<AppShell
				appName={"UI docs"}
				sideNav={<SideNav />}
				topNav={<TopNav />}
				sideNavWidth={240}
				footer={<Footer />}
			>
				<Outlet />
			</AppShell>
		</VCThemeProvider>
	);
}

function TopNav() {
	return (
		<UserNav
			onSettingClick={() => {}}
			onChangePasswordClick={() => {}}
			onLogoutClick={() => {}}
			showDarkModeSwitch
			i18n={{
				settings: "Einstellungen",
			}}
		/>
	);
}

function Footer() {
	return (
		<Box sx={{px: 1, py: 0.5}}>
			<Typography variant="overline" color="textSecondary">© Variocube GmbH</Typography>
		</Box>
	);
}

function SideNav() {
	return (
		<List>
			{MenuItems.map(props => <SideNavListItem key={props.text} {...props} />)}
		</List>
	);
}

interface MenuItemProps {
	to: string;
	text: string;
	icon: SvgIconComponent;
}

const MenuItems: MenuItemProps[] = [
	{text: "Theme", to: "/theme", icon: Palette},
	{text: "Localization", to: "/localization", icon: Language},
	{text: "Date & time pickers", to: "/date-pickers", icon: CalendarMonth},
	{text: "Content table", to: "/content-table", icon: ViewList},
	{text: "Data table", to: "/data-table", icon: ViewList},
	{text: "Forms", to: "/forms", icon: DynamicForm},
	{text: "Inputs", to: "/inputs", icon: Edit},
	{text: "Error", to: "/error", icon: Error},
	{text: "Container", to: "/container", icon: AspectRatio},
	{text: "Tabs", to: "/tabs", icon: Tab},
	{text: "Help", to: "/help", icon: Help},
	{text: "Confirm", to: "/confirm", icon: Psychology},
];

function SideNavListItem({icon: Icon, text, to}: MenuItemProps) {
	const location = useLocation();
	const selected = location.pathname.startsWith(to);
	return (
		<ListItemButton component={Link} to={to} selected={selected}>
			<ListItemIcon>
				<Icon />
			</ListItemIcon>
			<ListItemText primary={text} />
		</ListItemButton>
	);
}

function Start() {
	return (
		<Container>
			<Typography variant="h1" gutterBottom>Welcome</Typography>
			<Typography variant="body1" gutterBottom>
				This library provides common components for Variocube applications.
			</Typography>
			<Box my={2}>
				<Grid container spacing={2}>
					{MenuItems.map(props => <MenuCardItem key={props.text} {...props} />)}
				</Grid>
			</Box>
		</Container>
	);
}

function MenuCardItem({icon: Icon, text, to}: MenuItemProps) {
	return (
		<Grid item xs={6} md={4} lg={3}>
			<Button
				color="secondary"
				variant="outlined"
				component={Link}
				to={to}
				size="large"
				fullWidth
				sx={{flexFlow: "column", textAlign: "center"}}
			>
				<Icon fontSize="large" sx={{my: 1}} />
				{text}
			</Button>
		</Grid>
	);
}

function ContainerDemo() {
	return (
		<ContainerSettingsContextProvider>
			<ContainerLayout>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Paper>
							<Typography variant="h1" gutterBottom>Container with a Paper</Typography>
						</Paper>
					</Grid>
					<Grid item xs={12}>
						<ContainerWidthControl />
					</Grid>
				</Grid>
			</ContainerLayout>
		</ContainerSettingsContextProvider>
	);
}

function HelpDemo() {
	return (
		<ContainerSettingsContextProvider>
			<HelpSettingsContextProvider baseUrl="https://docs.variocube.com/logistics/">
				<ContainerLayout>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Paper>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Typography variant="h1" gutterBottom>Help Demo</Typography>
									</Grid>
									<Grid item xs={12}>
										<Typography variant="body1">
											Test Tenant_Settings#Sites, empty language
											<HelpButton helpPage="Tenant_Settings" helpAnchor={"Sites"} language={""} />
										</Typography>
										<Typography variant="body1">
											Test Tenant_Settings#Building_Cube_Mappings, de language
											<HelpButton helpPage="Tenant_Settings" helpAnchor={"Building_Cube_Mappings"} language={"de"} />
										</Typography>
										<Typography variant="body1">
											Test Delivery_Create#Manual_handover_required, empty language
											<HelpButton helpPage="Delivery_Create" helpAnchor={"Manual_handover_required"} language={""} />
										</Typography>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
						<Grid item xs={12}>
							<ContainerWidthControl />
						</Grid>
					</Grid>
				</ContainerLayout>
			</HelpSettingsContextProvider>
		</ContainerSettingsContextProvider>
	);
}

render(<Demo />);
