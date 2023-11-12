import {DataTableColumn} from "./DataTable";
import React, {Fragment, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Hidden,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
    Typography
} from "@mui/material";
import {MoveDownIcon, MoveUpIcon, TuningIcon} from "../icons";
import {useFlag} from "../utils";
import {Tabs} from "../tabs";

export interface DataTableColumnButtonProps<T> {
    available: ReadonlyArray<DataTableColumn<T>>;
    selected: ReadonlyArray<DataTableColumn<T>>;
    onChange: (selected: ReadonlyArray<DataTableColumn<T>>) => any;
    dialogTitle: string;
    closeLabel: string;
    selectLabel: string;
    orderLabel: string;
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
        available,
        selected,
        onChange,
        dialogTitle,
        closeLabel,
        selectLabel,
        orderLabel,
    } = props;

    const [open, setOpen, clearOpen] = useFlag(false);
    const [focus, setFocus] = useState<string>();
    const [tab, setTab] = useState<"select" | "order">("select");

    const {groups, other} = groupColumns(available);

    function handleChange(column: DataTableColumn<T>, checked: boolean) {
        if (checked) {
            onChange([...selected, column]);
        } else {
            onChange(selected.filter(c => c.field != column.field));
        }
    }

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

    function changeFocus(column: DataTableColumn<T>) {
        setFocus(focus != column.field ? column.field : undefined)
    }

    function renderSelectListItems(columns: ReadonlyArray<DataTableColumn<T>>) {
        return columns.map(column => (
            <ListItemButton key={column.field}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={Boolean(selected.find(s => s.field == column.field))}
                        onChange={(e) => handleChange(column, e.currentTarget.checked)}
                    />
                </ListItemIcon>
                <ListItemText primary={column.label}/>
            </ListItemButton>
        ));
    }

    function renderSelect() {
        return (
            <List>
                {Object.entries(groups).map(([group, columns]) => (
                    <Fragment>
                        <ListSubheader>{group}</ListSubheader>
                        {renderSelectListItems(columns)}
                    </Fragment>
                ))}
                {renderSelectListItems(other)}
            </List>
        )
    }

    function renderOrder() {
        return (
            (
                <Fragment>
                    <List>
                        {selected.map(column => (
                            <ListItemButton
                                key={column.field}
                                onClick={() => changeFocus(column)}
                                selected={focus == column.field}
                            >
                                <ListItemText
                                    primary={column.label}
                                    secondary={column.group}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                    <DialogContent>
                        <Stack spacing={2} direction="row" justifyContent="center">
                            <IconButton onClick={moveUp} disabled={!focus} color="secondary">
                                <MoveUpIcon/>
                            </IconButton>
                            <IconButton onClick={moveDown} disabled={!focus} color="secondary">
                                <MoveDownIcon/>
                            </IconButton>
                        </Stack>
                    </DialogContent>
                </Fragment>
            )
        )
    }

    return (
        <Fragment>
            <IconButton onClick={setOpen}>
                <TuningIcon/>
            </IconButton>
            <Dialog open={open} onClose={clearOpen} fullWidth maxWidth="md">
                <DialogTitle>
                    {dialogTitle}
                </DialogTitle>
                <Hidden mdUp>
                    <Tabs
                        value={tab}
                        onChange={(_, value) => setTab(value)}
                        items={[
                            {label: selectLabel, value: "select"},
                            {label: orderLabel, value: "order"},
                        ]}
                    />
                    {tab == "select" && renderSelect()}
                    {tab == "order" && renderOrder()}

                </Hidden>
                <Hidden mdDown>
                    <Stack direction="row">
                        <Box sx={{flex: 1}}>
                            <Typography variant="h6" px={2} gutterBottom>{selectLabel}</Typography>
                            {renderSelect()}
                        </Box>
                        <Divider orientation="vertical" flexItem/>
                        <Box sx={{flex: 1}}>
                            <Typography variant="h6" px={2} gutterBottom>{orderLabel}</Typography>
                            {renderOrder()}
                        </Box>
                    </Stack>
                </Hidden>
                <DialogActions>
                    <Button color="primary" onClick={clearOpen}>
                        {closeLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}