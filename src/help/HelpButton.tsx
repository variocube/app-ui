import * as React from "react";
import {useHelpSettingsContext} from "./HelpSettingsContext";
import {IconButton} from "@mui/material";
import {Help} from "@mui/icons-material";
import {useCallback, useMemo} from "react";

interface HelpProps {
    helpKey: string;
}

export function HelpButton({helpKey}: HelpProps) {
    const {baseUrl, selectedHelpKey, setSelectedHelpKey, clearSelectedHelpKey} = useHelpSettingsContext();

    const selected = useMemo<boolean>(() => selectedHelpKey === helpKey, [selectedHelpKey, helpKey]);

    const handleHelpButtonClicked = useCallback(() => {
        if(!selected) {
            setSelectedHelpKey(helpKey);
        }else {
            clearSelectedHelpKey();
        }
    }, [helpKey, selected]);

    if(!baseUrl) {
        return null;
    }

    return (
        <IconButton onClick={handleHelpButtonClicked} size="small" color={selected ? "primary" : "default"}>
            <Help />
        </IconButton>
    );
}
