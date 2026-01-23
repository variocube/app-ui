import {Timeline} from "@mui/lab";
import React, {PropsWithChildren} from "react";
import {AuditTimelineItemSkeleton} from "./AuditTimelineItem";

interface AuditTimelineProps {
	loading?: boolean;
}

export function AuditTimeline({loading, children}: PropsWithChildren<AuditTimelineProps>) {
	if (loading) {
		return (
			<Timeline>
				<AuditTimelineItemSkeleton />
				<AuditTimelineItemSkeleton />
				<AuditTimelineItemSkeleton />
			</Timeline>
		);
	}
	return (
		<Timeline>
			{children}
		</Timeline>
	);
}
