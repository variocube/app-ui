import {Button, Card, CardActions, CardContent, Container, Stack, Typography} from "@mui/material";
import * as React from "react";
import {Code, EditForm, SearchForm, TextField} from "../../src";
import {useAsync} from "react-async-hook";
import {useEffect, useState} from "react";


export function Forms() {
    return (
        <Container>
            <Stack spacing={2}>
                <Typography variant="h1" gutterBottom>
                    Forms
                </Typography>
                <Typography variant="h2" gutterBottom>
                    Edit Form
                </Typography>
                <Typography variant="body1">
                    An edit form has a save button and has a loading state both while loading the data
                    and while saving the data.
                </Typography>
                <EditFormDemo/>
                <Typography variant="h2" gutterBottom>
                    Search Form
                </Typography>
                <Typography variant="body1">
                    A form containing a <Code>TextField</Code> with an embedded submit button showing a search icon.
                </Typography>
                <SearchFormDemo/>
            </Stack>
        </Container>
    )
}

export function EditFormDemo() {
    const [serverData, setServerData] = useState("data from server");
    const [formData, setFormData] = useState("");

    const {loading, result, execute} = useAsync(() => {
        return new Promise<string>((resolve) => {
            setTimeout(() => resolve(serverData), 250);
        });
    }, []);

    async function handleSave() {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setServerData(formData);
                resolve();
            }, 250);
        });
    }

    useEffect(() => {
        if (result) {
            setFormData(result);
        }
    }, [result]);

    return (
        <Stack spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="body2">
                        In this demo we emulate loading data from a server and saving it back.
                        This card shows the current state of the (emulated) server data.
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography variant="body1">
                        Server data: {serverData}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={execute}>Reload from server</Button>
                </CardActions>
            </Card>

            <EditForm loading={loading} onSave={handleSave} onCancel={() => alert('Cancel button clicked.')}>
                <CardContent>
                    <TextField
                        label="Data"
                        value={formData}
                        onChange={setFormData}
                    />
                </CardContent>
            </EditForm>
        </Stack>
    )
}

function SearchFormDemo() {
    const [search, setSearch] = useState("");
    return (
        <Card>
            <CardContent>
                <SearchForm search={search} onSearch={setSearch}/>
            </CardContent>
            <CardContent>
                You are searching for: {search}
            </CardContent>
        </Card>
    )
}
