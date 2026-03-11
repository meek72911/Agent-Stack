/**
 * Typed API client for the FastAPI backend.
 * All requests go through Next.js rewrite proxy (/api/v1/* -> backend).
 * Automatically attaches Supabase auth token.
 */

const API_BASE = "/api/v1";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers: extraHeaders, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = res.ok ? await res.json() : null;
    const error = res.ok ? null : (await res.json().catch(() => ({ detail: "Request failed" }))).detail;

    return { data, error, status: res.status };
  } catch (err) {
    return { data: null, error: (err as Error).message, status: 0 };
  }
}

/** Convenience wrappers */
export const api = {
  get: <T>(endpoint: string, token?: string) =>
    apiClient<T>(endpoint, { token }),
  post: <T>(endpoint: string, body: unknown, token?: string) =>
    apiClient<T>(endpoint, { method: "POST", body, token }),
  put: <T>(endpoint: string, body: unknown, token?: string) =>
    apiClient<T>(endpoint, { method: "PUT", body, token }),
  patch: <T>(endpoint: string, body: unknown, token?: string) =>
    apiClient<T>(endpoint, { method: "PATCH", body, token }),
  delete: <T>(endpoint: string, token?: string) =>
    apiClient<T>(endpoint, { method: "DELETE", token }),
};
