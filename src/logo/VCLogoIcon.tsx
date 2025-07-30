import {useTheme} from "@mui/material";
import React, {SVGProps} from "react";

export function VCLogoIcon(props: SVGProps<SVGSVGElement>) {
	const theme = useTheme();
	if (theme.palette.mode == "light") {
		return <VCLogoIconOrangeBlue {...props} />;
	} else {
		return <VCLogoIconWhite {...props} />;
	}
}

export const VCLogoIconOrangeBlue = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 74 86"
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		style={{
			fillRule: "evenodd",
			clipRule: "evenodd",
			strokeLinejoin: "round",
			strokeMiterlimit: 2,
		}}
		display="block"
		{...props}
	>
		<path
			d="M23.68 77.48 73.6 48.66v15.08l-36.82 21.3-13.1-7.56Zm-7.08-4.09 57-32.92V25.35L3.5 65.83l13.1 7.56Z"
			style={{
				fill: "#05164d",
				fillRule: "nonzero",
			}}
		/>
		<path
			d="M0 59.74V25.35l29.69 17.17L0 59.74Zm57-33 13.1-7.56L36.78 0l-13.1 7.56L57 26.74ZM16.6 11.65 3.5 19.21l33.28 19.22 13.1-7.56L16.6 11.65Z"
			style={{
				fill: "#ff6a00",
				fillRule: "nonzero",
			}}
		/>
	</svg>
);
export const VCLogoIconWhite = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 74 86"
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		style={{
			fillRule: "evenodd",
			clipRule: "evenodd",
			strokeLinejoin: "round",
			strokeMiterlimit: 2,
		}}
		display="block"
		{...props}
	>
		<path
			d="M23.68 77.48 73.6 48.66v15.08l-36.82 21.3-13.1-7.56Zm-7.08-4.09 57-32.92V25.35L3.5 65.83l13.1 7.56ZM0 59.74V25.35l29.69 17.17L0 59.74Zm57-33 13.1-7.56L36.78 0l-13.1 7.56L57 26.74ZM16.6 11.65 3.5 19.21l33.28 19.22 13.1-7.56L16.6 11.65Z"
			style={{
				fill: "#fff",
				fillRule: "nonzero",
			}}
		/>
	</svg>
);
