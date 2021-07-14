import React, {Fragment, ReactComponentElement, useState} from "react";
import {
    Box,
    Button, Checkbox,
    CircularProgress,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    Grid,
    IconButton,
    LinearProgress,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Theme
} from "@material-ui/core";
import {Page, Paging, PagingSettings} from "../Paging";
import {FilterListIcon, TuningIcon} from "../icons";
import {default as emptyGraphic} from "./undraw_empty_xct9.svg";

const useStyles = makeStyles((theme: Theme) => createStyles({
    tableHead: {
        background: theme.palette.grey['200']
    },
    tableBody: {
        '& > tr:not(.empty)': {
            cursor: 'pointer',
            '&:hover': {
                background: `${theme.palette.grey['50']} !important`
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
    paging: Paging,
    columns: ColumnType,
    onPagingChange: (pageable: PagingSettings<keyof ColumnType>) => void,
    onColumnsChange: (columns: ColumnType) => void,
    page?: Page<T>,
    inProgress?: boolean,
    onFilterClick?: () => void,
    renderEmptyContent?: ReactComponentElement<any>,
    renderTableBody?: ReactComponentElement<any>,
    renderFilterOptions?: ReactComponentElement<any>
}

export const ContentTable = <T extends unknown>({page, paging, columns, onPagingChange, onColumnsChange, inProgress, onFilterClick, renderEmptyContent, renderTableBody, renderFilterOptions}: ContentTableProps<T>) => {
    const [pagingSettings, setPagingSettings] = useState<PagingSettings<keyof typeof columns>>(paging.getSettings());
    const [showColumnSettings, setShowColumnSettings] = useState(false);

    const handleSortColumn = (key: keyof typeof columns) => {
        const {sort, direction} = pagingSettings;
        let oD: 'desc'|'asc';
        if (sort == key) {
            oD = direction === 'desc' ? 'asc' : 'desc';
        } else {
            oD = 'desc';
        }
        updatePaging({
            ...pagingSettings,
            sort: key,
            direction: oD
        });
    };

    const handlePageChange = (e: any, pageNumber: number) => {
        updatePaging({
            ...pagingSettings,
            pageNumber: pageNumber
        });
    };

    const handleRowsPerPageChange = (e: any) => {
        updatePaging({
            ...pagingSettings,
            pageSize: e.target.value as number
        });
    };

    const updatePaging = (settings: PagingSettings<keyof typeof columns>) => {
        setPagingSettings(settings);
        paging.updateSettings(settings);
        onPagingChange(settings);
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
            {!page && (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={3}>
                    <CircularProgress />
                </Box>
            )}
            {page && (
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
                                                    active={pagingSettings.sort === k}
                                                    direction={pagingSettings.sort === k ? pagingSettings.direction : 'asc'}
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
                                {page.content.length === 0 && (
                                    renderEmptyContent ?
                                        (<Fragment>{renderEmptyContent}</Fragment>) :
                                        (
                                            <TableRow className={'empty'}>
                                                <TableCell colSpan={Object.keys(columns).length}>
                                                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={3}>
                                                        <img src={emptyGraphic} alt="Empty" className={classes.graphic} />
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
                        count={page.totalElements}
                        rowsPerPage={pagingSettings.pageSize}
                        page={page.number || 0}
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