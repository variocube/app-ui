import React, {Component, ErrorInfo, Fragment} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from "@mui/material";
import {NotFound} from "./NotFound";
import ErrorStackParser from "error-stack-parser";
import {ExpandMore} from "@mui/icons-material";

type ErrorContext = {
    url: string,
    referrer: string,
    userAgent: string,
    error: any
}

type StackTrace = {
    file?: string,
    lineNumber?: number,
    columnNumber?: number,
    method?: string
}

type BugsnagConfig = {
    apiKey: string,
    notifierName: string,
}

type Props = {
    /**
     * Method to retrieve user data such as Id, Name or Email
     */
    getUser: () => { id?: string, name?: string, email?: string },
    /**
     * List of storage key patterns which values should be anonymized
     */
    anonymizeStorageKeyPatterns?: string[],
    /**
     * Bugsnag configuration
     */
    bugsnagConfig?: BugsnagConfig,
}

type States = {
    hasError: boolean
}

const codeSx = {
    background: '#263238',
    color: '#fff',
    fontSize: '0.8rem',
    padding: 1,
    borderRadius: '3px',
    overflowX: 'auto',
    width: '100%'
};

export class ErrorBoundary extends Component<Props, States> {

    constructor(props: any) {
        super(props);
        this.state = {
            hasError: false
        }
    }

    private static errorContext?: ErrorContext;

    /**
     * This lifecycle is invoked after an error has been thrown by a descendant component.
     * It receives the error that was thrown as a parameter and should return a value to update state.
     * @param error
     * @doc https://reactjs.org/docs/react-component.html#static-getderivedstatefromerror
     */
    static getDerivedStateFromError(error: any) {
        // Store error context
        ErrorBoundary.errorContext = {
            url: location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            error
        };
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('An error occurred', { error, errorInfo });
    }

    async reportBugsnag() {
        if (!this.props.bugsnagConfig) {
            console.warn('Bugsnag not configured. Skip reporting to bugsnag.');
            return;
        }
        if (!ErrorBoundary.errorContext) {
            console.warn('Error context not specified. Cannot report to bugsnag.');
            return;
        }
        const {bugsnagConfig: {apiKey, notifierName}, getUser} = this.props;
        const {error, url, referrer, userAgent} = ErrorBoundary.errorContext;
        const stackTraces: StackTrace[] = ErrorStackParser.parse(error)
            .map(({fileName: file, lineNumber, columnNumber, functionName: method}) => ({
                file,
                lineNumber,
                columnNumber,
                method
            }));
        const payload = {
            apiKey,
            payloadVersion: '5',
            notifier: {
                name: notifierName,
                version: '1.0.11',
                url: 'https://github.com'
            },
            events: [
                {
                    exceptions: [{
                        errorClass: error.message,
                        stacktrace: stackTraces,
                        type: 'browserjs'
                    }],
                    request: {
                        httpMethod: '',
                        url,
                        referrer
                    },
                    user: getUser(),
                    metaData: {
                        userAgent: { userAgent },
                        sessionStorage: sessionStorage,
                        localStorage: localStorage
                    }
                }
            ]
        };

        try {
            const response = await fetch('https://notify.bugsnag.com/', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                console.info('successfully reported error to bugsnag');
            }
        } catch (error) {
            console.log('failed to report error to bugsnag', error)
        }
    }

    renderStorage(storage: Storage) {
        const {anonymizeStorageKeyPatterns= []} = this.props;
        const kv = [];
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key) {
                let value = storage.getItem(key);
                if (value && anonymizeStorageKeyPatterns.find(p => key.indexOf(p) > -1)) {
                    value = "*****";
                }
                kv.push({ key, value });
            }
        }
        if (kv.length === 0) return <Box component="code" sx={{ ...codeSx, mb: 2 }}>NONE</Box>
        return kv
            .sort((x, y) => x.key.localeCompare(y.key))
            .map((o, i) => {
                let value = o.value;
                try {
                    value = JSON.stringify(JSON.parse(value as any), null, 3);
                } catch (error) {
                    console.log('cannot parse value', error)
                }
                return (
                    <Fragment key={'kv-' + i} >
                        <Typography variant="caption">{o.key}</Typography>
                        <Box component="code" sx={{ ...codeSx, mb: 2 }}>
                            {value}
                        </Box>
                    </Fragment>
                )
            })
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        this.reportBugsnag()
            .catch(err => console.error('failed to report to bugsnag', err));

        const {errorContext: { error, url, referrer, userAgent } = {}} = ErrorBoundary;
        return (
            <Box p={3}>
                <NotFound style={{ width: '100%', maxHeight: 300 }} />
                <Box p={4} />
                <Typography variant="h2" align="center">Oops, something went wrong!</Typography>
                <Box p={2} />
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>{error?.message}</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="overline"><strong>URL</strong></Typography>
                        <Box component="code" sx={codeSx}>{url}</Box>
                        <Box my={1} />
                        <Typography variant="overline"><strong>Referrer</strong></Typography>
                        <Box component="code" sx={codeSx}>{referrer}</Box>
                        <Box my={1} />
                        <Typography variant="overline"><strong>User-Agent</strong></Typography>
                        <Box component="code" sx={codeSx}>{userAgent}</Box>
                        <Box my={1} />
                        <Typography variant="overline"><strong>Trace</strong></Typography>
                        <Box component="code" sx={codeSx}>{error?.stack}</Box>
                        <Box my={1} />
                        <Typography variant="overline"><strong>Session Storage</strong></Typography>
                        {this.renderStorage(sessionStorage)}
                        <Box my={1} />
                        <Typography variant="overline"><strong>Local Storage</strong></Typography>
                        {this.renderStorage(localStorage)}
                    </AccordionDetails>
                </Accordion>
            </Box>
        )
    }
}