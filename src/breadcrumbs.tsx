import {Breadcrumbs as MuiBreadcrumbs, Link, LinkProps, Typography} from "@mui/material";
import {LinkTypeMap} from "@mui/material/Link/Link";
import React, {PropsWithChildren} from "react";
import {ChevronRightIcon} from "./icons";

export function Breadcrumbs({children}: PropsWithChildren<{}>) {
	const hasChildren = React.Children.count(children) > 0;
	return (
		<MuiBreadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
			{hasChildren ? children : <Typography sx={{visibility: "hidden"}}>&nbsp;</Typography>}
		</MuiBreadcrumbs>
	);
}

export function BreadcrumbLink<
	D extends React.ElementType = LinkTypeMap["defaultComponent"],
	P = {},
>(props: LinkProps<D, P>) {
	return <Link color="inherit" {...props} />;
}

export function BreadcrumbItem({children}: PropsWithChildren<{}>) {
	return <Typography color="textPrimary">{children}</Typography>;
}
