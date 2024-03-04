import {createContext, useContext} from "react";
import {Branding} from "../src";

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
