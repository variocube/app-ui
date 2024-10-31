import {CloudUpload, OpenInNew} from "@mui/icons-material";
import {CircularProgress, IconButton, InputAdornment} from "@mui/material";
import React, {ChangeEvent, useRef} from "react";
import {useAsyncCallback} from "react-async-hook";
import {TextField, TextFieldProps} from "./TextField";

interface UrlUploadFieldProps extends TextFieldProps {
	accept?: string;
	upload?: (file: File) => Promise<string>;
	value?: string;
}

export function UrlUploadField(props: UrlUploadFieldProps) {
	const {
		upload: uploadFunc,
		type = "url",
		accept,
		value,
	} = props;

	const fileInputRef = useRef<HTMLInputElement>(null);

	const showFileSelect = () => {
		if (fileInputRef && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const upload = useAsyncCallback(async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && uploadFunc) {
			for (const file of files) {
				const publicUrl = await uploadFunc(file);
				props.onChange && props.onChange(publicUrl, e);
			}
		}
	});

	const startAdornment = (
		<InputAdornment position="start">
			{!upload.loading && (
				<IconButton onClick={showFileSelect}>
					<CloudUpload />
				</IconButton>
			)}
			{upload.loading && <CircularProgress size={24} sx={{mx: 1}} />}
		</InputAdornment>
	);

	const endAdornment = (
		<InputAdornment position="end">
			<IconButton
				component="a"
				target="_blank"
				href={value}
				disabled={!value}
			>
				<OpenInNew />
			</IconButton>
		</InputAdornment>
	);

	return (
		<React.Fragment>
			<input
				type="file"
				accept={accept}
				ref={fileInputRef}
				onChange={upload.execute}
				style={{display: "none"}}
			/>
			<TextField
				{...props}
				value={value}
				type={type}
				InputProps={{
					...props.InputProps,
					startAdornment: upload ? startAdornment : undefined,
					endAdornment: endAdornment,
				}}
			/>
		</React.Fragment>
	);
}
