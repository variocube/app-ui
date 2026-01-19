/// <reference types="vite/client" />

declare module "*?source" {
	const content: string;
	export default content;
}

declare module "*?raw" {
	const content: string;
	export default content;
}

declare const VERSION: string;
