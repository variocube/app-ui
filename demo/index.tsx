import {
	Article,
	AspectRatio,
	CalendarMonth,
	DynamicForm,
	Edit,
	Error,
	FilterList,
	Help,
	Language,
	ListAlt,
	Palette,
	Psychology,
	SvgIconComponent,
	Tab,
	ViewList,
	Widgets,
} from "@mui/icons-material";
import AlertIcon from "@mui/icons-material/NotificationImportant";
import {
	Box,
	Button,
	Container,
	DialogContent,
	Grid,
	Link as MuiLink,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {useLocation} from "react-router";
import {BrowserRouter, Link, Outlet, Route, Routes} from "react-router-dom";
import {
	AppShell,
	AuditIcon,
	Branding,
	ContainerLayout,
	ContainerSettingsContextProvider,
	ContainerWidthControl,
	HelpButton,
	HelpSettingsContextProvider,
	NotFound,
	PageTitle,
	render,
	UserNav,
	VCThemeProvider,
} from "../src";
import {AuditDemo} from "./audit";
import {BrandingProvider} from "./branding";
import {ConfirmDemo} from "./confirm";
import {ContentTableDemo} from "./content-table";
import {CubeDemo} from "./cube";
import {DataTableDemo} from "./data-table";
import {Pickers} from "./date-pickers";
import {ErrorAlertDemo} from "./error-alert/ErrorAlertDemo";
import {ErrorBoundaryDemo} from "./error-boundary";
import {FilterDemoPage} from "./filter";
import {Forms} from "./forms";
import {Inputs} from "./inputs";
import {ListDemo} from "./list/ListDemo";
import {Localization} from "./localization";
import {TabsDemo} from "./tabs";
import {Theme} from "./theme";
import {ViewDemoPage} from "./view";

declare const VERSION: string;

const rootPath = location.hostname == "variocube.github.io" ? "/app-ui" : "/";

function Demo() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={rootPath} element={<App />}>
					<Route index element={<Start />} />
					<Route path="theme" element={<Theme />} />
					<Route path="localization" element={<Localization />} />
					<Route path="date-pickers" element={<Pickers />} />
					<Route path="content-table" element={<ContentTableDemo />} />
					<Route path="data-table" element={<DataTableDemo />} />
					<Route path="inputs" element={<Inputs />} />
					<Route path="list" element={<ListDemo />} />
					<Route path="forms" element={<Forms />} />
					<Route path="error" element={<ErrorBoundaryDemo />} />
					<Route path="error-alert" element={<ErrorAlertDemo />} />
					<Route path="tabs" element={<TabsDemo />} />
					<Route path="container" element={<ContainerDemo />} />
					<Route path="help" element={<HelpDemo />} />
					<Route path="confirm" element={<ConfirmDemo />} />
					<Route path="audit" element={<AuditDemo />} />
					<Route
						path="not-found"
						element={
							<NotFound
								errorMsg="404: Not Found"
								backToHomeMsg="Back to Home"
								pathMsg="We could not find the following path: "
							/>
						}
					/>
					<Route path="cube" element={<CubeDemo />} />
					<Route path="filter" element={<FilterDemoPage />} />
					<Route path="view" element={<ViewDemoPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

function App() {
	const [branding, setBranding] = useState<Branding>();

	return (
		<BrandingProvider value={setBranding}>
			<VCThemeProvider branding={branding}>
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
		</BrandingProvider>
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
	{text: "Theme", to: `theme`, icon: Palette},
	{text: "Localization", to: "localization", icon: Language},
	{text: "Date & time pickers", to: "date-pickers", icon: CalendarMonth},
	{text: "Content table", to: "content-table", icon: ViewList},
	{text: "Data table", to: "data-table", icon: ViewList},
	{text: "Forms", to: "forms", icon: DynamicForm},
	{text: "Inputs", to: "inputs", icon: Edit},
	{text: "List", to: "list", icon: ListAlt},
	{text: "Error", to: "error", icon: Error},
	{text: "Error Alert", to: "error-alert", icon: AlertIcon},
	{text: "Container", to: "container", icon: AspectRatio},
	{text: "Tabs", to: "tabs", icon: Tab},
	{text: "Help", to: "help", icon: Help},
	{text: "Confirm", to: "confirm", icon: Psychology},
	{text: "Audit", to: "audit", icon: AuditIcon},
	{text: "Not found", to: "not-found", icon: Error},
	{text: "Cube", to: "cube", icon: Widgets},
	{text: "Filter", to: "filter", icon: FilterList},
	{text: "View", to: "view", icon: Article},
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
			<PageTitle title="Welcome" gutterBottom />
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
							<PageTitle title="Container with a Paper" gutterBottom />
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
	const localStorageVar = "appUiLastSeenVersion";
	const changeLogUrl = "https://docs.variocube.com/logistics/Logistics_Changelog";
	const dialogTitle = "New Version";

	const dialogContent: React.ReactNode = (
		<DialogContent>
			<Typography>
				{`This is a newer Version of the application (${VERSION}). The last version you used was ${
					localStorage.getItem(localStorageVar)
				}.`}
			</Typography>
			<Typography>
				Please go to the <MuiLink href={changeLogUrl} target="_blank">Change Log Page</MuiLink>{" "}
				to see the latest updates.
			</Typography>
		</DialogContent>
	);

	return (
		<ContainerSettingsContextProvider>
			<HelpSettingsContextProvider
				baseUrl="https://docs.variocube.com/safecube/"
				apiUrl="https://docs.variocube.com/variocube/safecube/admin/api.php"
				localStorageVar={localStorageVar}
				currentVersion={VERSION}
				dialogTitle={dialogTitle}
				dialogContent={dialogContent}
				changeLogUrl={changeLogUrl}
			>
				<ContainerLayout>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Paper>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<PageTitle title="Help Demo" gutterBottom />
									</Grid>
									<Grid item xs={12}>
										<Typography variant="body1">
											Translation_Test#Heading, en language
											<HelpButton
												helpPage="Translation_Test"
												helpAnchor={"Heading_Safecube_Changed"}
												language={""}
												showEmpty={true}
											/>
										</Typography>
										<Typography variant="body1">
											Standort_Anlegen#Standort_Aktivieren, de language
											<HelpButton
												helpPage="Create_Site"
												helpAnchor={"Standort_aktivieren"}
												language={"de"}
												showEmpty={true}
											/>
										</Typography>
										<Typography variant="body1">
											Standort_Anlegen#Standort_Typ, en language
											<HelpButton
												helpPage="Create_Site"
												helpAnchor={"Standort_Typ"}
												showEmpty={true}
												language={""}
											/>
										</Typography>
										<Typography variant="body1">
											Test Delivery_Create#Manual_handover_required, empty language
											<HelpButton
												helpPage="Delivery_Create"
												helpAnchor={"Manual_Handover_Required"}
												language={""}
											/>
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
