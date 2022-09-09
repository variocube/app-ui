import * as React from "react";
import {Fragment, useMemo, useState} from "react";
import {Box, Chip, Container, TableCell, TableRow, Typography} from "@mui/material";
import {Checkbox, ContentTable, Page, Paging, PagingImpl} from "../../src";

const baseColumns = {
    "foo": {show: true, name: "Foo"},
    "bar": {show: true, name: "Bar"},
    "col1": {show: true, name: "Col 1"},
    "col2": {show: true, name: "Col 2"},
    "col3": {show: true, name: "Col 3"},
    "col4": {show: true, name: "Col 4"},
};

const ROWS = [
    {foo: "Foo 1", bar: "Bar 1", col1: "Col 1 - 1", col2: "Col 2 - 1", col3: "Col 3 - 1", col4: "col 4 - 1 - LOREM IPSUM SIT DOLOR"},
    {foo: "Foo 2", bar: "Bar 2", col1: "Col 1 - 1", col2: "Col 2 - 1", col3: "Col 3 - 1", col4: "col 4 - 1 - LOREM IPSUM SIT DOLOR"},
    {foo: "Foo 3", bar: "Bar 3", col1: "Col 1 - 1", col2: "Col 2 - 1", col3: "Col 3 - 1", col4: "col 4 - 1 - LOREM IPSUM SIT DOLOR"},
];

const PAGE = {
    content: ROWS,
    first: true,
    hasContent: true,
    hasNext: false,
    hasPrevious: false,
    last: true,
    number: 0,
    numberOfElements: ROWS.length,
    size: 25,
    totalElements: ROWS.length,
    totalPages: 1
} as Page<(typeof ROWS)[0]>;

export const ContentTableDemo = () => {
    const [paging, setPaging] = useState<Paging>(new PagingImpl("dev_paging"));
    const [columns, setColumns] = useState(baseColumns);
    const [inProgress, setInProgress] = useState<boolean>(false);
    const [empty, setEmpty] = useState(false);

    const page = useMemo(() => {
        return empty ? {...PAGE, content: [], numberOfElements: 0, totalElements: 0} : PAGE;
    }, [empty]);

    const handlePagingChange = () => {
        setInProgress(true);
        setTimeout(() => {
            setInProgress(false);
        }, 1500);
    };

    const showCell = (column: keyof typeof columns) => columns[column] && columns[column].show;

    return (
        <Container maxWidth="lg" sx={{ overflow: 'auto'}}>
            <Typography variant="h1" gutterBottom>Content Table</Typography>
            <Box p={2}>
                <Checkbox checked={empty} label="Show empty state" onChange={setEmpty} />
            </Box>
            <ContentTable
                page={page}
                pageable={paging.getSettings()}
                inProgress={inProgress}
                columns={columns}
                onPageableChange={handlePagingChange}
                onColumnsChange={c => setColumns(c as any)}
                onFilterClick={() => void 0}
                renderFilterOptions={<Chip label="Foo" onDelete={() => void 0}/>}
                renderTableBody={(
                    <Fragment>
                      {page.content.map((item, index) => (
                          <TableRow key={"item-" + index}>
                              {showCell("foo") && <TableCell>{item.foo}</TableCell>}
                              {showCell("bar") && <TableCell>{item.bar}</TableCell>}
                              {showCell("col1") && <TableCell>{item.col1}</TableCell>}
                              {showCell("col2") && <TableCell>{item.col2}</TableCell>}
                              {showCell("col3") && <TableCell>{item.col3}</TableCell>}
                              {showCell("col4") && <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.col4}</TableCell>}
                          </TableRow>
                      ))}
                    </Fragment>
                )}
            />
        </Container>
    );
};
