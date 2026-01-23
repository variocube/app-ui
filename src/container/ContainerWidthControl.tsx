import {Link} from "@mui/material";
import {LinkProps} from "@mui/material/Link/Link";
import * as React from "react";
import {useCallback} from "react";
import {nextWidth, useContainerSettingsContext} from "./ContainerSettingsContext";

interface ContainerWidthControlProps extends Omit<LinkProps, "children"> {
}

export function ContainerWidthControl(props: ContainerWidthControlProps) {
	const {width, setWidth} = useContainerSettingsContext();

	const handleChangeContainerWidth = useCallback(() => {
		setWidth(nextWidth(width));
	}, [width]);

	return (
		<Link href="#" underline="hover" color="secondary" onClick={handleChangeContainerWidth} {...props}>
			{width}
		</Link>
	);
}
