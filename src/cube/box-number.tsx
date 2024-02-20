import { Avatar } from "@mui/material";
import React, { ReactNode } from "react";

interface BoxNumberProps {
    number: ReactNode ;
}

export function BoxNumber({number, ...rest}: BoxNumberProps) {
    return (
        <Avatar>{number}</Avatar>
    )
}
