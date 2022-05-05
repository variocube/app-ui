import React from "react";
import {makeStyles} from "@mui/styles";
import {SvgElement} from "../elements";

import {default as VCLogoSvg} from "./VC_LOGO_RGB_Main.svg";
import {default as VCLogoWhiteSvg} from "./VC_LOGO_WHITE_Main.svg";
import {default as VCLogoSigneSvg} from "./VC_SIGNE_RGB_Main.svg";
import {default as VCLogoSigneWhiteSvg} from "./VC_SIGNE_WHITE_Main.svg";

const useStyles = makeStyles({
    logo: {
        width: 200,
        height: 50
    }
})
const LogoShell = ({svg}: { svg: string }) => {
    const classes = useStyles();
    return <SvgElement className={classes.logo} svg={svg} />
}

export const VCLogo = () => <SvgElement svg={VCLogoSvg} />
export const VCLogoWhite = () => <SvgElement svg={VCLogoWhiteSvg} />
export const VCLogoIcon = () => <SvgElement svg={VCLogoSigneSvg} />
export const VCLogoIconWhite = () => <SvgElement svg={VCLogoSigneWhiteSvg} />

