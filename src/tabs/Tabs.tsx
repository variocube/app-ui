import MuiTabs, {TabsProps} from "@mui/material/Tabs";
import React from "react";

export function Tabs(props: TabsProps) {
    const {
        orientation = "horizontal",
        variant = "scrollable",
        scrollButtons = "auto",
        allowScrollButtonsMobile = true,
        sx,
        ...rest
    } = props;

    // TODO: scrolling does not work as intended.
    // the tab bar always takes up as much space as it needs unless there a maxWidth set on a container element.
    // it would be better to have an implementation like GitHub, where tab items that don't fit are placed in
    // in a dropdown overflow menu.

    return (
        <MuiTabs
            orientation={orientation}
            variant={variant}
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