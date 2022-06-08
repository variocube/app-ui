import * as React from "react";
import {ReactElement} from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter, Link, Outlet, Route, Routes} from "react-router-dom";
import {DevApp} from "./DevApp";
import {Localization} from "./localization";
import {Pickers} from "./date-pickers";
import {VCThemeProvider} from "../src";
import {AppLayout} from "../src/AppLayout";
import {Container, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {useLocation} from "react-router";
import {CalendarMonth, Language, Photo} from "@mui/icons-material";

function Demo() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route index element={<Start/>}/>
                    <Route path="localization" element={<Localization/>}/>
                    <Route path="date-pickers" element={<Pickers/>}/>
                    <Route path="devapp" element={<DevApp/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

function App() {
    return (
        <VCThemeProvider primaryColor="orange">
            <AppLayout appName={"UI docs"} sideNav={<SideNav/>} sideNavWidth={240}>
                <Outlet/>
            </AppLayout>
        </VCThemeProvider>
    )
}

function SideNav() {
    return (
        <List>
            <SideNavListItem icon={<Language/>} to="/localization" text="Localization"/>
            <SideNavListItem icon={<CalendarMonth/>} to="/date-pickers" text="Date & time pickers"/>
            <SideNavListItem icon={<Photo/>} to="/devapp" text="Dev-App"/>
        </List>
    )
}

interface SideNavListItemProps {
    to: string;
    text: string;
    icon: ReactElement;
}

function SideNavListItem({icon, text, to}: SideNavListItemProps) {
    const location = useLocation();
    const selected = location.pathname.startsWith(to);
    return (
        <ListItemButton component={Link} to={to} selected={selected}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={text}/>
        </ListItemButton>
    )
}

function Start() {
    return (
        <Container>
            <Typography variant="h1">Welcome</Typography>
        </Container>
    )
}

ReactDOM.render(
    <Demo/>,
    document.getElementById("content")
);