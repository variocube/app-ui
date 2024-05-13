import * as React from "react";
import {useHelpSettingsContext} from "./HelpSettingsContext";
import {IconButton} from "@mui/material";
import {Help} from "@mui/icons-material";
import {useCallback, useMemo} from "react";

interface HelpProps {
    helpPage : string;
    helpAnchor : string;
    language : string; 
}

export function HelpButton({helpPage, helpAnchor = "", language = ""}: HelpProps) {
    const {baseUrl, 
        selectedHelpPage: selectedHelpPage, setSelectedHelpPage: setSelectedHelpPage, clearSelectedHelpPage: clearSelectedHelpPage,
        selectedHelpAnchor : selectedHelpAnchor, setSelectedHelpAnchor: setSelectedHelpAnchor, clearSelectedHelpAnchor: clearSelectedHelpAnchor,
        selectedHelpLanguage : selectedHelpLanguage, setSelectedHelpLanguage: setSelectedHelpLanguage,clearSelectedHelpLanguage: clearSelectedHelpLanguage
    } = useHelpSettingsContext();

    const currentSelectedHelpPage = useMemo<boolean>(() => selectedHelpPage === helpPage, [selectedHelpPage, helpPage]);
    const currentSelectedHelpAnchor = useMemo<boolean>(() => selectedHelpAnchor === helpAnchor, [selectedHelpAnchor, helpAnchor]);
    const currentSelectedHelpLanguage = useMemo<boolean>(() => selectedHelpLanguage === language, [selectedHelpLanguage, language]);

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

    if(!baseUrl) {
        return null;
    }

    return (
        <IconButton
			onClick={ev => {
				ev.stopPropagation();
				handleHelpButtonClicked();
			}}
			size="small" color={currentSelectedHelpPage && currentSelectedHelpAnchor && currentSelectedHelpLanguage ? "primary" : "default"}>
            <Help />
        </IconButton>
    );
}
