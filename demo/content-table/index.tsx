import * as React from "react";
import {Fragment, useState} from "react";
import {Chip, Container, Paper, TableCell, TableRow, Typography} from "@mui/material";
import {ContentTable, Page, Paging, PagingImpl} from "../../src";

const baseColumns = {
    "foo": {show: true, name: "Foo"},
    "bar": {show: true, name: "Bar"},
    "col1": {show: true, name: "Col 1"},
    "col2": {show: true, name: "Col 2"},
    "col3": {show: true, name: "Col 3"},
    "col4": {show: true, name: "Col 4"},
};

export const ContentTableDemo = () => {
    const [page, setPage] = useState<Page<{ foo: string, bar: string, col1: string, col2: string, col3: string, col4: string }>>({
        content: [
            {foo: "Foo 1", bar: "Bar 1", col1: "Col 1 - 1", col2: "Col 2 - 1", col3: "Col 3 - 1", col4: "col 4 - 1 - LOREM IPSUM SIT DOLOR"},
            {foo: "Foo 2", bar: "Bar 2", col1: "Col 1 - 1", col2: "Col 2 - 1", col3: "Col 3 - 1", col4: "col 4 - 1 - LOREM IPSUM SIT DOLOR"},
            {foo: "Foo 3", bar: "Bar 3", col1: "Col 1 - 1", col2: "Col 2 - 1", col3: "Col 3 - 1", col4: "col 4 - 1 - LOREM IPSUM SIT DOLOR"},
        ],
        first: true,
        hasContent: true,
        hasNext: false,
        hasPrevious: false,
        last: true,
        number: 0,
        numberOfElements: 3,
        size: 25,
        totalElements: 3,
        totalPages: 1
    });
    const [paging, setPaging] = useState<Paging>(new PagingImpl("dev_paging"));
    const [columns, setColumns] = useState(baseColumns);
    const [inProgress, setInProgress] = useState<boolean>(false);

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
            <ContentTable page={page} pageable={paging.getSettings()}
                          inProgress={inProgress}
                          columns={columns}
                          onPageableChange={handlePagingChange}
                          onColumnsChange={c => setColumns(c as any)}
                          onFilterClick={() => {
                          }}
                          renderFilterOptions={<Chip label="Foo" onDelete={() => {
                          }}/>}
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
