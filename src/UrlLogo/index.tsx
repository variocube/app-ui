import React, { SVGProps } from "react";
import { Box, BoxProps, useTheme } from "@mui/material";

interface UrlAppLogoProps extends BoxProps {
    appName?: string;
    url: string;
    paddingX: number;
    paddingY: number
}

export function UrlAppLogo({ appName, url, paddingX, paddingY, ...props }: UrlAppLogoProps) {
    return (
        <Box {...props}>
            <Box sx={{ display: "flex", flexFlow: "row nowrap", alignItems: "center" }}>
                <UrlLogoIcon url={url}/>
                {appName && (
                    <Box sx={{
                        lineHeight: 1,
                        fontSize: "20px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        marginLeft: "8px",
                        paddingX: paddingX,
                        paddingY: paddingY
                    }}>
                        {appName}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

interface UrlLogoIconProps {
    url: string;
}


export function UrlLogoIcon(props: UrlLogoIconProps) {
    return <img height={52} src={props.url} />;
}


