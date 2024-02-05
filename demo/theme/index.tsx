import {
    Alert,
    AlertTitle,
    Button,
    Card,
    CardContent, CardHeader,
    Container,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";
import React from "react";
import {Breadcrumbs, BreadcrumbItem, BreadcrumbLink, ThemeModeSwitcher, Code, PageTitle} from "../../src";


export function Theme() {
    return (
        <Container maxWidth="md">
            <PageTitle title="Theme" gutterBottom />

            <Typography variant="body1" gutterBottom>
                <Code>VCThemeProvider</Code> provides the Variocube theme. It supports both a light and dark mode.
                The mode is automatically selected, but can be overridden with <Code>ThemeModeSwitcher</Code>.
            </Typography>

            <Stack spacing={2} sx={{marginBottom: 2}}>
                <Card>
                    <CardHeader title="Theme mode switcher"/>
                    <CardContent>
                        <ThemeModeSwitcher/>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="Buttons"/>
                    <CardContent>
                        <Typography variant="h6" py={2}>Contained</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary">Primary</Button>
                            <Button variant="contained" color="secondary">Secondary</Button>
                            <Button variant="contained" color="error">Error</Button>
                            <Button variant="contained" color="success">Success</Button>
                            <Button variant="contained" color="info">Info</Button>
                            <Button variant="contained" color="warning">Warning</Button>
                        </Stack>
                        <Typography variant="h6" py={2}>Outlined</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button variant="outlined" color="primary">Primary</Button>
                            <Button variant="outlined" color="secondary">Secondary</Button>
                            <Button variant="outlined" color="error">Error</Button>
                            <Button variant="outlined" color="success">Success</Button>
                            <Button variant="outlined" color="info">Info</Button>
                            <Button variant="outlined" color="warning">Warning</Button>
                        </Stack>
                        <Typography variant="h6" py={2}>Text</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button variant="text" color="primary">Primary</Button>
                            <Button variant="text" color="secondary">Secondary</Button>
                            <Button variant="text" color="error">Error</Button>
                            <Button variant="text" color="success">Success</Button>
                            <Button variant="text" color="info">Info</Button>
                            <Button variant="text" color="warning">Warning</Button>
                        </Stack>
                    </CardContent>
                </Card>
                <Card>
                    <List>
                        <ListItem>
                            <ListItemText primary="List text primary" secondary="List text secondary"/>
                        </ListItem>
                        <ListItemButton disabled>
                            <ListItemText primary="Disabled text primary" secondary="Disabled text secondary"/>
                        </ListItemButton>
                    </List>
                </Card>
                <Alert severity="error">
                    <AlertTitle>Error alert</AlertTitle>
                </Alert>
                <Alert severity="warning">
                    <AlertTitle>Warning alert</AlertTitle>
                </Alert>
                <Alert severity="info">
                    <AlertTitle>Info alert</AlertTitle>
                </Alert>
                <Alert severity="success">
                    <AlertTitle>Success alert</AlertTitle>
                </Alert>
            </Stack>

            <Typography variant="h2" gutterBottom>
                Breadcrumbs
            </Typography>
            <Typography variant="body1" gutterBottom>
                For consistent styling of breadcrumbs use the following components from <Code>@variocube/app-ui</Code>.
                <ul>
                    <li>Use <Code>Breadcrumbs</Code> as container.</li>
                    <li>Use <Code>BreadcrumbLink</Code> for breadcrumbs that are a link.</li>
                    <li>Use <Code>BreadcrumbItem</Code> for the current location.</li>
                </ul>
            </Typography>
            <Card>
                <CardContent>
                    <Breadcrumbs>
                        <BreadcrumbLink href="/shows">Shows</BreadcrumbLink>
                        <BreadcrumbLink href="/shows/rick-and-morty">Rick and Morty</BreadcrumbLink>
                        <BreadcrumbLink href="/shows/rick-and-morty/seasons">Seasons</BreadcrumbLink>
                        <BreadcrumbLink href="/shows/rick-and-morty/seasons/S01">S01</BreadcrumbLink>
                        <BreadcrumbItem>Episodes</BreadcrumbItem>
                    </Breadcrumbs>
                </CardContent>
            </Card>

        </Container>
    );
}
