import * as React from "react";
import {useCallback, useMemo, useState} from "react";
import {ExpandMore, Translate} from "@mui/icons-material";
import {Button, Hidden, Menu, MenuItem} from "@mui/material";
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsColorOverrides} from "@mui/material/Button/Button";

export interface Language {
    language: string;
    displayName: string;
}

export interface LanguageSwitcherMenuProps {
    color?: OverridableStringUnion<
        'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
        ButtonPropsColorOverrides
    >;
    language: string;
    setLanguage: (language: string) => void;
    languages: Language[];
}

export function LanguageSwitcher(props: LanguageSwitcherMenuProps) {
    const {color, language, setLanguage, languages} = props;

    const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | HTMLButtonElement | undefined>();

    const languageConfiguration = useMemo(() => {
        const config = languages.filter((l) => l.language == language).pop();
        if (!config) {
            setLanguage('en');
            const list = languages.map((l) => l.language).join(', ');
            throw new Error(`Selected language ${language} is not supported in ${list}`);
        }
        return config;
    }, [language, setLanguage]);

    const handleSelectLanguage = useCallback((language: string) => {
        setLanguage(language);
        setAnchorEl(undefined);
    }, [setLanguage]);

    return (
        <React.Fragment>
            <Button
                color={color}
                startIcon={<Translate/>}
                endIcon={<ExpandMore fontSize="small"/>}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <Hidden mdDown>{languageConfiguration.displayName || language.toLocaleUpperCase()}</Hidden>
                <Hidden mdUp>{language.toLocaleUpperCase()}</Hidden>
            </Button>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                keepMounted
                onClose={() => setAnchorEl(undefined)}
            >
                {languages.map((l) => (
                    <MenuItem
                        key={l.language}
                        onClick={() => handleSelectLanguage(l.language)}
                    >
                        {l.displayName}
                    </MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    );
}
