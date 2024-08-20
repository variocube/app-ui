import React from "react";
import {useFlag} from "../utils";
import {RelativeTemporalFormatProps, useRelativeTemporalFormat} from "./RelativeTemporalFormat";
import {TemporalFormatProps, useTemporalFormat} from "./TemporalFormat";

export type SwitchableTemporalFormatProps = TemporalFormatProps & RelativeTemporalFormatProps;

export function SwitchableTemporalFormat(props: SwitchableTemporalFormatProps) {
	const [isRelative, , , toggleRelative] = useFlag(true);
	const relative = useRelativeTemporalFormat(props);
	const absolute = useTemporalFormat(props);
	return (
		<abbr title={isRelative ? absolute : relative} onClick={toggleRelative}>
			{isRelative ? relative : absolute}
		</abbr>
	);
}
