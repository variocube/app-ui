import {Box, Container, SortDirection, Stack, Typography} from "@mui/material";
import React, {useMemo, useState} from "react";
import {
    DataTable,
    DataTablePage,
    SpringPage,
    SpringPageable,
    useDataTableStorage,
    useSpringPage,
    useSpringPageable
} from "../../src";
import {useAsync} from "react-async-hook";

export function DataTableDemo() {
    return (
        <Container>
            <Typography variant="h1" gutterBottom>
                Data Table
            </Typography>
            <Typography variant="body1" gutterBottom>
                Data table is alternative approach to ContentTable.{" "}
            </Typography>

            <Stack spacing={4}>
                <SimpleDataTable/>
                <EmptyDataTable/>
                <SortableDataTable/>
                <PagingDataTable/>
                <SpringDataTable/>
            </Stack>
        </Container>
    )
}

interface Fruit {
    id: number;
    name: string;
    color: string;
    taste: string;
}

const fruits: Fruit[] = [
    {id: 1, name: "Banana", color: "yellow", taste: "sweet"},
    {id: 2, name: "Apple", color: "green", taste: "sour"},
    {id: 3, name: "Orange", color: "orange", taste: "fruity"},
    {id: 4, name: "Cherry", color: "red", taste: "sweet"},
];

export function SimpleDataTable() {
    return (
        <Box>
            <Typography variant="h2" gutterBottom>
                Simple data table
            </Typography>
            <DataTable
                columns={[
                    {label: "ID", field: "id"},
                    {label: "Name", field: "name"},
                    {label: "Color", field: "color"},
                    {label: "Taste", field: "taste"}
                ]}
                rows={fruits}
            />
        </Box>
    )
}


export function EmptyDataTable() {
    return (
        <Box>
            <Typography variant="h2" gutterBottom>
                Empty data table
            </Typography>
            <DataTable
                columns={[
                    {label: "ID", field: "id"},
                    {label: "Name", field: "name"},
                    {label: "Color", field: "color"},
                    {label: "Taste", field: "taste"}
                ]}
                rows={[]}
            />
        </Box>
    )
}

function compareFruits(a: Fruit, b: Fruit, sortField: keyof Fruit, sortDirection: SortDirection) {
    const factor = sortDirection == "desc" ? -1 : 1;
    if (sortField == "id") {
        return factor * (a[sortField] - b[sortField]);
    }
    else {
        return factor * (a[sortField].localeCompare(b[sortField]));
    }
}

export function SortableDataTable() {
    const [sortField, setSortField] = useState<keyof Fruit>("id");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const sortedFruits = useMemo(() => fruits.sort(
        (a, b) => compareFruits(a, b, sortField, sortDirection))
        , [sortField, sortDirection]);

    function handleSort(field: string) {
        if (sortField == field) {
            setSortDirection(prev => prev == "desc" ? "asc" : "desc");
        }
        else {
            setSortDirection("asc");
            setSortField(field as keyof Fruit);
        }
    }

    return (
        <Box>
            <Typography variant="h2" gutterBottom>
                Sortable data table
            </Typography>
            <DataTable
                columns={[
                    {label: "ID", field: "id", sortable: true},
                    {label: "Name", field: "name", sortable: true},
                    {label: "Color", field: "color", sortable: true},
                    {label: "Taste", field: "taste", sortable: true}
                ]}
                rows={sortedFruits}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
            />
        </Box>
    )
}


export function PagingDataTable() {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(2);

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const pageFruits = fruits.slice(start, end);

    function handlePageChange({pageIndex, pageSize}: DataTablePage) {
        setPageIndex(pageIndex);
        setPageSize(pageSize);
    }

    return (
        <Box>
            <Typography variant="h2" gutterBottom>
                Paging data table
            </Typography>
            <DataTable
                columns={[
                    {label: "ID", field: "id"},
                    {label: "Name", field: "name"},
                    {label: "Color", field: "color"},
                    {label: "Taste", field: "taste"}
                ]}
                rows={pageFruits}
                page={{
                    pageIndex,
                    pageSize,
                    totalElements: fruits.length
                }}
                pageSizes={[1, 2, 3]}
                onPageChange={handlePageChange}
            />
        </Box>
    )
}


function fakeSpringFetch(pageable: SpringPageable) {
    return new Promise<SpringPage<Fruit>>((resolve) => {
        setTimeout(() => {
            console.log("pageable", pageable);
            const {page = 0, size = 10} = pageable;
            resolve({
                content: fruits.map(fruit => ({...fruit, id: page * size + fruit.id})),
                totalElements: 1000,
                number: page,
                size: size,
            } as SpringPage<Fruit>)
        }, 200);
    });
}

export function SpringDataTable() {
    const {onPageChange, onSort, ...storage} = useDataTableStorage("SpringDataTable", {
        pageSize: 4,
    });
    const pageable = useSpringPageable(storage);
    const {loading, error, result} = useAsync(() => fakeSpringFetch(pageable), [pageable]);
    const {rows, page} = useSpringPage(result);

    return (
        <Box>
            <Typography variant="h2" gutterBottom>
                Spring data table
            </Typography>
            <Typography variant="body1" gutterBottom>
                This data table emulates fetching from a Spring REST-API
                using the <code>Pageable</code> and <code>Page</code> data types.
            </Typography>
            <DataTable
                columns={[
                    {label: "ID", field: "id"},
                    {label: "Name", field: "name"},
                    {label: "Color", field: "color"},
                    {label: "Taste", field: "taste"}
                ]}
                rows={rows}
                page={page}
                loading={loading}
                error={error}
                pageSizes={[4]}
                onSort={onSort}
                onPageChange={onPageChange}
            />
        </Box>
    )
}