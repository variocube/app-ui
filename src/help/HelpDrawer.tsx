import * as React from "react";
import {Drawer, Grid, IconButton, Toolbar} from "@mui/material";
import {useHelpSettingsContext} from "./HelpSettingsContext";
import {useCallback, useMemo} from "react";
import {Close, OpenInNew} from "@mui/icons-material";

interface HelpDrawerProps {
}

export function HelpDrawer(props: HelpDrawerProps) {
    const {baseUrl, selectedHelpKey, clearSelectedHelpKey} = useHelpSettingsContext();

    const open = useMemo<boolean>(() => Boolean(selectedHelpKey), [selectedHelpKey]);
    const url = useMemo<string>(() => {
        if(selectedHelpKey) {
            return `${baseUrl}${selectedHelpKey}`;
        }else {
            return `${baseUrl}`;
        }
    }, [baseUrl, selectedHelpKey]);

    const handleOpenInNew = useCallback(() => {
        window.open(url, url);
        clearSelectedHelpKey();
    }, [url, clearSelectedHelpKey]);

    return (
        <Drawer open={open} anchor="right" variant="persistent">
            <Grid container sx={{width: "300px", height: "100%"}}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item style={{flexGrow: 1}}>
                            <IconButton size="small" onClick={() => clearSelectedHelpKey()}>
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
                {open &&
                    <Grid item xs={12} sx={{height: "100%"}}>
                        <iframe src={url + "?useformat=mobile"} style={{border: 0, overflow: "scroll", height: "100%", width: "100%"}}/>
                    </Grid>
                }
            </Grid>
        </Drawer>
    );
}
