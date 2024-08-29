import * as React from "react";
import {useHelpSettingsContext} from "./HelpSettingsContext";
import {IconButton} from "@mui/material";
import {Help} from "@mui/icons-material";
import {useCallback, useEffect, useMemo, useState} from "react";

/**
 * For english language must be an empty string.
 */
interface HelpProps {
    helpPage : string;
    helpAnchor : string;
    language : string;
	showEmpty?: boolean;
}

type wikipageParse = {
	parse: wikipageType;
}

type sectionsArray = {
	anchor: string,
	byteoffset: number,
	fromtitle: string,
	index: string,
	level: string,
	line: string,
	number: string,
	toclevel: number,
}

type wikipageType = {
	categories: string[];
	displaytitle: string,
	externallinks: string[],
	images: string[],
	iwLinks: string[],
	langlinks: string[],
	links: string[],
	pageid: number,
	parsewarning: string[],
	properties: string[],
	revid: number,
	sections: sectionsArray[],
	templates: string[],
	text: string,
	title: string
}

export function HelpButton({helpPage, helpAnchor = "", language = "", showEmpty}: HelpProps) {
    const {baseUrl, 
        selectedHelpPage: selectedHelpPage, setSelectedHelpPage: setSelectedHelpPage, clearSelectedHelpPage: clearSelectedHelpPage,
        selectedHelpAnchor : selectedHelpAnchor, setSelectedHelpAnchor: setSelectedHelpAnchor, clearSelectedHelpAnchor: clearSelectedHelpAnchor,
        selectedHelpLanguage : selectedHelpLanguage, setSelectedHelpLanguage: setSelectedHelpLanguage,clearSelectedHelpLanguage: clearSelectedHelpLanguage
    } = useHelpSettingsContext();

    const currentSelectedHelpPage = useMemo<boolean>(() => selectedHelpPage === helpPage, [selectedHelpPage, helpPage]);
    const currentSelectedHelpAnchor = useMemo<boolean>(() => selectedHelpAnchor === helpAnchor, [selectedHelpAnchor, helpAnchor]);
    const currentSelectedHelpLanguage = useMemo<boolean>(() => selectedHelpLanguage === language, [selectedHelpLanguage, language]);

	const [hasContent, setHasContent] = useState<boolean>();
	const languageUrl = (language == "de" ? "/de" : "");

	useEffect( () => {
		(async () => {
				let restUrl = null;
				if(baseUrl.includes("safecube")){
					restUrl = "https://docs.variocube.com/variocube/safecube/admin/"
				}else if(baseUrl.includes("logistics")){
					restUrl = "https://docs.variocube.com/variocube/logistics/admin/"
				}
				const origin = window.location.origin;
			try {
				const response = await fetch(`${restUrl}api.php?action=parse&origin=${origin}&page=${helpPage}${languageUrl}&format=json`);
				if(response.ok){
					const wp: wikipageParse = await response.json();
					setHasContent(wp.parse.sections.find( s => s.anchor === helpAnchor ) != undefined);
				}
			} catch (err) {
				console.log("Error while fetching Wiki Page.")
			}
		})();
	},[]);

    const handleHelpButtonClicked = useCallback(() => {
		if(!currentSelectedHelpPage || !currentSelectedHelpAnchor) {
            setSelectedHelpPage(helpPage);
            setSelectedHelpAnchor(helpAnchor || "");
            setSelectedHelpLanguage(language || "");
        }else {
            clearSelectedHelpPage();
            clearSelectedHelpAnchor();
            clearSelectedHelpLanguage();
        }
    }, [helpPage, currentSelectedHelpPage, currentSelectedHelpAnchor, currentSelectedHelpLanguage]);

    if(!baseUrl || (!hasContent && !showEmpty)) {
        return null;
    }

    return (
        <IconButton
			onClick={ev => {
				ev.stopPropagation();
				handleHelpButtonClicked();
			}}
			size="small" color = {!hasContent ? "error" : (currentSelectedHelpPage && currentSelectedHelpAnchor && currentSelectedHelpLanguage ? "primary" : "default")}>
            <Help />
        </IconButton>
    );
}
