import {Alert, AlertTitle, Box, Container, Stack, Typography} from "@mui/material";
import {Tabs, Tab} from "../../src";
import React, {useState} from "react";
import {Tab as TabIcon} from "@mui/icons-material";


export function TabsDemo() {
    const [tab, setTab] = useState(0);

    return (
        <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Tabs</Typography>

            <Box sx={{mb: 4}}>
                <Typography variant="body1" gutterBottom>
                    Wrap the Mui <code>Tabs</code> and <code>Tab</code> components with opinionated defaults:
                    <ul>
                        <li>Divider on the bottom (horizontal tabs) or right (vertical tabs).</li>
                        <li>Icon position of "start".</li>
                        <li>Scroll buttons when tabs don't fit on the screen.</li>
                    </ul>
                </Typography>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Horizontal Tabs</Typography>
                <Tabs value={tab} onChange={(e, tab) => setTab(tab)}>
                    <Tab label="First" icon={<TabIcon/>} />
                    <Tab label="Second" icon={<TabIcon/>} />
                    <Tab label="Third" icon={<TabIcon/>} />
                    <Tab label="Fourth" icon={<TabIcon/>} />
                </Tabs>
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(128, 128, 128, 0.25)", height: 160}}>
                    <Box>This is tab #{tab}</Box>
                </Box>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Vertical Tabs</Typography>
                <Box mb={2}>
                    <Alert severity="warning">
                        <AlertTitle>Using vertical tabs is discouraged.</AlertTitle>
                        While vertical tabs are supported by Mui and work with `app-ui`, their use
                        is discouraged, because the tabs are center aligned, which does not look very
                        clean.
                    </Alert>
                </Box>
                <Stack direction="row">
                    <Tabs value={tab} onChange={(e, tab) => setTab(tab)} orientation="vertical">
                        <Tab label="First" icon={<TabIcon/>} />
                        <Tab label="Second" icon={<TabIcon/>} />
                        <Tab label="Third" icon={<TabIcon/>} />
                        <Tab label="Fourth" icon={<TabIcon/>} />
                    </Tabs>
                    <Box sx={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(128, 128, 128, 0.25)"}}>
                        <Box>This is tab #{tab}</Box>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Navigation Tabs</Typography>
                <Box sx={{mb: 4}}>
                    <Typography variant="body1" gutterBottom>
                        Tabs can also use the component property to render a link. This can be used in combination
                        with a router.
                    </Typography>
                </Box>
                <Stack direction="row">
                    <Tabs>
                        <Tab label="Variocube" icon={<TabIcon/>} component="a" href="https://variocube.com" />
                        <Tab label="Onlinegroup" icon={<TabIcon/>} component="a" href="https://onlinegroup.at" />
                        <Tab label="Clesyclean" icon={<TabIcon/>} component="a" href="https://clesyclean.com" />
                    </Tabs>
                </Stack>
            </Box>

        </Container>
    );
}