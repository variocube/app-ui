import React from "react";
import {Chip} from "@mui/material";

interface BoxTypeProps {
    boxType: string;
}

function BoxType({boxType}: BoxTypeProps) {
    return (
        <Chip key={boxType} label={boxType} />
    )
}

interface BoxTypesProps {
	boxTypes: string[];
}

export function BoxTypes(props: BoxTypesProps) {
	const {boxTypes} = props;
	return (
		<React.Fragment>
			{boxTypes.map((boxType) => <BoxType boxType={boxType} />)}
		</React.Fragment>
	);
}