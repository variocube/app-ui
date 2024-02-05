import React, {PropsWithChildren} from "react";
import {Timeline} from "@mui/lab";
import {AuditTimelineItemSkeleton} from "./AuditTimelineItem";

interface AuditTimelineProps {
    loading?: boolean;
}

export function AuditTimeline({loading, children}: PropsWithChildren<AuditTimelineProps>) {
    if (loading) {
        return (
            <Timeline>
                <AuditTimelineItemSkeleton/>
                <AuditTimelineItemSkeleton/>
                <AuditTimelineItemSkeleton/>
            </Timeline>
        )
    }
    return (
        <Timeline>
            {children}
        </Timeline>
    );
}

