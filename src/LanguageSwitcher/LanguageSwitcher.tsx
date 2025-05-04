import {ExpandMore, Translate} from "@mui/icons-material";
import {Button, Hidden, Menu, MenuItem} from "@mui/material";
import {ButtonPropsColorOverrides} from "@mui/material/Button/Button";
import {OverridableStringUnion} from "@mui/types";
import * as React from "react";
import {useCallback, useState} from "react";

export interface Language {
	language: string;
	displayName: string;
}

export interface LanguageSwitcherMenuProps {
	color?: OverridableStringUnion<
		"inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning",
		ButtonPropsColorOverrides
	>;
	language: string;
	setLanguage: (language: string) => void;
	languages: ReadonlyArray<Language>;
}

export function LanguageSwitcher(props: LanguageSwitcherMenuProps) {
	const {color, language, setLanguage, languages} = props;

	const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | HTMLButtonElement | undefined>();

	const handleSelectLanguage = useCallback((language: string) => {
		setLanguage(language);
		setAnchorEl(undefined);
	}, [setLanguage]);

	const {displayName} = languages.find(l => l.language == language) ?? {};

	return (
		<React.Fragment>
			<Button
				color={color}
				startIcon={<Translate />}
				endIcon={<ExpandMore fontSize="small" />}
				onClick={(e) => setAnchorEl(e.currentTarget)}
			>
				<Hidden mdDown>{displayName || language.toLocaleUpperCase()}</Hidden>
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
