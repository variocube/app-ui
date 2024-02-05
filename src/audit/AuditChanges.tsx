import {Add, ChangeCircleOutlined, Remove} from "@mui/icons-material";
import {Box, Chip, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import React, {Fragment} from "react";
import {AppAuditLogEntry, JsonPatch, JsonPatchItem} from "./types";
import {Code} from "../code/Code";
import {CodeBlock} from "../code/CodeBlock";

export function AuditChanges({data, patch}: Pick<AppAuditLogEntry, "data" | "patch">) {

	return patch
		? <AuditPatch patch={patch} />
		: <CodeBlock>{JSON.stringify(data, null, 4)}</CodeBlock>;
}

function AuditPatch({patch}: { patch: JsonPatch }) {
	return (
		<List dense disablePadding>
			{patch.map(item => (
				<ListItem disablePadding>
					<ListItemIcon>
						<Chip
							icon={getIcon(item.op)}
							label={item.path}
							sx={{
								fontFamily: "Jetbrains Mono"
							}}
						/>
					</ListItemIcon>
					<ListItemText
						primary={
							<Box pl={1}>
								{item.op == "replace" && (
									<Fragment>
										<Box sx={{color: "success"}}>
											<Value value={item.value}/>
										</Box>
										<Box color="error">
											<s>
												<Value value={item.fromValue}/>
											</s>
										</Box>
									</Fragment>
								)}
								{item.op == "add" && (
									<div>
										<Value value={item.value}/>
									</div>
								)}
							</Box>
						}
					/>
				</ListItem>
			))}
		</List>
	);
}

function getIcon(op: JsonPatchItem["op"]) {
	switch (op) {
		case "add": return <Add/>;
		case "remove": return <Remove/>;
		case "replace": return <ChangeCircleOutlined/>;
		default: return;
	}
}

function Value({value}: { value: any }) {
	return (
		<Code>
			{JSON.stringify(value, null, 4)}
		</Code>
	);
}
