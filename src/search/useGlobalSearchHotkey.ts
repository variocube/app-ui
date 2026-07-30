import {useEffect} from "react";

/**
 * Opens the global search on Ctrl+K (or Cmd+K on macOS) by calling `onOpen`.
 *
 * Registers a `keydown` listener on `window` for the lifetime of the component. Pass a stable callback
 * (e.g. from `useCallback`) to avoid re-registering the listener on every render.
 */
export function useGlobalSearchHotkey(onOpen: () => void): void {
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if ((event.ctrlKey || event.metaKey) && (event.key === "k" || event.key === "K")) {
				event.preventDefault();
				onOpen();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onOpen]);
}
