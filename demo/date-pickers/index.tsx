import {Card, CardContent, CardHeader, Container, Stack, Typography} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {PlainDate, PlainDatePicker, PlainDateTime, PlainDateTimePicker} from "../../src";

export function Pickers() {
    return (
        <Container>
            <Typography variant="h1" gutterBottom>Date & time pickers</Typography>
            <Stack spacing={2}>
                <DatePicker/>
                <DateTimePicker/>
            </Stack>
        </Container>
    )
}

export function DatePicker() {
    const [value, setValue] = useState<PlainDate | null>(null);
    return (
        <Card>
            <CardHeader title="Date picker"/>
            <CardContent>
                <PlainDatePicker
                    label="Date picker"
                    value={value}
                    onChange={setValue}
                />
            </CardContent>
        </Card>
    )
}

export function DateTimePicker() {
    const [value, setValue] = useState<PlainDateTime | null>(null);
    return (
        <Card>
            <CardHeader title="Datetime picker"/>
            <CardContent>
                <PlainDateTimePicker
                    label="Datetime picker"
                    value={value}
                    onChange={setValue}
                />
            </CardContent>
        </Card>
    )
}