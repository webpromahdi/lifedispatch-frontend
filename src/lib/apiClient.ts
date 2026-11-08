import {
  type FetchOptions,
  type FetchRequest,
  ofetch,
  type ResponseType,
} from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const rawClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onRequest({ options }) {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("accessToken");
      if (!token) {
        // Fallback: check document.cookie for ld_token
        const match = document.cookie.match(/(?:^|;\s*)ld_token=([^;]+)/);
        if (match) {
          token = decodeURIComponent(match[1]);
        }
      }

      if (token) {
        const headers = new Headers(options.headers || {});
        if (!headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        options.headers = headers;
      }
    }
  },
});

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await rawClient<{ data?: { accessToken?: string } }>(
        "/auth/refresh-token",
        {
          method: "POST",
        },
      );

      const newAccessToken = res?.data?.accessToken;
      if (newAccessToken && typeof window !== "undefined") {
        localStorage.setItem("accessToken", newAccessToken);
        try {
          await fetch("/api/v1/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: newAccessToken }),
          });
        } catch {
          // Non-critical session sync failure
        }
      }

      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

const AUTH_EXEMPT_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/me",
];

export async function apiClient<T = unknown, R extends ResponseType = "json">(
  request: FetchRequest,
  options?: FetchOptions<R>,
): Promise<T> {
  try {
    return (await rawClient<T, R>(request, options)) as unknown as T;
  } catch (error: unknown) {
    const fetchErr = error as {
      status?: number;
      statusCode?: number;
      response?: { status?: number };
    };
    const status =
      fetchErr?.status || fetchErr?.statusCode || fetchErr?.response?.status;
    const reqPath =
      typeof request === "string" ? request : (request as Request)?.url || "";
    const isExempt = AUTH_EXEMPT_PATHS.some((path) => reqPath.includes(path));

    if (status === 401 && !isExempt) {
      const refreshed = await refreshTokens();
      if (refreshed) {
        return (await rawClient<T, R>(request, options)) as unknown as T;
      }

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login?error=session_expired";
      }
    }

    throw error;
  }
}

export default apiClient;
