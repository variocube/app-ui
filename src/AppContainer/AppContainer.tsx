import React, {PropsWithChildren} from "react";
import {Container} from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles({
    appContainer: {
        display: 'flex',
        flexGrow: 1,
        minHeight: 'calc(100vh - 100px)',
        maxHeight: '100vh',
        overflow: 'auto'
    },
    childContainer: {
        paddingTop: 100,
        paddingBottom: 100,
        minHeight: 'calc(100vh)',
        overflowX: 'auto'
    }
});

type AppContainerProps = {
    fullWidth?: boolean,
    maxWidth?: 'lg'|'md'|'sm'|'xs',
}

export const AppContainer = ({fullWidth, maxWidth, children}: PropsWithChildren<AppContainerProps>) => {
    const classes = useStyles();
    return (
        <div className={classes.appContainer}>
            <Container
                maxWidth={!fullWidth && maxWidth}
                className={classes.childContainer}
                children={children as any}
            />
        </div>
    )
}