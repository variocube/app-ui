import React, {PropsWithChildren} from "react";
import {Breadcrumbs as MuiBreadcrumbs, Link, LinkProps, Typography} from "@mui/material";
import {ChevronRightIcon} from "./icons";
import {LinkTypeMap} from "@mui/material/Link/Link";

export function Breadcrumbs({children}: PropsWithChildren<{}>) {
    return (
        <MuiBreadcrumbs separator={<ChevronRightIcon fontSize="small"/>}>
            {children}
        </MuiBreadcrumbs>
    )
}

export function BreadcrumbLink<
    D extends React.ElementType = LinkTypeMap['defaultComponent'],
    P = {}
>(props: LinkProps<D, P>) {
    return (
        <Link color="inherit" {...props}/>
    )
}

export function BreadcrumbItem({children}: PropsWithChildren<{}>) {
    return (
        <Typography color="textPrimary">{children}</Typography>
    );
}
