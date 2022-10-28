import {Box, Button, Card, CardActions, CardContent, Container, Stack, Typography} from "@mui/material";
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
    const [text, setText] = useState("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();
    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <Stack spacing={2}>
                        <TextField
                            label="Text field"
                            value={text}
                            onChange={setText}
                        />
                        <TextField
                            label="E-mail field"
                            type="email"
                        />
                        <TextField
                            label="Required field"
                            required
                        />
                        <TextField
                            label="Pattern field"
                            required
                            inputProps={{
                                pattern: "[a-z][0-9]+"
                            }}
                            helperText={"Enter one lowercase letter followed by one or more digits"}
                        />
                        <TextField
                            label="Min/max length field"
                            required
                            inputProps={{
                                minLength: 3,
                                maxLength: 7
                            }}
                            helperText={"Enter from 3 to 7 chars."}
                        />
                        <TextField
                            label="Custom validation"
                            required
                            helperText="Please enter the value `foo`."
                            validate={value => value != "foo" ? "You have to enter `foo`." : undefined}
                        />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button color="primary" type="submit">
                        Submit
                    </Button>
                </CardActions>
            </form>
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