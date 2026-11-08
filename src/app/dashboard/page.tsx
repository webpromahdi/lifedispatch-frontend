import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRoleDashboardPath } from "@/lib/utils";

interface JwtPayload {
  role?: string;
  exp?: number;
}

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonStr) as JwtPayload;
  } catch {
    return null;
  }
}

export default async function DashboardRootPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const accessPayload = accessToken ? parseJwtPayload(accessToken) : null;
  const refreshPayload = refreshToken ? parseJwtPayload(refreshToken) : null;

  const role = accessPayload?.role || refreshPayload?.role;

  if (role) {
    redirect(getRoleDashboardPath(role));
  }

  redirect("/login");
}
