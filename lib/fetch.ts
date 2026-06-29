type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

interface RequestOptions<B = unknown> {
  headers?: Record<string, string>;
  body?: B;
  params?: Record<string, string>;
  signal?: AbortSignal;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
  headers: Headers;
}

class HttpError extends Error {
  status: number;
  statusText: string;
  body: unknown;

  constructor(status: number, statusText: string, body: unknown) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function request<T, B = unknown>(
  method: HttpMethod,
  path: string,
  options: RequestOptions<B> = {},
): Promise<ApiResponse<T>> {
  const { headers: customHeaders, body, params, signal } = options;

  const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`, window.location.origin);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...customHeaders,
  };

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body
      ? isFormData
        ? (body as FormData)
        : JSON.stringify(body)
      : undefined,
    signal,
  });

  if (!response.ok) {
    const rawBody = await response.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      parsed = rawBody;
    }
    throw new HttpError(response.status, response.statusText, parsed);
  }

  if (response.status === 204) {
    return { data: undefined as T, status: response.status, ok: true, headers: response.headers };
  }

  const data = (await response.json()) as T;
  return { data, status: response.status, ok: true, headers: response.headers };
}

export const api = {
  get<T>(path: string, options?: RequestOptions) {
    return request<T>("GET", path, options);
  },
  post<T, B = unknown>(path: string, body?: B, options?: RequestOptions<B>) {
    return request<T, B>("POST", path, { ...options, body });
  },
  put<T, B = unknown>(path: string, body?: B, options?: RequestOptions<B>) {
    return request<T, B>("PUT", path, { ...options, body });
  },
  patch<T, B = unknown>(path: string, body?: B, options?: RequestOptions<B>) {
    return request<T, B>("PATCH", path, { ...options, body });
  },
  delete<T>(path: string, options?: RequestOptions) {
    return request<T>("DELETE", path, options);
  },
  head<T>(path: string, options?: RequestOptions) {
    return request<T>("HEAD", path, options);
  },
  options<T>(path: string, options?: RequestOptions) {
    return request<T>("OPTIONS", path, options);
  },
};

export type { ApiResponse, RequestOptions };
export { HttpError };
