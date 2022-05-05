import React, {PropsWithChildren} from "react";
import {Drawer, List, Theme} from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => {
    return {
        drawer: {
            zIndex: 99,
            width: 250,
            overflow: 'hidden',
            [theme.breakpoints.down("md")]: {
                width: 60
            }
        },
        paper: {
            position: 'relative !important' as any,
            paddingTop: 70
        }
    }
})

export const AppSidebar = ({children}: PropsWithChildren<{}>) => {

    const classes = useStyles();
    return (
        <Drawer variant="permanent" open={true} classes={{ root: classes.drawer, paper: classes.paper }}>
            <List>
                {children}
            </List>
        </Drawer>
    )
}

