// TypeScript IntelliSense for VITE_ .env variables.
// VITE_ prefixed variables are exposed to the client while non-VITE_ variables aren't
// https://vitejs.dev/guide/env-and-mode.html

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	// more env variables...
	readonly VITE_API_BASE_URL: string;
  	readonly VITE_API_AUTH_TOKEN?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
