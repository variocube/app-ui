import {Close, OpenInNew} from "@mui/icons-material";
import {Drawer, Grid, IconButton} from "@mui/material";
import * as React from "react";
import {useCallback, useMemo} from "react";
import {useHelpSettingsContext} from "./HelpSettingsContext";

export const buildHelpDrawerUrl = (
	selectedHelpAnchor = "",
	selectedHelpLanguage = "",
	selectedHelpPage = "",
	baseUrl: string,
) => {
	let extraAnchor = selectedHelpAnchor ? `#${selectedHelpAnchor}` : "";
	let extraLanguage = selectedHelpLanguage ? `/${selectedHelpLanguage}` : "";
	return `${baseUrl}${selectedHelpPage}${extraLanguage}${extraAnchor}`;
};

export function HelpDrawer() {
	const {
		baseUrl,
		selectedHelpPage: selectedHelpPage,
		clearSelectedHelpPage: clearSelectedHelpPage,
		selectedHelpAnchor: selectedHelpAnchor,
		clearSelectedHelpAnchor: clearSelectedHelpAnchor,
		selectedHelpLanguage: selectedHelpLanguage,
		clearSelectedHelpLanguage: clearSelectedHelpLanguage,
	} = useHelpSettingsContext();

	const open = useMemo<boolean>(() => Boolean(selectedHelpPage), [
		selectedHelpPage,
		selectedHelpAnchor,
		selectedHelpLanguage,
	]);
	const url = useMemo<string>(() => {
		if (selectedHelpPage) {
			return buildHelpDrawerUrl(selectedHelpAnchor, selectedHelpLanguage, selectedHelpPage, baseUrl);
		} else {
			return `${baseUrl}`;
		}
	}, [baseUrl, selectedHelpPage, selectedHelpLanguage, selectedHelpAnchor]);

	const iframe = React.useRef<HTMLIFrameElement>(null);

	const handleOpenInNew = useCallback(() => {
		window.open(url, url);
		clearSelectedHelpPage();
		clearSelectedHelpLanguage();
		clearSelectedHelpAnchor();
	}, [url, clearSelectedHelpPage]);

	return (
		<Drawer open={open} anchor="right" variant="persistent">
			<Grid container sx={{width: "300px", height: "100%"}}>
				<Grid item xs={12}>
					<Grid container>
						<Grid item style={{flexGrow: 1}}>
							<IconButton size="small" onClick={() => clearSelectedHelpPage()}>
								<Close />
							</IconButton>
						</Grid>
						<Grid item>
							<IconButton size="small" onClick={() => handleOpenInNew()}>
								<OpenInNew />
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
				{open
					&& (
						<Grid item xs={12} sx={{height: "100%"}}>
							<iframe
								onLoad={() => {
									if (selectedHelpAnchor) {
										iframe.current?.contentWindow?.postMessage(selectedHelpAnchor, "*");
									}
								}}
								ref={iframe}
								src={url}
								style={{border: 0, overflow: "scroll", height: "100%", width: "100%"}}
							/>
						</Grid>
					)}
			</Grid>
		</Drawer>
	);
}
