import {Card, CardContent, CardHeader, Container, Stack, Typography} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {PlainDate, PlainDatePicker} from "../../src";

export function Pickers() {
    return (
        <Container>
            <Typography variant="h1" gutterBottom>Date & time pickers</Typography>

            <DatePicker/>
        </Container>
    )
}

export function DatePicker() {
    const [value, setValue] = useState<PlainDate | null>(null);
    return (
        <Card>
            <CardHeader title="Date picker"/>
            <CardContent>
                <Stack spacing={2}>
                    <PlainDatePicker
                        label="Date picker"

                        value={value}
                        onChange={setValue}
                    />
                </Stack>
            </CardContent>
        </Card>
    )
}