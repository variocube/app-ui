import React, {useEffect} from "react";
import {Container, Typography} from "@mui/material";
import {ErrorBoundary} from "../../src";

export function DemoError() {

    function getUser() {
        return {
            id: 'demo',
            name: 'Demo User'
        }
    }

    return (
        <Container maxWidth="md">
            <ErrorBoundary
                /*bugsnagConfig={{
                    // logistics api key in bugsnag
                    apiKey: '085401950bf014c07f680aea32aa2ede',
                    getUser
                }}*/
                anonymizeStorageKeyPatterns={['auth', 'credentials']}
            >
                <ErrorContent />
            </ErrorBoundary>
        </Container>
    )
}

function ErrorContent() {

    useEffect(() => {
        let foo: any;
        let bar = foo.bar;
        console.log('bar', bar);
    }, [])

    return (
        <div>
            <Typography variant="h1">YOU CAN'T SEE ME</Typography>
            <img src="https://i.imgur.com/TaLcpjR.jpg" alt="THE TIME IS NOW"/>
        </div>
    )
}