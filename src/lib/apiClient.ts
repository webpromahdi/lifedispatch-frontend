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
});

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      await rawClient("/auth/refresh-token", {
        method: "POST",
      });
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
