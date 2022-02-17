import React, {PropsWithChildren} from "react";
import {Container} from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles({
    appContainer: {
        display: 'flex',
        minHeight: 'calc(100vh - 100px)'
    },
    childContainer: {
        paddingTop: 100,
        paddingBottom: 100,
        minHeight: 'calc(100vh)',
        overflowX: 'auto'
    }
});

type AppContainerProps = {
    maxWidth?: 'lg'|'md'|'sm'|'xs';
}

export const AppContainer = ({maxWidth, children}: PropsWithChildren<AppContainerProps>) => {
    const classes = useStyles();
    return (
        <div className={classes.appContainer}>
            <Container
                maxWidth={maxWidth}
                className={classes.childContainer}
                children={children as any}
            />
        </div>
    )
}