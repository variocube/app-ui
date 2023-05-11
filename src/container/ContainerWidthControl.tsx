import * as React from "react";
import {Link} from "@mui/material";
import {LinkProps} from "@mui/material/Link/Link";
import {nextWidth, useContainerSettingsContext} from "./ContainerSettingsContext";
import {useCallback} from "react";

interface ContainerWidthControlProps extends Omit<LinkProps, "children"> {
}

export function ContainerWidthControl(props: ContainerWidthControlProps) {
    const {width, setWidth} = useContainerSettingsContext();

    const handleChangeContainerWidth = useCallback(() => {
        setWidth(nextWidth(width));
    }, [width]);

    return (
        <Link href="#" underline="hover" onClick={handleChangeContainerWidth} {...props}>{width}</Link>
    );
}
