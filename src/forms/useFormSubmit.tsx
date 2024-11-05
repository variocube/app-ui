import React from "react";
import {useAsyncCallback} from "react-async-hook";
import {useFlag} from "../utils";

interface UseFormSubmitOptions {
	onSubmit: () => Promise<any>;
}

export function useFormSubmit({onSubmit}: UseFormSubmitOptions) {
	const [submitted, setSubmitted, clearSubmitted] = useFlag(false);

	const {loading: submitting, error, execute: save} = useAsyncCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			clearSubmitted();
			await onSubmit();
			setSubmitted();
		},
	);

	return {
		submitting,
		submitted,
		error,
		onSubmit: save,
		onChange: clearSubmitted,
	};
}
