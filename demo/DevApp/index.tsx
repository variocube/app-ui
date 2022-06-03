import * as React from "react";
import {Fragment, useEffect, useState} from "react";
import {Box, Button, Chip, Grid, Paper, TableCell, TableRow} from "@mui/material";
import {
    AppContainer,
    AppNavbar,
    AppSidebar,
    AppSidebarItem,
    CategoryIcon,
    ContentTable,
    DatePicker,
    DateTimePicker,
    Page,
    Paging,
    PagingImpl,
    Selector,
    ThemeModeSwitcher,
    usePaletteMode,
    VCLogo,
    VCLogoWhite,
    VCThemeProvider
} from "../../src";

const baseColumns = {
    "foo": {show: true, name: "Foo"},
    "bar": {show: true, name: "Bar"}
};

export const DevApp = () => {
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
    const [selectInput, setSelectInput] = useState<string>();

    useEffect(() => {
        setTimeout(() => {
            setSelectInput("B");
        }, 5000);
    }, []);

    const handlePagingChange = () => {
        setInProgress(true);
        setTimeout(() => {
            setInProgress(false);
        }, 1500);
    };

    const showCell = (column: keyof typeof columns) => columns[column] && columns[column].show;

    const {mode} = usePaletteMode();

    return (
        <VCThemeProvider>
            <AppNavbar navItems={[
                {title: "Home"},
                {title: "Menu 1", active: true, prioritised: true},
                {title: "Menu 2"},
                {title: "Menu 3", prioritised: true}
            ]}
                       logo={mode === "light" ? <VCLogo/> : <VCLogoWhite/>}
                       appName="Test App"
            />
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <AppSidebar>
                    <AppSidebarItem label="Nav Item 1" icon={<CategoryIcon/>}/>
                    <AppSidebarItem label="Nav Item 2" icon={<CategoryIcon/>} active/>
                    <AppSidebarItem label="Nav Item 3" icon={<CategoryIcon/>}/>
                </AppSidebar>
                <AppContainer fullWidth>
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

                    <Box my={3}/>

                    <Paper>
                        <Box p={2}>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <Selector label={"Custom Selector"} value={selectInput}
                                              onChange={v => setSelectInput(v)}
                                              options={[{label: "A", value: "A"}, {label: "B", value: "B"}]}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DateTimePicker label="Date & Time"
                                                    format="MMMM dd HH:mm"
                                                    value={new Date()}
                                                    onChange={v => console.log(v)}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <DatePicker label="Day picker"
                                                format={"d/MM/yyyy"}
                                                value={new Date()}
                                                onChange={v => {
                                                }}
                                    />
                                </Grid>
                            </Grid>


                        </Box>
                    </Paper>

                    <Box my={3}/>

                    <Paper sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Button variant="contained" color="primary">Primary Btn</Button>
                        <Box mx={1}/>
                        <Button variant="contained" color="secondary">Secondary Btn</Button>
                        <Box mx={1}/>
                        <Button variant="outlined" color="primary">Primary Btn</Button>
                        <Box mx={1}/>
                        <Button variant="outlined" color="secondary">Secondary Btn</Button>
                        <Box mx={1}/>
                        <ThemeModeSwitcher/>
                    </Paper>
                </AppContainer>
            </Box>
        </VCThemeProvider>
    );
};
