import { type NextRequest, NextResponse } from "next/server";

const isProduction = process.env.NODE_ENV === "production";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, refreshToken } = body;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "accessToken is required" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Session established successfully",
    });

    // 1. Set accessToken cookie (HttpOnly for security, readable by proxy.ts & server components)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // 2. Set refreshToken cookie if provided
    if (refreshToken) {
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    // 3. Set client-readable ld_token cookie so apiClient can attach Authorization: Bearer <token>
    // to prevent Safari / iOS cross-origin cookie blockage
    response.cookies.set("ld_token", accessToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to establish session",
      },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Session cleared successfully",
  });

  const cookieOptions = {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };

  response.cookies.set("accessToken", "", cookieOptions);
  response.cookies.set("refreshToken", "", cookieOptions);
  response.cookies.set("ld_token", "", cookieOptions);

  return response;
}

