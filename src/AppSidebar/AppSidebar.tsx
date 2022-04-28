import React, {PropsWithChildren} from "react";
import {Drawer, List} from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles({
    drawer: {
        width: 250
    },
    paper: {
        position: 'relative !important' as any,
        paddingTop: 70
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

