import { type NextRequest, NextResponse } from "next/server";

const ROLE_DASHBOARDS: Record<string, string> = {
  SUPER_ADMIN: "/dashboard/super-admin",
  ADMIN: "/dashboard/admin",
  DISPATCHER: "/dashboard/dispatcher",
  DRIVER: "/dashboard/driver",
  HOSPITAL_STAFF: "/dashboard/hospital-staff",
  PATIENT: "/dashboard/patient",
};

function parseJwtPayload(
  token: string,
): { role?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // If both tokens are missing, redirect to login
    if (!accessToken && !refreshToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based protection if accessToken is valid and can be decoded
    if (accessToken) {
      const payload = parseJwtPayload(accessToken);
      const userRole = payload?.role;

      if (userRole && ROLE_DASHBOARDS[userRole]) {
        // SUPER_ADMIN has access to super-admin and admin dashboards
        const isSuperAdminAllowed =
          userRole === "SUPER_ADMIN" &&
          (pathname.startsWith("/dashboard/super-admin") ||
            pathname.startsWith("/dashboard/admin"));

        const isExactRoleDashboard = pathname.startsWith(
          ROLE_DASHBOARDS[userRole],
        );

        if (!isExactRoleDashboard && !isSuperAdminAllowed) {
          // If accessing a dashboard belonging to another role, redirect to own dashboard
          return NextResponse.redirect(
            new URL(ROLE_DASHBOARDS[userRole], request.url),
          );
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
