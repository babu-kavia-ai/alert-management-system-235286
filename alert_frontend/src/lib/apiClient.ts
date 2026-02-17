import { getApiBaseUrl } from "@/lib/env";

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  token?: string | null;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = getApiBaseUrl();
  const url = new URL(`${base}${path.startsWith("/") ? "" : "/"}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return await res.json();
  }
  const text = await res.text();
  return text.length ? text : null;
}

// PUBLIC_INTERFACE
export async function apiRequest<T>(opts: RequestOptions): Promise<T> {
  /**
   * Performs a request to the backend API.
   *
   * - Adds Authorization header if token provided.
   * - Throws an ApiError for non-2xx responses.
   */
  const method = opts.method ?? "GET";
  const url = buildUrl(opts.path, opts.query);

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers ?? {}),
  };

  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(url, {
    method,
    headers,
    body,
    signal: opts.signal,
  });

  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    const detail =
      payload && typeof payload === "object" && "detail" in payload
        ? (payload as Record<string, unknown>).detail
        : undefined;

    const err: ApiError = {
      status: res.status,
      message:
        typeof payload === "string"
          ? payload
          : (typeof detail === "string" ? detail : undefined) ||
            res.statusText ||
            "Request failed",
      details: payload,
    };
    throw err;
  }

  return payload as T;
}

/**
 * Backend is currently minimal (health check at `/`).
 * Provide a small wrapper to demonstrate integration and make future expansion easy.
 */
// PUBLIC_INTERFACE
export async function getHealth(): Promise<unknown> {
  /** Calls GET / on the FastAPI backend. */
  return apiRequest<unknown>({ path: "/", method: "GET" });
}
