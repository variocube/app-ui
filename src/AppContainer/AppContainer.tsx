import React, {PropsWithChildren} from "react";
import {Container, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    appContainer: {
        display: 'flex',
        height: 'calc(100vh - 100px)',
        minHeight: '100%',
        overflow: 'hidden',
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