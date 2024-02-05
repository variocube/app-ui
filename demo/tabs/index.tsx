import {Box, Container, Typography} from "@mui/material";
import {Code, Tabs} from "../../src";
import React, {useState} from "react";
import {Tab as TabIcon} from "@mui/icons-material";
import {Link} from "react-router-dom";

export function TabsDemo() {
    const [tab, setTab] = useState(0);

    return (
        <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Tabs</Typography>

            <Box sx={{mb: 4}}>
                <Typography variant="body1" gutterBottom>
                    Wrap the Mui <Code>Tabs</Code> and <Code>Tab</Code> components with opinionated defaults:
                    <ul>
                        <li>Divider on the bottom (horizontal tabs) or right (vertical tabs).</li>
                        <li>Icon position of "start".</li>
                        <li>Scroll buttons when tabs don't fit on the screen.</li>
                    </ul>
                </Typography>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Horizontal Tabs</Typography>
                <Tabs
                    value={tab}
                    onChange={(e, tab) => setTab(tab)}
                    items={[
                        { label: 'First', icon: <TabIcon/> },
                        { label: 'Second', icon: <TabIcon/> },
                        { label: 'Third', icon: <TabIcon/> },
                        { label: 'Fourth', icon: <TabIcon/> }
                    ]}
                />
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(128, 128, 128, 0.25)", height: 160}}>
                    <Box>This is tab #{tab}</Box>
                </Box>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Navigation Tabs</Typography>
                <Box sx={{mb: 4}}>
                    <Typography variant="body1" gutterBottom>
                        Tabs can also use the component property to render a link. This can be used in combination
                        with a router.
                    </Typography>
                </Box>
                <Tabs
                    items={[
                        { label: 'Variocube', icon: <TabIcon />, component: 'a', href: 'https://variocube.com', target: '_blank' },
                        { label: 'Onlinegroup', icon: <TabIcon />, component: 'a', href: 'https://onlinegroup.at', target: '_blank' },
                        { label: 'Clesyclean', icon: <TabIcon />, component: 'a', href: 'https://clesyclean.com', target: '_blank' },
                        { label: 'Internal', icon: <TabIcon />, component: Link, to: '/' },
                    ]}
                />
            </Box>

        </Container>
    );
}