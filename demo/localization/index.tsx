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
    DecimalFormat,
    Instant,
    Now,
    PlainDate,
    PlainDateTime,
    PlainTime,
    RelativeTemporalFormat,
    RelativeTemporalFormatProps,
    TemporalFormat,
    TemporalFormatProps, TemporalRangeFormat, TemporalRangeFormatProps,
    ZonedDateTime,
} from "../../src";

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
    const temporals: TemporalFormatProps[] = [
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

    const durations: RelativeTemporalFormatProps[] = [
        {value: Now.plainDateISO().subtract({years: 2, days: 45})},
        {value: Now.plainDateISO().subtract({days: -1}), numeric: "auto"},
        {value: Now.plainDateTimeISO().add({weeks: 4, minutes: 3}), style: "narrow"},
        {value: Now.plainDateTimeISO().subtract({seconds: 2}), style: "narrow"},
        {value: Now.zonedDateTimeISO().subtract({days: 3})},
        {value: Now.instant().subtract({milliseconds: 493284})},
        {value: Now.instant().add({hours: 17249})},
    ];

    const ranges: TemporalRangeFormatProps[] = [
        {from: Now.plainDateISO(), until: Now.plainDateISO().add({days: 3})},
        {from: Now.plainDateTimeISO().subtract({hours: 3}), until: Now.plainDateTimeISO().add({minutes: 22})},
        {from: ZonedDateTime.from("2022-06-28T22:52:00[MET]"), until: ZonedDateTime.from("2022-06-29T16:52:00[MET]")},
        {from: Instant.from("2022-06-28T23:00:00Z"), until: Instant.from("2022-06-28T23:00:00Z")},
    ];

    return (
        <Stack spacing={2}>
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
                        {temporals.map((props, index) => (
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

            <Card>
                <CardHeader title="RelativeTemporalFormat"/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Value</TableCell>
                            <TableCell>numeric</TableCell>
                            <TableCell>style</TableCell>
                            <TableCell>Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {durations.map((props, index) => (
                            <TableRow key={index}>
                                <TableCell>{props.value?.toString()}</TableCell>
                                <TableCell>{props.numeric || "(undefined)"}</TableCell>
                                <TableCell>{props.style || "(undefined)"}</TableCell>
                                <TableCell>
                                    <RelativeTemporalFormat {...props} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Card>
                <CardHeader title="TemporalRangeFormat"/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>from</TableCell>
                            <TableCell>until</TableCell>
                            <TableCell>dateStyle</TableCell>
                            <TableCell>timeStyle</TableCell>
                            <TableCell>Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ranges.map((props, index) => (
                            <TableRow key={index}>
                                <TableCell>{props.from?.toString()}</TableCell>
                                <TableCell>{props.until?.toString()}</TableCell>
                                <TableCell>{props.dateStyle || "(undefined)"}</TableCell>
                                <TableCell>{props.timeStyle || "(undefined)"}</TableCell>
                                <TableCell>
                                    <TemporalRangeFormat {...props} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </Stack>

    );
}
