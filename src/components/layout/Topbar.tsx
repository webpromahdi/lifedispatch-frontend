"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export interface TopbarProps {
  onOpenMobileDrawer: () => void;
}

export function Topbar({ onOpenMobileDrawer }: TopbarProps) {
  const pathname = usePathname();

  // Determine greeting based on current time
  const currentHour = new Date().getHours();
  let greetingTime = "morning";
  if (currentHour >= 12 && currentHour < 17) {
    greetingTime = "afternoon";
  } else if (currentHour >= 17) {
    greetingTime = "evening";
  }

  // Dynamic profile metadata based on active role
  let userName = "Kazi Nabil";
  let userRole = "Dispatcher";
  let userInitials = "KN";

  if (pathname.startsWith("/dashboard/super-admin")) {
    userName = "Dr. Tariq Rahman";
    userRole = "Super Admin";
    userInitials = "TR";
  } else if (pathname.startsWith("/dashboard/admin")) {
    userName = "Rafiq Hasan";
    userRole = "Admin";
    userInitials = "R";
  } else if (pathname.startsWith("/dashboard/driver")) {
    userName = "Kamal Hossain";
    userRole = "Driver";
    userInitials = "KH";
  } else if (pathname.startsWith("/dashboard/patient")) {
    userName = "Nafisa Anjum";
    userRole = "Patient";
    userInitials = "N";
  } else if (pathname.startsWith("/dashboard/hospital-staff")) {
    userName = "Dr. Rafiqul Islam";
    userRole = "Hospital Staff";
    userInitials = "RI";
  }

  const firstName = userName.split(" ")[0];

  return (
    <header className="h-16 bg-white border-b border-border px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Left: Mobile Drawer Trigger + Greeting */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="lg:hidden min-h-[44px] min-w-[44px] text-text-primary hover:bg-muted rounded-none cursor-pointer"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
          Good {greetingTime}, {firstName}
        </h1>
      </div>

      {/* Right: Square Avatar + Name + Role + Caret */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#CCFBF1] text-[#0D9488] font-bold text-sm flex items-center justify-center rounded-none shrink-0 shadow-xs">
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
      </div>
    </header>
  );
}
