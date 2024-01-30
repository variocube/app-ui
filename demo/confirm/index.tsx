import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
    List,
    MenuItem,
    Stack,
    Typography
} from "@mui/material";
import * as React from "react";
import {ConfirmButton, ConfirmMenuItem, PageTitle, TextField} from "../../src";
import {Delete, Edit, Warning} from "@mui/icons-material";
import {Fragment} from "react";

export function ConfirmDemo() {
    return (
        <Container>
            <Stack spacing={2}>
                <PageTitle title="Confirm" gutterBottom />

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
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader title="Simple confirm"/>
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
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader title="Confirm by typing"/>
                        <CardContent>
                            <ConfirmButton
                                title="Delete something"
                                cancel="Cancel"
                                onConfirm={theDangerousThing}
                                icon={<Delete/>}
                                color="error"
                                variant="outlined"
                            >
                                <TextField
                                    label={<Fragment>Type <em>delete</em> to confirm.</Fragment>}
                                    inputProps={{pattern: "delete"}}
                                    required
                                />
                            </ConfirmButton>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader title="Edit dialog"/>
                        <CardContent>
                            <ConfirmButton
                                title="Edit value"
                                confirmTitle="Save value"
                                cancel="Cancel"
                                onConfirm={theDangerousThing}
                                icon={<Edit/>}
                                variant="outlined"
                            >
                                <TextField
                                    label="Value"
                                    defaultValue="foo"
                                    required
                                />
                            </ConfirmButton>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
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