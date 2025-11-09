export interface ProblemJson {
	title: string;
	status: number;
	type?: string;
	instance?: string;
	detail?: string;
	[key: string]: any;
}

/** An error from the REST API. */
export class ApiError extends Error implements ProblemJson {
	constructor(problemJson: ProblemJson) {
		super(problemJson.title);
		this.title = problemJson.title;
		this.status = problemJson.status;
		Object.assign(this, problemJson);
	}

	title: string;
	status: number;
	type?: string;
	instance?: string;
	detail?: string;
	[key: string]: any;
}

/**
 * Creates a wrapper around window.fetch for most common REST API requests.
 * @param baseUrl The base URL of the API, i.e. https://api.cubeadmin.center
 * @param baseHeaders The base headers of each request, i.e. {Authorization: "Bearer XXXX"}
 * @param baseHeadersModifier A function that returns the headers of each request, i.e. () => {Authorization: "Bearer XXXX"}
 */
export function createApiFetcher(baseUrl: string, baseHeaders?: HeadersInit, baseHeadersModifier?: () => HeadersInit) {
	async function fetch(path: string, options?: RequestInit) {
		options = options || {};
		options.headers = {
			...baseHeaders,
			...baseHeadersModifier?.(),
			...options.headers,
		};
		const response = await window.fetch(`${baseUrl}${path}`, options);
		await checkOkay(response);
		return response;
	}

	async function fetchJson<T>(path: string, options?: RequestInit) {
		const response = await fetch(path, options);
		return await response.json() as T;
	}

	return {
		fetch,
		fetchJson,
		get: fetchJson,
		del: (path: string, body?: any) => fetch(path, createJsonRequest("delete", body)),
		put: (path: string, body?: any) => fetch(path, createJsonRequest("put", body)),
		post: (path: string, body?: any) => fetch(path, createJsonRequest("post", body)),
		patch: (path: string, body?: any) => fetch(path, createJsonRequest("PATCH", body)),
	};
}

export type ApiFetcher = ReturnType<typeof createApiFetcher>;

async function checkOkay(response: Response) {
	if (!response.ok) {
		throw await createApiError(response);
	}
}

function isProblemJson(error: any): error is ProblemJson {
	return typeof error.title == "string" && typeof error.status == "number";
}

function isLegacySpringError(error: any): error is { error: string; message: string } {
	return typeof error.error == "string" && typeof error.message == "string";
}

export async function createApiError(response: Response) {
	const statusText = response.statusText || "Error";
	try {
		const error = await response.json();
		if (isProblemJson(error)) {
			return new ApiError(error);
		}
		if (isLegacySpringError(error)) {
			return new ApiError({
				title: error.error,
				status: response.status,
				detail: error.message,
			});
		}
		// As a fallback, just copy the response body to the error and use title and status
		// from the response
		return new ApiError({
			...error,
			title: statusText,
			status: response.status,
		});
	} catch (parseError) {
		// If parsing fails, fallback to generic error based on HTTP status
		return new ApiError({
			title: statusText,
			status: response.status,
		});
	}
}

/**
 * Creates a query string from one or more objects containing key value pairs.
 * @param args
 */
export function createQueryString(...args: Record<string, any>[]) {
	const allArgs = args.reduce((acc, curr) => {
		const currArgs = Object.entries(curr)
			.filter(([_, value]) => typeof value != "undefined" && value !== null)
			.flatMap(([key, value]) =>
				(Array.isArray(value) ? value : [value])
					.map(value => [key, `${value}`])
			);
		return acc.concat(currArgs);
	}, []);
	return new URLSearchParams(allArgs).toString();
}

export function createJsonRequest(method: string, body?: any): RequestInit {
	return {
		method: method,
		...getBodyRequestInit(body),
	};
}

function getBodyRequestInit(body?: any) {
	if (typeof body !== "undefined") {
		return {
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
			},
		};
	} else {
		return {
			body: null,
		};
	}
}

interface UploadFileRequest {
	uploadUrl: string;
	uploadHeaders: Record<string, string>;
}

/**
 * Uploads a file to the specified upload URL that is compatible with an Amazon S3 pre-signed PUT URL.
 * @param file The file to upload
 * @param request The upload file request
 */
export async function uploadFile(file: File, request: UploadFileRequest) {
	const response = await fetch(request.uploadUrl, {
		method: "put",
		headers: {
			"content-type": file.type,
			...request.uploadHeaders,
		},
		body: file,
	});
	await checkOkay(response);
}
