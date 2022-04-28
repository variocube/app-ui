import React, {ReactElement} from "react";
import {ListItemButton, ListItemIcon, ListItemText, Theme} from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
    text: {
        '&, & *': {
            color: '#777'
        }
    },
    active: {
        '&, & *': {
            color: theme.palette.primary.main
        }
    }
}))

type Props = {
    label: string;
    icon: ReactElement,
    onClick?: () => void,
    active?: boolean
}

export const AppSidebarItem = ({label, icon, onClick, active}: Props) => {
    const classes = useStyles();
    return (
        <ListItemButton onClick={onClick}>
            <ListItemIcon className={active ? classes.active : classes.text}>{icon}</ListItemIcon>
            <ListItemText className={active ? classes.active : classes.text}><span style={{ fontWeight: 500 }}>{label}</span></ListItemText>
        </ListItemButton>
    )
}