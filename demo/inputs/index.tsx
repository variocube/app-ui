import {Box, Card, CardContent, Container, Typography} from "@mui/material";
import React, {useState} from "react";
import {TextField, Checkbox, Selector} from "../../src";


export function Inputs() {
    return (
        <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Inputs</Typography>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Text field</Typography>
                <Typography variant="body1" gutterBottom>
                    Wraps a Mui <code>TextField</code>
                </Typography>
                <TextFieldDemo/>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Checkbox</Typography>
                <Typography variant="body1" gutterBottom>
                    Wraps a Mui <code>Checkbox</code> in a <code>FormControlLabel</code>
                </Typography>
                <CheckboxDemo/>
            </Box>

            <Box sx={{mb: 4}}>
                <Typography variant="h2" gutterBottom>Selector</Typography>
                <Typography variant="body1" gutterBottom>
                    Special case of Mui <code>TextField</code> that lets the user select from a list of options.
                </Typography>
                <SelectorDemo/>
            </Box>

        </Container>
    );
}

function TextFieldDemo() {
    const [value, setValue] = useState("");
    return (
        <Card>
            <CardContent>
                <TextField label="Text field" value={value} onChange={setValue}/>
            </CardContent>
        </Card>
    );
}

function CheckboxDemo() {
    const [value, setValue] = useState(false);
    return (
        <Card>
            <CardContent>
                <Checkbox label="Checkbox" value={value} onChange={setValue}/>
            </CardContent>
        </Card>
    );
}

function SelectorDemo() {
    const [value, setValue] = useState("");
    return (
        <Card>
            <CardContent>
                <Selector label="Selector" value={value} onChange={setValue} options={[
                    {label: "Green", value: "green"},
                    {label: "Red", value: "red"},
                    {label: "Blue", value: "blue"}
                ]}/>
            </CardContent>
        </Card>
    );
}