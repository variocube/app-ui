import {Typography, TypographyProps} from "@mui/material";
import React, {isValidElement, ReactNode, useEffect} from "react";
import {useLayoutContext} from "./layout-context";

interface PageTitleProps extends Omit<TypographyProps, "children" | "ref" | "title"> {
	title?: ReactNode;
}

export function PageTitle({title, variant = "h1", ...rest}: Readonly<PageTitleProps>) {
	const {setPageTitle} = useLayoutContext();

	useEffect(() => {
		setPageTitle(reactNodeToString(title));
	}, [title]);

	return <Typography variant={variant} component="h1" title="title" {...rest}>{title}</Typography>;
}

function reactNodeToString(reactNode?: React.ReactNode): string {
	let string = "";
	if (typeof reactNode === "string") {
		string = reactNode;
	} else if (typeof reactNode === "number") {
		string = reactNode.toString();
	} else if (reactNode instanceof Array) {
		reactNode.forEach(function(child) {
			string += reactNodeToString(child);
		});
	} else if (isValidElement(reactNode)) {
		string += reactNodeToString(reactNode.props.children);
	}
	return string;
}
