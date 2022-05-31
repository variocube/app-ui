import {Card, CardContent, CardHeader, Container, Stack, Typography} from "@mui/material";
import * as React from "react";
import {useCallback, useState} from "react";
import {Now, PlainDate, PlainDatePicker} from "../../src";

export function Pickers() {
    return (
        <Container>
            <Typography variant="h1" gutterBottom>Date & time pickers</Typography>

            <DatePicker/>
        </Container>
    )
}

export function DatePicker() {
    const [value, setValue] = useState<PlainDate | null>(Now.plainDate("gregory"));
    const handleChange = useCallback((value: PlainDate | null) => {
        console.log("handleChange", value);
        setValue(value);
    }, []);
    return (
        <Card>
            <CardHeader title="Date picker"/>
            <CardContent>
                <Stack spacing={2}>
                    <PlainDatePicker label="Date picker" value={value} onChange={handleChange}/>
                </Stack>
            </CardContent>
        </Card>
    )
}