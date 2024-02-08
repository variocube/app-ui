import React from "react";
import {Chip} from "@mui/material";

interface MaintenanceProps {
    status: string;
}

export function MaintenanceStatus({status}: MaintenanceProps) {
    return (
        <Chip key={status} label={status} />
    )
}