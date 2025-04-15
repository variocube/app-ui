/** An error from the REST API. */
export class ApiError extends Error {
	constructor(readonly status: number, message: string, readonly details?: string) {
		super(message);
	}
}

/**
 * Creates a wrapper around window.fetch for most common REST API requests.
 * @param baseUrl The base URL of the API, i.e. https://api.cubeadmin.center
 * @param baseHeaders The base headers of each request, i.e. {Authorization: "Bearer XXXX"}
 */
export function createApiFetcher(baseUrl: string, baseHeaders?: HeadersInit) {
	async function fetch(path: string, options?: RequestInit) {
		options = options || {};
		options.headers = {
			...baseHeaders,
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
		const {message, details} = await tryExtractErrorMessage(response);
		throw new ApiError(response.status, message, details);
	}
}

async function tryExtractErrorMessage(response: Response) {
	try {
		const error = await response.json();
		if (error?.error && error.message) {
			return {
				message: error.error as string,
				details: error.message as string,
			};
		}
		if (error?.title && error.detail) {
			return {
				message: error.title as string,
				details: error.detail as string,
			};
		}
	} catch (parseError) {
	}
	return {
		message: response.statusText,
	};
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
