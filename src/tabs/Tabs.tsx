import MuiTabs, {TabsProps} from "@mui/material/Tabs";
import React from "react";

export function Tabs(props: TabsProps) {
    const {
        orientation = "horizontal",
        scrollButtons = "auto",
        allowScrollButtonsMobile = true,
        sx,
        ...rest
    } = props;

    return (
        <MuiTabs
            orientation={orientation}
            scrollButtons={scrollButtons}
            allowScrollButtonsMobile={allowScrollButtonsMobile}
            sx={{
                ...sx,
                borderRight: orientation == "vertical" ? 1 : 0,
                borderBottom: orientation == "horizontal" ? 1 : 0,
                borderColor: "divider"
            }}
            {...rest}
        />
    );
}