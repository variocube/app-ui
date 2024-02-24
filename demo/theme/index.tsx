import {
    Alert,
    AlertTitle, Box,
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
import { Breadcrumbs, BreadcrumbItem, BreadcrumbLink, ThemeModeSwitcher, Code, PageTitle, usePaletteMode, TextField, NumberField } from "../../src";


export function Theme() {

    const { colorPrimary, setColorPrimary, colorSecondary, setColorSecondary, logoLightUrl, setLogoLightUrl, logoDarkUrl, setLogoDarkUrl, logoPaddingX, setLogoPaddingX, logoPaddingY, setLogoPaddingY } = usePaletteMode();
    const GermanNumberFormat = new Intl.NumberFormat("de-DE");

    return (
        <Container maxWidth="md">
            <PageTitle title="Theme" gutterBottom />

            <Typography variant="body1" gutterBottom>
                <Code>VCThemeProvider</Code> provides the Variocube theme. It supports both a light and dark mode.
                The mode is automatically selected, but can be overridden with <Code>ThemeModeSwitcher</Code>.
            </Typography>

            <Stack spacing={2} sx={{ marginBottom: 2 }}>
                <Card>
                    <CardHeader title="Theme mode switcher" />
                    <CardContent>
                        <ThemeModeSwitcher />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="Branding" />
                    <CardContent>
                        <TextField label="Primary Color" value={colorPrimary || ""} onChange={(event) => setColorPrimary(event)} />
                        <TextField label="Seondary Color" value={colorSecondary || ""} onChange={(event) => setColorSecondary(event)} />
                    </CardContent>
                    <CardContent>
                        <TextField label="Logo Light Url" value={logoLightUrl || ""} onChange={(event) => setLogoLightUrl(event)} />
                        <TextField label="Logo Dark Url" value={logoDarkUrl || ""} onChange={(event) => setLogoDarkUrl(event)} />
                    </CardContent>
                    <CardContent>
                        <NumberField numberFormat={GermanNumberFormat} label="Padding X" numberValue={logoPaddingX === undefined ? null : logoPaddingX} onChangeNumber={(event) => setLogoPaddingX(event) as any} />
                        <NumberField numberFormat={GermanNumberFormat} label="Padding Y" numberValue={logoPaddingY === undefined ? null : logoPaddingY} onChangeNumber={(event) => setLogoPaddingY(event)} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="Buttons" />
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
                    <CardHeader title="Typography" />
                    <CardContent>
                        <Typography variant="h1" gutterBottom>Heading 1</Typography>
                        <Typography variant="h2" gutterBottom>Heading 2</Typography>
                        <Typography variant="h3" gutterBottom>Heading 3</Typography>
                        <Typography variant="h4" gutterBottom>Heading 4</Typography>
                        <Typography variant="h5" gutterBottom>Heading 5</Typography>
                        <Typography variant="h6" gutterBottom>Heading 6</Typography>
                        <Box my={2} />
                        <Typography variant="body1"><strong>Paragraph 1</strong></Typography>
                        <Typography variant="body1">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium asperiores aut blanditiis consequatur cupiditate ducimus harum magni modi numquam odio porro possimus praesentium provident sapiente totam, velit, vitae voluptatum!</Typography>
                        <Box my={2} />
                        <Typography variant="body2"><strong>Paragraph 2</strong></Typography>
                        <Typography variant="body2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad alias, commodi cum dolorum id ipsa laudantium magnam modi neque nostrum quae quibusdam quod sequi vel velit veritatis. Dolorem, illum.</Typography>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="List Items" />
                    <CardContent>
                        <List>
                            <ListItem>
                                <ListItemText primary="List text primary" secondary="List text secondary" />
                            </ListItem>
                            <ListItemButton disabled>
                                <ListItemText primary="Disabled text primary" secondary="Disabled text secondary" />
                            </ListItemButton>
                        </List>
                    </CardContent>

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
