import * as React from "react";
import {ReactElement} from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter, Link, Outlet, Route, Routes} from "react-router-dom";
import {ContentTableDemo} from "./content-table";
import {Localization} from "./localization";
import {Pickers} from "./date-pickers";
import {VCThemeProvider} from "../src";
import {AppLayout} from "../src/AppLayout";
import {Container, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {useLocation} from "react-router";
import {CalendarMonth, Edit, Language, Palette, ViewList} from "@mui/icons-material";
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
            <AppLayout appName={"UI docs"} sideNav={<SideNav/>} sideNavWidth={240}>
                <Outlet/>
            </AppLayout>
        </VCThemeProvider>
    )
}

function SideNav() {
    return (
        <List>
            <SideNavListItem icon={<Palette/>} to="/theme" text="Theme"/>
            <SideNavListItem icon={<Language/>} to="/localization" text="Localization"/>
            <SideNavListItem icon={<CalendarMonth/>} to="/date-pickers" text="Date & time pickers"/>
            <SideNavListItem icon={<ViewList/>} to="/content-table" text="Content table"/>
            <SideNavListItem icon={<Edit/>} to="/inputs" text="Inputs"/>
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