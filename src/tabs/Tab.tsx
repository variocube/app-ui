import MuiTab, {TabProps} from "@mui/material/Tab";
import React from "react";


export function Tab(props: TabProps) {
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