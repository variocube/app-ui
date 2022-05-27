import * as React from "react";
import {useCallback} from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Container,
    FormControlLabel,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {createLocalizationContext} from "../../src";

const {LocalizationProvider, useLocalization} = createLocalizationContext<typeof import("./en.json")>({
    load: language => import(`./${language}.json`),
    fallback: "en"
});

export const Localization = () => (
    <Container>
        <Typography variant="h1" gutterBottom>Localization</Typography>

        <LocalizationProvider>
            <Example/>
        </LocalizationProvider>
    </Container>
);

export function Example() {
    const {t, e, language, setLanguage} = useLocalization();

    const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setLanguage(e.currentTarget.value), []);

    return (
        <Card>
            <CardHeader title="Example"/>
            <CardContent>
                <RadioGroup row value={language} onChange={handleLanguageChange}>
                    <FormControlLabel value="en" control={<Radio />} label="English" />
                    <FormControlLabel value="de" control={<Radio />} label="Deutsch" />
                </RadioGroup>
            </CardContent>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{width: "50%"}}>Code</TableCell>
                        <TableCell>Output</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell><code>t("nested.foo")</code></TableCell>
                        <TableCell>{t("nested.foo")}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><code>t("greeting", {"{"}name: "John"{"}"})</code></TableCell>
                        <TableCell>{t("greeting", {name: "John"})}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><code>e("state", "pending")</code></TableCell>
                        <TableCell>{e("state", "pending")}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    )
}

