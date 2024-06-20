import {Box, useTheme} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import {Labels} from "../localization";

interface UtilizationBarProps {
	occupied: number;
	available: number;
	disabled: number;
	total: number;
	labels: Labels<"occupied" | "available" | "disabled" | "total">;
}

export const UtilizationBar = (props: UtilizationBarProps) => {
	const {
		occupied,
		available,
		disabled,
		total,
		labels,
	} = props;

	const theme = useTheme();
	return (
		<Box sx={{whiteSpace: "nowrap"}}>
			<Box
				sx={{
					position: "relative",
					top: "3px",
					display: "inline-block",
					width: "100px",
					height: "20px",
					marginRight: 1,
					background: "rgba(0, 0, 0, 0.25)",
					borderRadius: "3px",
					overflow: "hidden",
				}}
			>
				<UtilizationSegment
					title={`${labels("occupied")}: ${occupied}`}
					fraction={occupied / total}
					color={theme.palette.secondary.main}
				/>
				<UtilizationSegment
					title={`${labels("available")}: ${available}`}
					fraction={available / total}
					color={theme.palette.success.main}
				/>
				<UtilizationSegment
					title={`${labels("disabled")}: ${disabled}`}
					fraction={disabled / total}
					color={theme.palette.divider}
				/>
			</Box>

			<Tooltip title={`${labels("total")}: ${total}`}>
				<Box
					sx={{
						display: "inline",
						position: "relative",
						top: "-2px",
						fontWeight: "bold",
					}}
				>
					{total}
				</Box>
			</Tooltip>
		</Box>
	);
};

interface UtilizationSegmentProps {
	title: string;
	color: string;
	fraction: number;
}

function UtilizationSegment({color, title, fraction}: UtilizationSegmentProps) {
	return (
		<Tooltip
			title={title}
			children={
				<Box
					sx={{
						display: "inline-block",
						height: "20px",
						backgroundColor: color,
						width: `${100 * fraction}%`,
					}}
				/>
			}
		/>
	);
}
