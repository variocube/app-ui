import * as React from "react";
import {useCallback} from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Container,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {
    CompactFormat,
    createLocalizationContext,
    CurrencyFormat,
    TemporalFormat,
    TemporalFormatProps,
    DecimalFormat,
    PlainDate,
    PlainDateTime,
    PlainTime,
} from "../../src";
import {Temporal} from "@js-temporal/polyfill";
import ZonedDateTime = Temporal.ZonedDateTime;
import Instant = Temporal.Instant;

const {LocalizationProvider, useLocalization} = createLocalizationContext<typeof import("./en.json")>({
    load: language => import(`./${language}.json`),
    fallback: "en"
});

export const Localization = () => (
    <Container>
        <Typography variant="h1" gutterBottom>Localization</Typography>

        <Box my={4}>
            <Typography variant="h2" gutterBottom>Translations</Typography>

            <LocalizationProvider>
                <TranslationDemo/>
            </LocalizationProvider>
        </Box>

        <Box my={4}>
            <Typography variant="h2" gutterBottom>Number formats</Typography>
            <Typography variant="body1" gutterBottom>
                Display numbers according to the user's locale settings.
            </Typography>

            <NumberDemo/>

        </Box>

        <Box my={4}>
            <Typography variant="h2" gutterBottom>Date & time formats</Typography>
            <Typography variant="body1" gutterBottom>
                Display dates & times according to the user's locale settings.
            </Typography>

            <DateTimeDemo/>
        </Box>

    </Container>
);

export function TranslationDemo() {
    const {t, e, language, setLanguage} = useLocalization();

    const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setLanguage(e.currentTarget.value), []);

    return (
        <Card>
            <CardHeader title="Example"/>
            <CardContent>
                <RadioGroup row value={language} onChange={handleLanguageChange}>
                    <FormControlLabel value="en" control={<Radio/>} label="English"/>
                    <FormControlLabel value="de" control={<Radio/>} label="Deutsch"/>
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
    );
}

function NumberDemo() {
    return (
        <Stack spacing={2} direction="row">

            <Card>
                <CardHeader title="CurrencyFormat"/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Amount</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>1234.5</TableCell>
                            <TableCell>USD</TableCell>
                            <TableCell>
                                <CurrencyFormat value={1234.5} currency="USD"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>5432.1</TableCell>
                            <TableCell>EUR</TableCell>
                            <TableCell>
                                <CurrencyFormat value={5432.1} currency="EUR"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>1000</TableCell>
                            <TableCell>GBP</TableCell>
                            <TableCell>
                                <CurrencyFormat value={1000} currency="GBP"/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>

            <Card>
                <CardHeader title="DecimalFormat"/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Number</TableCell>
                            <TableCell>Fraction digits</TableCell>
                            <TableCell>Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>2929</TableCell>
                            <TableCell>not specified</TableCell>
                            <TableCell>
                                <DecimalFormat value={2929}/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>234.3333</TableCell>
                            <TableCell>2</TableCell>
                            <TableCell>
                                <DecimalFormat value={234.3333} fractionDigits={2}/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>2929</TableCell>
                            <TableCell>2</TableCell>
                            <TableCell>
                                <DecimalFormat value={2929} fractionDigits={2}/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>

            <Card>
                <CardHeader title="CompactFormat"/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Number</TableCell>
                            <TableCell>Display</TableCell>
                            <TableCell>Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>1234567890</TableCell>
                            <TableCell>not specified</TableCell>
                            <TableCell>
                                <CompactFormat value={1234567890}/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>100000</TableCell>
                            <TableCell>short</TableCell>
                            <TableCell>
                                <CompactFormat value={100000} compactDisplay="short"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>1000.1</TableCell>
                            <TableCell>long</TableCell>
                            <TableCell>
                                <CompactFormat value={1000.1} compactDisplay="long"/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
        </Stack>

    );
}


function DateTimeDemo() {
    const examples: TemporalFormatProps[] = [
        {value: PlainDate.from("2022-06-21")},
        {value: PlainDate.from("2022-06-21"), dateStyle: "full"},
        {value: PlainTime.from({hour: 14, minute: 22})},
        {value: PlainTime.from({hour: 14, minute: 22}), timeStyle: "full"},
        {value: PlainDateTime.from("2022-06-21T14:22")},
        {value: ZonedDateTime.from("2022-06-21T14:22:11[MET]")},
        {value: ZonedDateTime.from("2022-06-21T14:22:11[MET]"), dateStyle: "medium", timeStyle: "long"},
        {value: Instant.from("2022-06-21T14:22:11Z")},
        {value: Instant.from("2022-06-21T14:22:11Z"), dateStyle: "full", timeStyle: "full"}
    ];
    return (
        <Card>
            <CardHeader title="TemporalFormat"/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Value</TableCell>
                        <TableCell>dateStyle</TableCell>
                        <TableCell>timeStyle</TableCell>
                        <TableCell>Result</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {examples.map((props, index) => (
                    <TableRow key={index}>
                        <TableCell>{props.value?.toString()}</TableCell>
                        <TableCell>{props.dateStyle || "(undefined)"}</TableCell>
                        <TableCell>{props.timeStyle || "(undefined)"}</TableCell>
                        <TableCell>
                            <TemporalFormat {...props} />
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </Card>
    );
}
