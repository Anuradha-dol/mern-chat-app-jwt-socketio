const DEFAULT_API_BASE_URL = "http://localhost:3000";

// Use Vite env vars when provided, otherwise fallback to local backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;
