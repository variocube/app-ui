import DarkModeIcon from "@mui/icons-material/DarkMode";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/PowerSettingsNew";
import SettingsIcon from "@mui/icons-material/Settings";
import {Avatar, Divider, ListItemIcon, ListItemText, Menu, MenuItem, useTheme} from "@mui/material";
import React, {Fragment, useCallback, useState} from "react";
import {usePaletteMode} from "../VCThemeProvider";

type Props = {
	onSettingClick?: () => void;
	onChangePasswordClick?: () => void;
	onLogoutClick?: () => void;
	showDarkModeSwitch?: boolean;
	i18n?: {
		settings?: string;
		changePassword?: string;
		darkMode?: string;
		logout?: string;
	};
};

export function UserNav(props: Props) {
	const {
		onSettingClick,
		onChangePasswordClick,
		onLogoutClick,
		showDarkModeSwitch,
		i18n: {
			settings,
			changePassword,
			darkMode,
			logout,
		} = {},
	} = props;

	const theme = useTheme();
	const {mode, setMode} = usePaletteMode();

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	return (
		<Fragment>
			<Avatar
				sx={{
					bgcolor: theme.palette.grey["500"],
					width: 30,
					height: 30,
					cursor: "pointer",
				}}
				variant="circular"
				onClick={ev => setAnchorEl(ev.currentTarget)}
			>
				<PersonIcon />
			</Avatar>
			<Menu
				open={anchorEl !== null}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				{onSettingClick && (
					<MenuItem onClick={onSettingClick}>
						<ListItemIcon>
							<SettingsIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText>{settings ?? "Settings"}</ListItemText>
					</MenuItem>
				)}
				{onChangePasswordClick && (
					<MenuItem onClick={onChangePasswordClick}>
						<ListItemIcon>
							<LockIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText>{changePassword ?? "Change password"}</ListItemText>
					</MenuItem>
				)}
				{showDarkModeSwitch && (
					<MenuItem onClick={() => setMode((mode === "dark") ? "light" : "dark")}>
						<ListItemIcon>
							<DarkModeIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText>{darkMode ?? "Dark Mode"}: {mode === "dark" ? "ON" : "OFF"}</ListItemText>
					</MenuItem>
				)}
				{onLogoutClick && (
					<Fragment>
						<Divider />
						<MenuItem onClick={onLogoutClick}>
							<ListItemIcon>
								<LogoutIcon fontSize="small" sx={{color: theme.palette.error.main}} />
							</ListItemIcon>
							<ListItemText sx={{color: theme.palette.error.main}}>{logout ?? "Logout"}</ListItemText>
						</MenuItem>
					</Fragment>
				)}
			</Menu>
		</Fragment>
	);
}
