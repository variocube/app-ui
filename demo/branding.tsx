import {createContext, useContext} from "react";
import {Branding, BrandingV2} from "../src";

export type SetBrandingFunc = (branding: Branding) => void;

const BrandingContext = createContext<SetBrandingFunc>(() => void 0);

export const BrandingProvider = BrandingContext.Provider;

export function useSetBranding() {
	const context = useContext(BrandingContext);
	if (!context) {
		throw new Error("Could not find branding context. Are you missing a BrandingProvider in your component tree?");
	}
	return context;
}

export type SetBrandingV2Func = (branding: BrandingV2 | undefined) => void;

const BrandingV2Context = createContext<SetBrandingV2Func>(() => void 0);

export const BrandingV2Provider = BrandingV2Context.Provider;

export function useSetBrandingV2() {
	return useContext(BrandingV2Context);
}
