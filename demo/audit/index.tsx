import {Card, CardContent, Container, Stack, Typography} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {AuditChanges, AuditTimeline, AuditTimelineItem, Checkbox, Code, Now, RelativeTemporalFormat} from "../../src";

export function AuditDemo() {
	return (
		<Container>
			<Stack spacing={2}>
				<Typography variant="h1" gutterBottom>
					Audit
				</Typography>

				<Typography variant="h2" gutterBottom>
					Audit timeline
				</Typography>
				<Typography variant="body1">
					An audit timeline shows audit log entries using a Mui <Code>Timeline</Code>
				</Typography>
				<AuditTimelineDemo />
			</Stack>
		</Container>
	);
}

function AuditTimelineDemo() {
	const [loading, setLoading] = useState(false);
	return (
		<Stack spacing={2}>
			<Card>
				<CardContent>
					<Checkbox
						value={loading}
						onChange={setLoading}
						label="Toggle loading state"
					/>
				</CardContent>
			</Card>
			<AuditTimeline loading={loading}>
				<AuditTimelineItem
					created={<RelativeTemporalFormat value={Now.instant().subtract({seconds: 3})} />}
					actor={"guenther.kastenfrosch@gmail.com"}
					message="Added tomatoes to fruit salad."
					changes={
						<AuditChanges
							patch={[
								{op: "add", path: "/fruits", value: "tomatoes"},
							]}
						/>
					}
				/>
				<AuditTimelineItem
					created={<RelativeTemporalFormat value={Now.instant().subtract({seconds: 7})} />}
					actor={"guenther.kastenfrosch@gmail.com"}
					message="Renamed fruit salad."
					changes={
						<AuditChanges
							patch={[
								{
									op: "replace",
									path: "/name",
									fromValue: "Our fruit salad",
									value: "Our tasty fruit salad",
								},
							]}
						/>
					}
				/>
				<AuditTimelineItem
					created={<RelativeTemporalFormat value={Now.instant().subtract({minutes: 17})} />}
					actor={"derkleinetiger@gmx.de"}
					message="Added apples to fruit salad."
					changes={
						<AuditChanges
							patch={[
								{op: "add", path: "/fruits", value: "apples"},
							]}
						/>
					}
				/>
				<AuditTimelineItem
					created={<RelativeTemporalFormat value={Now.instant().subtract({hours: 2})} />}
					actor={"derkleinebaer@web.de"}
					message="Added bananas to fruit salad."
					changes={
						<AuditChanges
							patch={[
								{op: "add", path: "/fruits", value: "bananas"},
							]}
						/>
					}
				/>
				<AuditTimelineItem
					created={<RelativeTemporalFormat value={Now.instant().subtract({hours: 3})} />}
					actor={"derkleinetiger@web.de"}
					message="Created fruit salad."
					changes={
						<AuditChanges
							data={{
								name: "Our fruit salad",
								tasty: true,
								guests: 5,
							}}
						/>
					}
				/>
			</AuditTimeline>
		</Stack>
	);
}
