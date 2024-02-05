import React, {useEffect} from "react";
import {Typography, TypographyProps} from "@mui/material";
import {useLayoutContext} from "./layout-context";

interface PageTitleProps extends Omit<TypographyProps, 'children' | 'ref'> {
    title: string;
}

export function PageTitle({title, ...rest}: PageTitleProps) {
    const {setPageTitle} = useLayoutContext();

    useEffect(() => {
        setPageTitle(title);
    }, [title]);

    return (
        <Typography variant="h1" component="h1" {...rest}>{title}</Typography>
    )
}