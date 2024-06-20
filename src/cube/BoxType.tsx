import {Chip, Stack, StackProps} from "@mui/material";
import React from "react";

interface BoxTypeProps {
	boxType: string;
}

function BoxType({boxType}: BoxTypeProps) {
	return <Chip key={boxType} label={boxType} />;
}

interface BoxTypesProps extends StackProps {
	boxTypes: string[];
}

export function BoxTypes({boxTypes, ...stackProps}: BoxTypesProps) {
	return (
		<Stack direction="row" spacing={1} {...stackProps}>
			{boxTypes.map((boxType) => <BoxType boxType={boxType} />)}
		</Stack>
	);
}
