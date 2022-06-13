import * as React from "react";
import {Fragment, useState} from "react";
import {Chip, Container, Paper, TableCell, TableRow, Typography} from "@mui/material";
import {ContentTable, Page, Paging, PagingImpl} from "../../src";

const baseColumns = {
    "foo": {show: true, name: "Foo"},
    "bar": {show: true, name: "Bar"}
};

export const ContentTableDemo = () => {
    const [page, setPage] = useState<Page<{ foo: string, bar: string }>>({
        content: [
            {foo: "Foo 1", bar: "Bar 1"},
            {foo: "Foo 2", bar: "Bar 2"},
            {foo: "Foo 3", bar: "Bar 3"}
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
        <Container maxWidth="lg">
            <Typography variant="h1" gutterBottom>Content Table</Typography>
            <Paper>
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
                                          </TableRow>
                                      ))}
                                  </Fragment>
                              )}
                />
            </Paper>
        </Container>
    );
};
