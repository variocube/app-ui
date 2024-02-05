import React, {ReactNode} from "react";
import {
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator
} from "@mui/lab";
import {Box, Skeleton, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";

export interface AuditTimelineItemProps {
    created: ReactNode;
    actor: ReactNode;
    connector?: boolean;
    message: ReactNode;
    changes: ReactNode;
}

export function AuditTimelineItem(props: AuditTimelineItemProps) {
    const {
        created,
        actor,
        connector = true,
        message,
        changes,
    } = props;
    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.down("sm"));

    const createdAndActor = (
        <Stack spacing={1}>
            <Box color="text.secondary">{created}</Box>
            <Box color="text.primary">{actor}</Box>
        </Stack>
    );

    return (
        <TimelineItem>
            {sm
                ? <TimelineOppositeContent sx={{flex: 0, padding: 0}}/>
                : <TimelineOppositeContent>{createdAndActor}</TimelineOppositeContent>
            }
            <TimelineSeparator>
                <TimelineDot/>
                {connector && (
                    <TimelineConnector/>
                )}
            </TimelineSeparator>
            <TimelineContent>
                <Stack spacing={1}>
                    <Typography variant="h6" sx={{transform: "translateY(-1px)"}}>
                        {message}
                    </Typography>
                    {sm && createdAndActor}
                    <Typography variant="body2">
                    {changes}
                    </Typography>
                </Stack>
            </TimelineContent>
        </TimelineItem>
    )
}

export function AuditTimelineItemSkeleton() {
    return (
        <AuditTimelineItem
            connector
            created={<Skeleton/>}
            actor={<Skeleton/>}
            message={<Skeleton/>}
            changes={<Skeleton variant="rounded" height="150px"/>}
        />
    );
}
