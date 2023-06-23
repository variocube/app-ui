import {
    Box,
    Paper,
    SortDirection,
    Table,
    TableBody,
    TableCell,
    TableCellProps,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    useTheme
} from "@mui/material";
import React, {Component, FC, Fragment, Key, useCallback} from "react";
import {ErrorAlert} from "../ErrorAlert";
import {UndrawEmpty} from "../content-table/UndrawEmpty";


export type LabelFunc<T> = (field: keyof T) => string;

export interface DataTableColumn<T> {
    field: string;
    label: string | LabelFunc<T>;
    width?: string;
    align?: TableCellProps["align"];
    sortable?: boolean;
    component?: FC<DataTableCellProps<T>>;
}

export interface DataTableCellProps<T> {
    row: T;
    field: string;
}

export interface DataTablePage {
    /** The total number of elements. */
    totalElements: number;

    /**
     * The zero-based index of the current page.
     */
    pageIndex: number;

    /** The current page size. */
    pageSize: number;
}

export interface DataTableProps<T> {
    /** The columns to display. */
    columns: ReadonlyArray<DataTableColumn<T>>;

    /** The rows to display. */
    rows: ReadonlyArray<T>;

    /** The field by which the rows are currently sorted. */
    sortField?: string;

    /** The direction by which the rows are currently sorted. */
    sortDirection?: SortDirection;

    /** Callback that is invoked when the user wants to sort by a specific field. */
    onSort?: (field: string) => any;

    /** Whether the data is currently loading. */
    loading?: boolean;

    /** Whether an error has occured. */
    error?: any;

    /** The property that uniquely identifies a row (default: "id"). */
    rowId?: string;

    /** Information about the current page. Enables pagination if set. */
    page?: DataTablePage;

    /** Callback that is invoked when the user changes pages. */
    onPageChange?: (page: DataTablePage) => void;

    /** The available page sizes. */
    pageSizes?: number[];
}

const defaultPageSizes = [10, 25, 50, 100];

export function DataTable<T>(props: DataTableProps<T>) {
    const {
        columns,
        rows,
        onSort,
        sortDirection,
        sortField,
        loading,
        error,
        rowId = "id",
        page,
        onPageChange,
        pageSizes = defaultPageSizes,
    } = props;

    const theme = useTheme();

    function handlePageChange(event: React.MouseEvent<HTMLButtonElement> | null, pageIndex: number) {
        if (page && onPageChange) {
            onPageChange({...page, pageIndex});
        }
    }

    function handleRowsPerPageChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        const pageSize = Number.parseInt(event.target.value);
        if (page && onPageChange) {
            onPageChange({...page, pageSize});
        }
    }

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <DataTableHeaderCell
                                    key={column.field}
                                    column={column}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSort={onSort}
                                />
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{minHeight: "100px", opacity: loading ? 0.5 : undefined}}>
                        {error && (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <ErrorAlert error={error} />
                                </TableCell>
                            </TableRow>
                        )}
                        {!error && rows.length == 0 && (
                            <TableCell colSpan={columns.length}>
                                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={3}>
                                    <Box sx={{
                                        height: 300,
                                        [theme.breakpoints.down('md')]: {
                                            height: 150
                                        },
                                    }}>
                                        <UndrawEmpty height="100%" width="auto" />
                                    </Box>
                                </Box>
                            </TableCell>
                        )}
                        {rows.map(row => {
                            const id = row[rowId as keyof T] as any as Key;
                            return (
                                <TableRow key={id}>
                                    {columns.map(({field, component, align}) => {
                                        const Component = component ?? DefaultDataTableCell;

                                        return (
                                            <TableCell align={align}>
                                                <Component row={row} field={field}/>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {page && (
                <TablePagination
                    component="div"
                    rowsPerPageOptions={pageSizes}
                    count={page.totalElements}
                    rowsPerPage={page.pageSize}
                    page={page.pageIndex}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            )}

        </Paper>
    )
}

export function DefaultDataTableCell<T>({row, field}: DataTableCellProps<T>) {
    const value = row[field as keyof T];
    if (typeof value == "string" || typeof value == "number") {
        return <Fragment>{value}</Fragment>;
    }
    return null;
}

interface DataTableHeaderCellProps<T> {
    column: DataTableColumn<T>;
    sortField?: string;
    sortDirection?: SortDirection;
    onSort?: (field: string) => void;
}

function DataTableHeaderCell<T>(props: DataTableHeaderCellProps<T>) {
    const {column, sortField, sortDirection, onSort} = props;

    const handleClick = useCallback(() => column.sortable && onSort && onSort(column.field), [onSort, column]);

    return (
        <TableCell style={{width: column.width}} align={column.align}>
            {column.sortable
                ? (
                    <TableSortLabel
                        active={sortField == column.field}
                        direction={sortDirection || undefined}
                        onClick={handleClick}
                    >
                        {column.label}
                    </TableSortLabel>
                )
                : column.label}
        </TableCell>
    );
}