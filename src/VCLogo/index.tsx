import React from "react";

import {default as VCLogoSvg} from "./VC_LOGO_RGB_Main.svg";
import {default as VCLogoWhiteSvg} from "./VC_LOGO_WHITE_Main.svg";
import {default as VCLogoSigneSvg} from "./VC_SIGNE_RGB_Main.svg";
import {default as VCLogoSigneWhiteSvg} from "./VC_SIGNE_WHITE_Main.svg";

export const VCLogo = () => (<img src={VCLogoSvg}  alt="Variocube GmbH" />)
export const VCLogoWhite = () => (<img src={VCLogoWhiteSvg}  alt="Variocube GmbH" />)
export const VCLogoIcon = () => (<img src={VCLogoSigneSvg}  alt="Variocube GmbH" />)
export const VCLogoIconWhite = () => (<img src={VCLogoSigneWhiteSvg}  alt="Variocube GmbH" />)

