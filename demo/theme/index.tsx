import {
    Alert,
    AlertTitle,
    Button,
    Card,
    CardContent,
    Container,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";
import React from "react";
import {ThemeModeSwitcher} from "../../src";


export function Theme() {
    return (
        <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Theme</Typography>

            <Typography variant="body1" gutterBottom>
                <code>VCThemeProvider</code> provides the Variocube theme. It supports both a light and dark mode.
                The mode is automatically selected, but can be overridden with <code>ThemeModeSwitcher</code>.
            </Typography>

            <Stack spacing={2}>
                <Card>
                    <CardContent>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary">Primary Btn</Button>
                            <Button variant="contained" color="secondary">Secondary Btn</Button>
                            <Button variant="outlined" color="primary">Primary Btn</Button>
                            <Button variant="outlined" color="secondary">Secondary Btn</Button>
                            <ThemeModeSwitcher/>
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


        </Container>
    );
}
