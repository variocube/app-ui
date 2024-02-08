import { Avatar } from "@mui/material";
import React from "react";

interface BoxNumberProps {
    number: number;
}

export function BoxNumber({number, ...rest}: BoxNumberProps) {
    return (
        <Avatar>{number}</Avatar>
    )
}
