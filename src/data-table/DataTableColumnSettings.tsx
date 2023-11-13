import {DataTableColumn} from "./DataTable";
import React, {Fragment, useState} from "react";
import {
    Avatar,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Menu,
    Stack,
} from "@mui/material";
import {AddCircleIcon, CloseIcon, MoveDownCircleIcon, MoveUpCircleIcon, RemoveCircleIcon, TuningIcon} from "../icons";
import {useFlag} from "../utils";
import {Labels} from "../localization";

export interface DataTableColumnButtonProps<T> {
    columns: ReadonlyArray<DataTableColumn<T>>;
    selected: ReadonlyArray<DataTableColumn<T>>;
    onChange: (selected: ReadonlyArray<DataTableColumn<T>>) => any;
    labels: Labels<"title" | "close" | "add" | "remove" | "moveUp" | "moveDown">;
}

function groupColumns<T>(available: ReadonlyArray<DataTableColumn<T>>) {
    const groups: Record<string, Array<DataTableColumn<T>>> = {};
    const other: Array<DataTableColumn<T>> = [];
    for (const column of available) {
        const group = column.group;
        if (group) {
            if (!groups[group]) {
                groups[group] = [column]
            } else {
                groups[group].push(column);
            }
        } else {
            other.push(column);
        }
    }
    return {groups, other};
}

export function DataTableColumnSettings<T>(props: DataTableColumnButtonProps<T>) {
    const {
        columns,
        selected,
        onChange,
        labels,
    } = props;

    const [open, setOpen, clearOpen] = useFlag(false);
    const [focus, setFocus] = useState<string>();
    const [addMenu, setAddMenu, clearAddMenu] = useFlag(false);
    const [addAnchor, setAddAnchor] = useState<HTMLElement | null>(null);

    const available = columns.filter(column => !selected.find(s => s.field == column.field));
    const {groups, other} = groupColumns(available);

    function move(sourceIndex: number, targetIndex: number) {
        const newSelected = [...selected];
        const temp = newSelected[targetIndex];
        newSelected[targetIndex] = newSelected[sourceIndex];
        newSelected[sourceIndex] = temp;
        onChange(newSelected);
    }

    function moveUp() {
        const index = selected.findIndex(s => s.field == focus);
        if (index >= 1) {
            move(index, index - 1);
        }
    }

    function moveDown() {
        const index = selected.findIndex(s => s.field == focus);
        if (index >= 0 && index + 1 < selected.length) {
            move(index, index + 1);
        }
    }

    function remove() {
        onChange(selected.filter(c => c.field != focus));
        setFocus(undefined);
    }

    function add(column: DataTableColumn<T>) {
        onChange([...selected, column]);
        clearAddMenu();
    }

    function changeFocus(column: DataTableColumn<T>) {
        setFocus(focus != column.field ? column.field : undefined)
    }

    function renderSelectListItems(columns: ReadonlyArray<DataTableColumn<T>>) {
        return columns.map(column => (
            <ListItemButton key={column.field} onClick={() => add(column)}>
                <ListItemText primary={column.label}/>
            </ListItemButton>
        ));
    }

    return (
        <Fragment>
            <IconButton onClick={setOpen} title={labels("title")}>
                <TuningIcon/>
            </IconButton>
            <Dialog open={open} onClose={clearOpen} fullWidth maxWidth="xs">
                <DialogTitle>
                    {labels("title")}
                </DialogTitle>
                <IconButton
                    aria-label={labels("close")}
                    title={labels("close")}
                    onClick={clearOpen}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <List sx={{flex: 1, overflowY: "scroll"}}>
                    {selected.map((column, index) => (
                        <ListItemButton
                            key={column.field}
                            onClick={() => changeFocus(column)}
                            selected={focus == column.field}
                        >
                            <ListItemAvatar>
                                <Avatar>{index + 1}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={column.label}
                                secondary={column.group}
                            />
                        </ListItemButton>
                    ))}
                </List>
                <DialogActions>
                    <Stack spacing={2} direction="row" justifyContent="space-between" flex={1}>
                        <IconButton
                            onClick={setAddMenu}
                            ref={setAddAnchor}
                            disabled={available.length == 0}
                            color="primary"
                            title={labels("add")}
                            size="large"
                        >
                            <AddCircleIcon fontSize="large"/>
                        </IconButton>
                        <Stack spacing={2} direction="row" justifyContent="center">
                            <IconButton
                                onClick={moveUp}
                                disabled={!focus}
                                color="secondary"
                                title={labels("moveUp")}
                                size="large"
                            >
                                <MoveUpCircleIcon fontSize="large"/>
                            </IconButton>
                            <IconButton
                                onClick={moveDown}
                                disabled={!focus}
                                color="secondary"
                                title={labels("moveDown")}
                                size="large"
                            >
                                <MoveDownCircleIcon fontSize="large"/>
                            </IconButton>
                        </Stack>
                        <IconButton
                            onClick={remove}
                            disabled={!focus}
                            color="error"
                            title={labels("remove")}
                            size="large"
                        >
                            <RemoveCircleIcon fontSize="large"/>
                        </IconButton>
                    </Stack>
                </DialogActions>

                <Menu
                    open={addMenu}
                    anchorEl={addAnchor}
                    onClose={clearAddMenu}
                >
                    {Object.entries(groups).map(([group, columns]) => (
                        <Fragment>
                            <ListSubheader>{group}</ListSubheader>
                            {renderSelectListItems(columns)}
                        </Fragment>
                    ))}
                    {renderSelectListItems(other)}
                </Menu>
            </Dialog>
        </Fragment>
    )
}