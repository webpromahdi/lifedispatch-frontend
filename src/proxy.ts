import { type NextRequest, NextResponse } from "next/server";

const ROLE_DASHBOARDS: Record<string, string> = {
  SUPER_ADMIN: "/dashboard/super-admin",
  ADMIN: "/dashboard/admin",
  DISPATCHER: "/dashboard/dispatcher",
  DRIVER: "/dashboard/driver",
  HOSPITAL_STAFF: "/dashboard/hospital-staff",
  PATIENT: "/dashboard/patient",
};

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

interface JwtPayload {
  id?: string;
  userId?: string;
  role?: string;
  email?: string;
  exp?: number;
}

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(exp?: number): boolean {
  if (!exp) return false;
  // Consider token expired if current time is beyond exp (with 10-second buffer)
  return Date.now() >= (exp - 10) * 1000;
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const accessPayload = accessToken ? parseJwtPayload(accessToken) : null;
  const refreshPayload = refreshToken ? parseJwtPayload(refreshToken) : null;

  const isAccessExpired = isTokenExpired(accessPayload?.exp);
  const isRefreshExpired = isTokenExpired(refreshPayload?.exp);

  // Authenticated if accessToken is still valid OR refreshToken is present & valid
  const isAuthenticated =
    (Boolean(accessToken) && !isAccessExpired) ||
    (Boolean(refreshToken) && !isRefreshExpired);

  // Optimistically extract user details from access token (or fallback to refresh token)
  const userRole = accessPayload?.role || refreshPayload?.role;
  const userId =
    accessPayload?.userId ||
    accessPayload?.id ||
    refreshPayload?.userId ||
    refreshPayload?.id;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // 1. Logged-in users should NOT be able to visit auth pages (/login, /register, etc.)
  if (isAuthRoute) {
    if (isAuthenticated && userRole && ROLE_DASHBOARDS[userRole]) {
      const defaultDashboard = ROLE_DASHBOARDS[userRole];
      const fromParam = request.nextUrl.searchParams.get("from");

      let destination = defaultDashboard;

      // Allow redirecting to original target if safe and role-permitted
      if (fromParam?.startsWith("/") && !fromParam.startsWith("//")) {
        const isSuperAdminAllowed =
          userRole === "SUPER_ADMIN" &&
          (fromParam.startsWith("/dashboard/super-admin") ||
            fromParam.startsWith("/dashboard/admin"));
        const isOwnDashboard = fromParam.startsWith(ROLE_DASHBOARDS[userRole]);

        if (isOwnDashboard || isSuperAdminAllowed) {
          destination = fromParam;
        }
      }

      return NextResponse.redirect(new URL(destination, request.url));
    }

    return applySecurityHeaders(NextResponse.next());
  }

  // 2. Protect /dashboard routes
  if (isDashboardRoute) {
    // If not authenticated, redirect to login with 'from' query param
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If role is missing or not recognized, redirect to login
    if (!userRole || !ROLE_DASHBOARDS[userRole]) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Visiting /dashboard directly redirects to the user's role dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return NextResponse.redirect(
        new URL(ROLE_DASHBOARDS[userRole], request.url),
      );
    }

    // Role-based Access Control (RBAC)
    const isSuperAdminAllowed =
      userRole === "SUPER_ADMIN" &&
      (pathname.startsWith("/dashboard/super-admin") ||
        pathname.startsWith("/dashboard/admin"));

    const isOwnRoleDashboard = pathname.startsWith(ROLE_DASHBOARDS[userRole]);

    // If accessing an unauthorized dashboard, redirect to own dashboard
    if (!isOwnRoleDashboard && !isSuperAdminAllowed) {
      return NextResponse.redirect(
        new URL(ROLE_DASHBOARDS[userRole], request.url),
      );
    }
  }

  // 3. Downstream header decoration & response security headers
  const requestHeaders = new Headers(request.headers);
  if (userRole) {
    requestHeaders.set("x-user-role", userRole);
  }
  if (userId) {
    requestHeaders.set("x-user-id", userId);
  }
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - static files (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
