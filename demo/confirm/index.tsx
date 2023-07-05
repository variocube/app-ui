import {Card, CardContent, Container, List, MenuItem, Stack, Typography} from "@mui/material";
import * as React from "react";
import {ConfirmButton, ConfirmMenuItem} from "../../src";
import {Delete, Warning} from "@mui/icons-material";

export function ConfirmDemo() {
    return (
        <Container>
            <Stack spacing={2}>
                <Typography variant="h1" gutterBottom>
                    Confirm
                </Typography>

                <Typography variant="h2" gutterBottom>
                    Confirm button
                </Typography>
                <Typography variant="body1">
                    A confirm button shows a confirmation dialog when clicked and asking the user whether
                    they really want to execute the action.
                </Typography>
                <ConfirmButtonDemo/>

                <Typography variant="h2" gutterBottom>
                    Confirm menu item
                </Typography>
                <Typography variant="body1">
                    A confirm menu item works just like a confirm button, but as a menu item
                </Typography>
                <ConfirmMenuItemDemo/>
            </Stack>
        </Container>
    )
}

function ConfirmButtonDemo() {

    function theDangerousThing() {
        return new Promise<void>(resolve => setTimeout(resolve, 500));
    }

    return (
        <Card>
            <CardContent>
                <ConfirmButton
                    title="Do the dangerous thing"
                    cancel="Cancel"
                    onConfirm={theDangerousThing}
                    icon={<Warning/>}
                    color="warning"
                    variant="outlined"
                >
                    Are you sure you want to do the dangerous thing?
                </ConfirmButton>
            </CardContent>
        </Card>
    )
}

function ConfirmMenuItemDemo() {

    function theDangerousThing() {
        return new Promise<void>(resolve => setTimeout(resolve, 500));
    }

    return (
        <Card>
            <List>
                <MenuItem>A menu item</MenuItem>
                <ConfirmMenuItem
                    title="Do the dangerous thing"
                    cancel="Cancel"
                    onConfirm={theDangerousThing}
                    icon={<Delete/>}
                    color="error"
                >
                    Are you sure you want to do the dangerous thing?
                </ConfirmMenuItem>
                <MenuItem>Another menu item</MenuItem>
            </List>
        </Card>
    )
}