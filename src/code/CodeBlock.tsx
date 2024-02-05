import {Code, CodeProps} from "./Code";
import React, {PropsWithChildren} from "react";

export type CodeBlockProps = PropsWithChildren<Omit<CodeProps, "block">>;

export function CodeBlock(props: CodeBlockProps) {
    return (
        <Code
            display="block"
            px="0.5em"
            py="0.25em"
            {...props}
        />
    )
}