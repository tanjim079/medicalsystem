import { fetchAuth } from "../../../lib/fetchAuth";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  details?: { field: string; message: string }[];
  constructor(message: string, status: number, details?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** JSON request helper that throws ApiError with the server's message on failure. */
export async function apiRequest<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (json !== undefined) headers.set("Content-Type", "application/json");

  let res: Response;
  try {
    res = await fetchAuth(`${API_URL}${path}`, {
      ...rest,
      headers,
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", 0);
  }

  const text = await res.text();
  let body: { error?: string; message?: string; details?: { field: string; message: string }[] } | null = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    const details = Array.isArray(body?.details) ? body.details : undefined;
    const message = details?.length
      ? details.map((d) => d.message).join(". ")
      : body?.error || body?.message || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, details);
  }
  return body as T;
}

export const errorMessage = (err: unknown, fallback = "Something went wrong") =>
  err instanceof Error ? err.message : fallback;
