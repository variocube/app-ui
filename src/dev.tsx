import * as React from "react"
import * as ReactDOM from "react-dom";
import {Box, Chip, CssBaseline, Paper, TableCell, TableRow} from "@material-ui/core";
import {AppNavbar} from "./AppNavbar";
import {VCLogo} from "./VCLogo";
import {AppContainer} from "./AppContainer";
import {Page, Paging, PagingImpl} from "./Paging";
import {Fragment, useEffect, useState} from "react";
import {Selector} from "./Input";
import {ContentTable} from "./ContentTable";

const baseColumns = {
    'foo': { show: true, name: 'Foo'},
    'bar': { show: true, name: 'Bar'}
}

export const DevApp = () => {
    const [page, setPage] = useState<Page<{foo: string, bar: string}>>({
        content: [
            {foo: 'Foo 1', bar: 'Bar 1'},
            {foo: 'Foo 2', bar: 'Bar 2'},
            {foo: 'Foo 3', bar: 'Bar 3'}
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
    const [paging, setPaging] = useState<Paging>(new PagingImpl('dev_paging'));
    const [columns, setColumns] = useState(baseColumns);
    const [inProgress, setInProgress] = useState<boolean>(false);
    const [selectInput, setSelectInput] = useState<string>();

    useEffect(() => {
        setTimeout(() => {
            setSelectInput('B');
        }, 5000);
    }, [])

    const handlePagingChange = () => {
        setInProgress(true);
        setTimeout(() => {
            setInProgress(false)
        }, 1500);
    }

    const showCell = (column: keyof typeof columns) => columns[column] && columns[column].show;

    return (
        <div>
            <CssBaseline/>
            <AppNavbar navItems={[
                            { title: 'Home' },
                            { title: 'Menu 1', active: true, prioritised: true },
                            { title: 'Menu 2' },
                            { title: 'Menu 3', prioritised: true }
                        ]}
                       logoPath={VCLogo}
                       appName="Test App"
            />
            <AppContainer>
                <Paper>
                    <ContentTable page={page} pageable={paging.getSettings()}
                                  inProgress={inProgress}
                                  columns={columns}
                                  onPageableChange={handlePagingChange}
                                  onColumnsChange={c => setColumns(c as any)}
                                  onFilterClick={() => {}}
                                  renderFilterOptions={<Chip label="Foo" onDelete={() => {}}/>}
                                  renderTableBody={(
                                      <Fragment>
                                          {page.content.map((item, index) => (
                                              <TableRow key={'item-' + index}>
                                                  {showCell('foo') && <TableCell>{item.foo}</TableCell>}
                                                  {showCell('bar') && <TableCell>{item.bar}</TableCell>}
                                              </TableRow>
                                          ))}
                                      </Fragment>
                                  )}
                    />
                </Paper>

                <Box my={3}/>

                <Paper>
                    <Box p={2}>
                        <Selector label={'Custom Selector'} value={selectInput}
                                  onChange={v => setSelectInput(v)} options={[{label: 'A', value: 'A'}, {label: 'B', value: 'B'}]}
                        />
                    </Box>
                </Paper>
            </AppContainer>
        </div>
    )
}

ReactDOM.render(
    <DevApp />,
    document.getElementById("content")
);