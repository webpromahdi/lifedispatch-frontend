"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/auth.hook";

// Map API role values to human-readable display labels
const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  DISPATCHER: "Dispatcher",
  DRIVER: "Driver",
  HOSPITAL_STAFF: "Hospital Staff",
  PATIENT: "Patient",
};

export interface TopbarProps {
  onOpenMobileDrawer: () => void;
}

export function Topbar({ onOpenMobileDrawer }: TopbarProps) {
  const { data: meRes, isLoading } = useGetMe();
  const authUser = meRes?.data?.user || null;

  // Determine greeting based on current time
  const currentHour = new Date().getHours();
  let greetingTime = "morning";
  if (currentHour >= 12 && currentHour < 17) {
    greetingTime = "afternoon";
  } else if (currentHour >= 17) {
    greetingTime = "evening";
  }

  const userName = authUser?.name ?? "–";
  const userRole = authUser?.role
    ? (ROLE_LABELS[authUser.role] ?? authUser.role)
    : "–";
  const userInitials = authUser
    ? authUser.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "–";
  const firstName = authUser ? authUser.name.split(" ")[0] : "there";

  return (
    <header className="h-16 bg-white border-b border-border px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Left: Mobile Drawer Trigger + Greeting */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="lg:hidden min-h-11 min-w-11 text-text-primary hover:bg-muted rounded-none cursor-pointer"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
          Good {greetingTime},{" "}
          {isLoading ? (
            <span className="inline-block w-24 h-5 bg-slate-200 animate-pulse rounded align-middle" />
          ) : (
            firstName
          )}
        </h1>
      </div>

      {/* Right: Square Avatar + Name + Role + Caret */}
      <div className="flex items-center gap-3">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-200 animate-pulse rounded-none shrink-0" />
            <div className="flex flex-col gap-1">
              <div className="w-24 h-3.5 bg-slate-200 animate-pulse rounded" />
              <div className="w-16 h-3 bg-slate-100 animate-pulse rounded" />
            </div>
          </div>
        ) : (
          <>
            <div className="w-9 h-9 bg-[#CCFBF1] text-primary-dark font-bold text-sm flex items-center justify-center rounded-none shrink-0 shadow-xs">
              {userInitials}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-text-primary leading-tight">
                {userName}
              </span>
              <span className="text-xs text-text-secondary leading-tight mt-0.5">
                {userRole}
              </span>
            </div>
            <svg
              className="w-3.5 h-3.5 text-text-primary shrink-0 ml-0.5"
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2.5 4.5L6 8L9.5 4.5H2.5Z" />
            </svg>
          </>
        )}
      </div>
    </header>
  );
}
