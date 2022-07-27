import * as React from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter, Link, Outlet, Route, Routes} from "react-router-dom";
import {ContentTableDemo} from "./content-table";
import {Localization} from "./localization";
import {Pickers} from "./date-pickers";
import {VCThemeProvider} from "../src";
import {AppShell} from "../src/AppShell";
import {
    Box,
    Button,
    Container,
    Grid, IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import {useLocation} from "react-router";
import {CalendarMonth, Edit, GitHub, Language, Palette, SvgIconComponent, ViewList} from "@mui/icons-material";
import {Inputs} from "./inputs";
import {Theme} from "./theme";

function Demo() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route index element={<Start/>}/>
                    <Route path="theme" element={<Theme/>}/>
                    <Route path="localization" element={<Localization/>}/>
                    <Route path="date-pickers" element={<Pickers/>}/>
                    <Route path="content-table" element={<ContentTableDemo/>}/>
                    <Route path="inputs" element={<Inputs/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

function App() {
    return (
        <VCThemeProvider>
            <AppShell
                appName={"UI docs"}
                sideNav={<SideNav/>}
                topNav={<TopNav/>}
                sideNavWidth={240}
                footer={<Footer/>}
            >
                <Outlet/>
            </AppShell>
        </VCThemeProvider>
    )
}

function TopNav() {
    return (
        <IconButton component="a" href="https://github.com/variocube/app-ui" target="_blank" edge="end">
            <GitHub/>
        </IconButton>
    )
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
            {MenuItems.map(props => (
                <SideNavListItem key={props.text} {...props}/>
            ))}
        </List>
    )
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
    {text: "Inputs", to: "/inputs", icon: Edit},
]

function SideNavListItem({icon: Icon, text, to}: MenuItemProps) {
    const location = useLocation();
    const selected = location.pathname.startsWith(to);
    return (
        <ListItemButton component={Link} to={to} selected={selected}>
            <ListItemIcon>
                <Icon/>
            </ListItemIcon>
            <ListItemText primary={text}/>
        </ListItemButton>
    )
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
                    {MenuItems.map(props => <MenuCardItem key={props.text} {...props}/>)}
                </Grid>
            </Box>
        </Container>
    )
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
                <Icon fontSize="large" sx={{my: 1}}/>
                {text}
            </Button>
        </Grid>
    )
}

ReactDOM.render(
    <Demo/>,
    document.getElementById("content")
);