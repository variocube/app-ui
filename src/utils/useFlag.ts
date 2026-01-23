import {useCallback, useState} from "react";

export function useFlag(initialValue: boolean) {
	const [flag, setFlag] = useState(initialValue);
	const set = useCallback(() => setFlag(true), []);
	const clear = useCallback(() => setFlag(false), []);
	const toggle = useCallback(() => setFlag(prev => !prev), []);
	return [flag, set, clear, toggle] as const;
}
