import MuiTab, {TabProps} from "@mui/material/Tab";
import React from "react";
import {TabTypeMap} from "@mui/material/Tab/Tab";


export function Tab<
    D extends React.ElementType = TabTypeMap['defaultComponent'],
    P = {}
>(props: TabProps<D, P>) {
    const {
        iconPosition = "start",
        sx,
        ...rest
    } = props;

    return (
        <MuiTab
            iconPosition={iconPosition}
            sx={{
                ...sx,
                minHeight: "auto",
            }}
            {...rest}
        />
    )
}