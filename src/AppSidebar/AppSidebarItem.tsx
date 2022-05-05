import React, {ReactElement} from "react";
import {ListItemButton, ListItemIcon, ListItemText, Theme} from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
    item: {
        '& .MuiListItemText-root': {
            [theme.breakpoints.down("md")]: {
                display: 'none'
            }
        },
        [theme.breakpoints.down("md")]: {
            paddingTop: theme.spacing(2) + ' !important',
            paddingBottom: theme.spacing(2) + ' !important',
        }
    },
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
    const itemClassName = [classes.item];
    if (active) itemClassName.push(classes.active);
    return (
        <ListItemButton className={itemClassName.join(' ')} onClick={onClick}>
            <ListItemIcon className={classes.text}>{icon}</ListItemIcon>
            <ListItemText className={classes.text}><span style={{ fontWeight: 500 }}>{label}</span></ListItemText>
        </ListItemButton>
    )
}