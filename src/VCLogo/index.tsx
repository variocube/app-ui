import React, {SVGProps} from "react";
import {Box, BoxProps, useTheme} from "@mui/material";

interface VCAppLogoProps extends BoxProps {
    appName?: string;
}

export function VCAppLogo({appName, paddingX, paddingY, ...props}: VCAppLogoProps) {
    return (
        <Box {...props}>
            <Box sx={{display: "flex", flexFlow: "row nowrap", alignItems: "center"}}>
                <VCLogoIcon width="auto" height="32" display="block"/>
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

export function VCLogo(props: SVGProps<SVGSVGElement>) {
    const theme = useTheme();
    if (theme.palette.mode == "light") {
        return <VCLogoBlueOrange {...props}/>;
    }
    else {
        return <VCLogoWhite {...props}/>;
    }
}

export const VCLogoBlueOrange = (props: SVGProps<SVGSVGElement>) => (
    <svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 260 52"  xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve"
        style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinejoin: "round",
            strokeMiterlimit: 2,
        }}
        width={260}
        height={52}
        {...props}
    >
        <path style={{ fill: "#05164d", }} d="M130 12.75h6.71v25.51H130z" />
        <path d="M95.11 12.75h-8.28l-8.08 25.49h6.66l1.49-5.53h7.61l1.48 5.53h7.14l-8.02-25.49Zm-7 15.18 2.48-9.35h.32l2.45 9.35h-5.25ZM121.8 28.45a7.831 7.831 0 0 0 4.54-7.21c0-5-3.2-8.49-9.63-8.49h-11.08v25.49h6.61v-8.89h3l4.24 8.89h7.38l-5.06-9.79Zm-6.13-3.74h-3.43v-7h3.5a3.447 3.447 0 0 1 3.702 3.419l-.002.111c0 2.33-1.59 3.47-3.77 3.47ZM152.04 12.3c-7.4 0-11.61 4.62-11.61 11.87v2.8c0 7.18 4.19 11.74 11.59 11.74 7.4 0 11.59-4.56 11.59-11.74v-2.8c0-7.21-4.17-11.87-11.57-11.87Zm4.73 14.71c0 4.19-1.89 6.32-4.75 6.32-2.86 0-4.78-2.09-4.78-6.32v-2.93c0-4.19 1.89-6.38 4.75-6.38 2.86 0 4.75 2.19 4.75 6.38l.03 2.93ZM173.14 26.84c0 4.27 1.7 6.38 4.51 6.38 2.81 0 4.15-2 4.15-4.54h6.37v.87c0 5.24-4.17 9.16-10.62 9.16-7.19 0-11.25-4.54-11.25-11.9v-2.57c0-7.39 4.08-11.95 11.25-11.95 6.4 0 10.62 3.91 10.62 9.31v.84h-6.37c0-2.52-1.44-4.65-4.19-4.65-2.75 0-4.47 2.19-4.47 6.45v2.6ZM198.24 28.58c0 3.12 1.72 4.58 4.19 4.58 2.47 0 4.2-1.49 4.2-4.58V12.75h6.61v16.77c0 5.55-4.13 9.19-10.89 9.19-6.76 0-10.88-3.64-10.88-9.19V12.75h6.77v15.83ZM232.71 24.86v-.3a5.372 5.372 0 0 0 4.64-5.55c0-4-3.25-6.26-8-6.26h-11.61v25.49h11.93c4.8 0 8.86-2.54 8.86-7.25.072-3.273-2.547-6.033-5.82-6.13Zm-8.33-7.47h3.23c2 0 3.21 1 3.21 2.78 0 1.78-1.14 2.84-3.64 2.84h-2.8v-5.62Zm3.1 16.24h-3.1v-6.45h3.51c2.5 0 3.83 1.25 3.83 3.23s-1.48 3.22-4.24 3.22ZM259.37 38.26h-17.48V12.75h17.48V18h-10.84v5.05h10.15v4.82h-10.15v5.14h10.84v5.25ZM69.13 25.9l3.38 12.41h-6.86L56.94 12.7h8.59l3.6 13.2ZM75 31.24l6.31-18.54h-8.59l-1.38 5.09L75 31.24ZM14.24 46.48l29.94-17.24v9L22.09 51.02l-7.85-4.54Zm-4.25-2.45 34.19-19.79v-9L2.12 39.49l7.87 4.54Z"
            style={{ fill: "#05164d", fillRule: "nonzero", }}
        />
        <path d="M0 35.81V15.24l17.84 10.27L0 35.81Zm34.24-19.75 7.86-4.53L22.1 0l-7.86 4.53 20 11.53ZM9.98 6.99l-7.86 4.53 20 11.53 7.86-4.53-20-11.53Z"
            style={{ fill: "#ff6a00", fillRule: "nonzero", }}
        />
    </svg>
)

