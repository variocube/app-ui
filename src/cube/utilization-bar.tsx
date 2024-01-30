import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import {Box, useTheme} from "@mui/material";

interface UtilizationBarProps {
    occupied: number;
    available: number;
    disabled: number;
    total: number;
    occupiedLabel: string;
    availableLabel: string;
    disabledLabel: string;
    totalLabel: string;
}

export const UtilizationBar = (props: UtilizationBarProps) => {
    const {
        occupied,
        available,
        disabled,
        total,
        occupiedLabel,
        availableLabel,
        totalLabel,
        disabledLabel
    } = props;

    const theme = useTheme();
    return (
        <Box sx={{whiteSpace: "nowrap"}}>
            <Box sx={{
                position: "relative",
                top: "3px",
                display: "inline-block",
                width: "100px",
                height: "20px",
                marginRight: 1,
                background: "rgba(0, 0, 0, 0.25)",
                borderRadius: "3px",
                overflow: "hidden"
            }}>
                <UtilizationSegment
                    title={`${occupiedLabel}: ${occupied}`}
                    fraction={occupied / total}
                    color={theme.palette.secondary.main}
                />
                <UtilizationSegment
                    title={`${availableLabel}: ${available}`}
                    fraction={available / total}
                    color={theme.palette.success.main}
                />
                <UtilizationSegment
                    title={`${disabledLabel}: ${disabled}`}
                    fraction={disabled / total}
                    color={theme.palette.divider}
                />
            </Box>

            <Tooltip title={`${totalLabel}: ${total}`}>
                <Box sx={{
                    display: "inline",
                    position: "relative",
                    top: "-2px",
                    fontWeight: "bold",
                }}>
                    {total}
                </Box>
            </Tooltip>
        </Box>
    );
};

interface UtilizationSegmentProps {
    title: string;
    color: string;
    fraction: number;
}

function UtilizationSegment({color, title, fraction}: UtilizationSegmentProps) {
    return (
        <Tooltip
            title={title}
            children={
                <Box
                    sx={{
                        display: "inline-block",
                        height: "20px",
                        backgroundColor: color,
                        width: `${100 * fraction}%`
                    }}
                />
            }
        />
    );
}

