import { type NextRequest, NextResponse } from "next/server";
import { getRoleDashboardPath } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const error = searchParams.get("error");

  if (error || !accessToken || !refreshToken) {
    const errorUrl = new URL("/login", request.url);
    errorUrl.searchParams.set("error", error || "google_auth_failed");
    return NextResponse.redirect(errorUrl);
  }

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

  let targetRole: string | undefined;

  try {
    const res = await fetch(`${apiBaseUrl}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      targetRole = data?.data?.user?.role;
    }
  } catch (err) {
    console.error("Failed to fetch user in Google OAuth callback:", err);
  }

  const targetPath = getRoleDashboardPath(targetRole);
  const response = NextResponse.redirect(new URL(targetPath, request.url));

  const isProduction = process.env.NODE_ENV === "production";

  // Set cookies on the frontend domain so that browser session & server components have access
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