export const VCLogoWhite = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 260 52" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve"
        style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinejoin: "round",
            strokeMiterlimit: 2,
        }}
        width={260}
        height={52}
        {...props}
    >
        <path style={{ fill: "#fff", }} d="M130 12.75h6.71v25.51H130z" />
        <path d="M95.11 12.75h-8.28l-8.08 25.49h6.66l1.49-5.53h7.61l1.48 5.53h7.14l-8.02-25.49Zm-7 15.18 2.48-9.35h.32l2.45 9.35h-5.25ZM121.8 28.45a7.831 7.831 0 0 0 4.54-7.21c0-5-3.2-8.49-9.63-8.49h-11.08v25.49h6.61v-8.89h3l4.24 8.89h7.38l-5.06-9.79Zm-6.13-3.74h-3.43v-7h3.5a3.447 3.447 0 0 1 3.702 3.419l-.002.111c0 2.33-1.59 3.47-3.77 3.47ZM152.04 12.3c-7.4 0-11.61 4.62-11.61 11.87v2.8c0 7.18 4.19 11.74 11.59 11.74 7.4 0 11.59-4.56 11.59-11.74v-2.8c0-7.21-4.17-11.87-11.57-11.87Zm4.73 14.71c0 4.19-1.89 6.32-4.75 6.32-2.86 0-4.78-2.09-4.78-6.32v-2.93c0-4.19 1.89-6.38 4.75-6.38 2.86 0 4.75 2.19 4.75 6.38l.03 2.93ZM173.14 26.84c0 4.27 1.7 6.38 4.51 6.38 2.81 0 4.15-2 4.15-4.54h6.37v.87c0 5.24-4.17 9.16-10.62 9.16-7.19 0-11.25-4.54-11.25-11.9v-2.57c0-7.39 4.08-11.95 11.25-11.95 6.4 0 10.62 3.91 10.62 9.31v.84h-6.37c0-2.52-1.44-4.65-4.19-4.65-2.75 0-4.47 2.19-4.47 6.45v2.6ZM198.24 28.58c0 3.12 1.72 4.58 4.19 4.58 2.47 0 4.2-1.49 4.2-4.58V12.75h6.61v16.77c0 5.55-4.13 9.19-10.89 9.19-6.76 0-10.88-3.64-10.88-9.19V12.75h6.77v15.83ZM232.71 24.86v-.3a5.372 5.372 0 0 0 4.64-5.55c0-4-3.25-6.26-8-6.26h-11.61v25.49h11.93c4.8 0 8.86-2.54 8.86-7.25.072-3.273-2.547-6.033-5.82-6.13Zm-8.33-7.47h3.23c2 0 3.21 1 3.21 2.78 0 1.78-1.14 2.84-3.64 2.84h-2.8v-5.62Zm3.1 16.24h-3.1v-6.45h3.51c2.5 0 3.83 1.25 3.83 3.23s-1.48 3.22-4.24 3.22ZM259.37 38.26h-17.48V12.75h17.48V18h-10.84v5.05h10.15v4.82h-10.15v5.14h10.84v5.25ZM69.13 25.9l3.38 12.41h-6.86L56.94 12.7h8.59l3.6 13.2ZM75 31.24l6.31-18.54h-8.59l-1.38 5.09L75 31.24ZM14.24 46.48l29.94-17.24v9L22.09 51.02l-7.85-4.54Zm-4.25-2.45 34.19-19.79v-9L2.12 39.49l7.87 4.54ZM0 35.81V15.24l17.84 10.27L0 35.81Zm34.24-19.75 7.86-4.53L22.1 0l-7.86 4.53 20 11.53ZM9.98 6.99l-7.86 4.53 20 11.53 7.86-4.53-20-11.53Z"
            style={{
                fill: "#fff",
                fillRule: "nonzero",
            }}
        />
    </svg>
)

export function VCLogoIcon(props: SVGProps<SVGSVGElement>) {
    const theme = useTheme();
    if (theme.palette.mode == "light") {
        return <VCLogoIconOrangeBlue {...props}/>;
    }
    else {
        return <VCLogoIconWhite {...props}/>;
    }
}

export const VCLogoIconOrangeBlue = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 74 86" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve"
        style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinejoin: "round",
            strokeMiterlimit: 2,
        }}
        {...props}
    >
        <path d="M23.68 77.48 73.6 48.66v15.08l-36.82 21.3-13.1-7.56Zm-7.08-4.09 57-32.92V25.35L3.5 65.83l13.1 7.56Z"
            style={{
                fill: "#05164d",
                fillRule: "nonzero",
            }}
        />
        <path d="M0 59.74V25.35l29.69 17.17L0 59.74Zm57-33 13.1-7.56L36.78 0l-13.1 7.56L57 26.74ZM16.6 11.65 3.5 19.21l33.28 19.22 13.1-7.56L16.6 11.65Z"
            style={{
                fill: "#ff6a00",
                fillRule: "nonzero",
            }}
        />
    </svg>
)

export const VCLogoIconWhite = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 74 86" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve"
        style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinejoin: "round",
            strokeMiterlimit: 2,
        }}
        {...props}
    >
        <path d="M23.68 77.48 73.6 48.66v15.08l-36.82 21.3-13.1-7.56Zm-7.08-4.09 57-32.92V25.35L3.5 65.83l13.1 7.56ZM0 59.74V25.35l29.69 17.17L0 59.74Zm57-33 13.1-7.56L36.78 0l-13.1 7.56L57 26.74ZM16.6 11.65 3.5 19.21l33.28 19.22 13.1-7.56L16.6 11.65Z"
            style={{
                fill: "#fff",
                fillRule: "nonzero",
            }}
        />
    </svg>
)


