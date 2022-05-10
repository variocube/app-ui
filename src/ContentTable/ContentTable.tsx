import React, {Fragment, ReactComponentElement, useMemo, useState} from "react";
import {
    Box,
    Button, Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    Grid,
    IconButton,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Theme
} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {FilterListIcon, TuningIcon} from "../icons";
import {Page, PagingSettings} from "../Paging";
import {UndrawEmpty} from "./UndrawEmpty";

const useStyles = makeStyles((theme: Theme) => ({
    tableHead: {
        background: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[600]
    },
    tableBody: {
        '& > tr:not(.empty)': {
            cursor: 'pointer',
            '&:hover': {
                background: `${theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[800]} !important`
            }
        }
    },
    graphic: {
        height: 300,
        [theme.breakpoints.down('md')]: {
            height: 150
        },
    },
    filterColumn: {
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center'
    }
}));

export type ColumnType = { [sortKey: string]: { show: boolean, name: string, align?: 'left'|'right'|'center', unsortable?: boolean } }

type ContentTableProps<T> = {
    pageable: PagingSettings<keyof ColumnType>,
    columns: ColumnType,
    onPageableChange: (pageable: PagingSettings<keyof ColumnType>) => void,
    onColumnsChange: (columns: ColumnType) => void,
    page?: Page<T>,
    inProgress?: boolean,
    onFilterClick?: () => void,
    renderEmptyContent?: ReactComponentElement<any>,
    renderTableBody?: ReactComponentElement<any>,
    renderFilterOptions?: ReactComponentElement<any>
}

export const ContentTable = <T extends unknown>({page, pageable, columns, onPageableChange, onColumnsChange, inProgress, onFilterClick, renderEmptyContent, renderTableBody, renderFilterOptions}: ContentTableProps<T>) => {
    const currentPage = useMemo(() => page, [page]);
    const currentPageable = useMemo(() => pageable, [pageable]);
    const [showColumnSettings, setShowColumnSettings] = useState(false);

    const handleSortColumn = (key: keyof typeof columns) => {
        const {sort, direction} = currentPageable;
        let oD: 'desc'|'asc';
        if (sort == key) {
            oD = direction === 'desc' ? 'asc' : 'desc';
        } else {
            oD = 'desc';
        }
        updatePageable({
            ...currentPageable,
            sort: key,
            direction: oD
        });
    };

    const handlePageChange = (e: any, pageNumber: number) => {
        updatePageable({
            ...currentPageable,
            pageNumber: pageNumber
        });
    };

    const handleRowsPerPageChange = (e: any) => {
        updatePageable({
            ...currentPageable,
            pageSize: e.target.value as number
        });
    };

    const updatePageable = (settings: PagingSettings<keyof typeof columns>) => {
        onPageableChange(settings);
    }

    const toggleColumnSettings = () => setShowColumnSettings(!showColumnSettings);

    const handleColumnsChange = (sortKey: keyof typeof columns, show: boolean) => {
        onColumnsChange({
            ...columns,
            [sortKey]: {
                ...columns[sortKey],
                show
            }
        })
    }

    const classes = useStyles();
    return (
        <Fragment>
            {!currentPage && (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={3}>
                    <CircularProgress />
                </Box>
            )}
            {currentPage && (
                <Fragment>
                    <Box p={1}>
                        <Grid container>
                            <Grid item className={classes.filterColumn}>
                                {onFilterClick && (
                                    <IconButton onClick={onFilterClick}>
                                        <FilterListIcon />
                                    </IconButton>
                                )}
                                <Box mx={1} />
                                {renderFilterOptions && ( renderFilterOptions )}
                            </Grid>
                            <Grid item>
                                <IconButton onClick={toggleColumnSettings}>
                                    <TuningIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead className={classes.tableHead}>
                                <TableRow>
                                    {Object.keys(columns).filter(k => columns[k].show).map((k) => (
                                        <TableCell key={'data-table-' + k} align={columns[k].align}>
                                            {!columns[k].unsortable && (
                                                <TableSortLabel
                                                    active={currentPageable.sort === k}
                                                    direction={currentPageable.sort === k ? currentPageable.direction : 'asc'}
                                                    onClick={() => handleSortColumn(k)}
                                                >
                                                    {columns[k].name}
                                                </TableSortLabel>
                                            )}
                                            {columns[k].unsortable && (columns[k].name)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.tableBody}>
                                {currentPage.content.length === 0 && (
                                    renderEmptyContent ?
                                        (<Fragment>{renderEmptyContent}</Fragment>) :
                                        (
                                            <TableRow className={'empty'}>
                                                <TableCell colSpan={Object.keys(columns).length}>
                                                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={3}>
                                                        <div className={classes.graphic}>
                                                            <UndrawEmpty />
                                                        </div>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                )}
                                {renderTableBody}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={currentPage.totalElements}
                        rowsPerPage={currentPageable.pageSize}
                        page={currentPageable.pageNumber}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                    {inProgress && (
                        <LinearProgress variant="indeterminate" />
                    )}
                    <Dialog fullWidth maxWidth="sm" open={showColumnSettings}>
                        <DialogContent>
                            {Object.keys(columns).map((k, i) => (
                                <FormControlLabel key={'column-setting-' + i} label={columns[k].name}
                                                  color="primary"
                                                  control={<Checkbox checked={columns[k].show} onChange={e => handleColumnsChange(k, e.target.checked)} />}
                                />
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={toggleColumnSettings}>OK</Button>
                        </DialogActions>
                    </Dialog>
                </Fragment>
            )}
        </Fragment>
    )
}