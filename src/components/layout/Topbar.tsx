"use client";

import { Bell, Menu, Search } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoRoleSwitcher } from "./DemoRoleSwitcher";

export interface TopbarProps {
  onOpenMobileDrawer: () => void;
}

export function Topbar({ onOpenMobileDrawer }: TopbarProps) {
  const pathname = usePathname();

  // Dynamic profile metadata based on active role
  let userName = "Dispatch Central";
  let userRole = "Operations";
  let userInitials = "DC";
  let userAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";

  if (pathname.startsWith("/dashboard/super-admin")) {
    userName = "Dr. Tariq Rahman";
    userRole = "Super Admin";
    userInitials = "TR";
    userAvatar =
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80";
  } else if (pathname.startsWith("/dashboard/admin")) {
    userName = "Afsana Karim";
    userRole = "System Admin";
    userInitials = "AK";
    userAvatar =
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80";
  } else if (pathname.startsWith("/dashboard/driver")) {
    userName = "Rafiqul Islam";
    userRole = "Paramedic Driver";
    userInitials = "RI";
    userAvatar =
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80";
  } else if (pathname.startsWith("/dashboard/patient")) {
    userName = "Fatima Begum";
    userRole = "Verified Patient";
    userInitials = "FB";
    userAvatar =
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80";
  } else if (pathname.startsWith("/dashboard/hospital-staff")) {
    userName = "Dr. Naila Zaman";
    userRole = "Hospital Staff";
    userInitials = "NZ";
    userAvatar =
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80";
  }

  const handleNotificationClick = () => {
    toast.info("Active Operations Feed", {
      description: "3 emergency telematics channels actively streaming.",
    });
  };

  return (
    <header className="h-16 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30">
      {/* Left: Mobile hamburger menu + Mobile logo + Desktop Role switcher */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileDrawer}
          aria-label="Open mobile navigation menu"
          className="md:hidden min-h-[44px] min-w-[44px] text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg cursor-pointer"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="md:hidden flex items-center">
          <Image
            src="/lifedispatch-logo-header.png"
            alt="LifeDispatch"
            width={120}
            height={28}
            className="h-6 w-auto object-contain"
          />
        </div>

        {/* Desktop Quick Role Switcher */}
        <div className="hidden lg:flex items-center">
          <DemoRoleSwitcher />
        </div>
      </div>

      {/* Middle: Global Search Input (UI only per Phase 3.1) */}
      <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-6">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search incidents, vehicles, staff, or hospitals..."
            className="w-full pl-9 pr-4 h-9 bg-background/80 border-border text-xs rounded-lg focus-visible:ring-1 focus-visible:ring-primary"
            aria-label="Global quick search"
          />
        </div>
      </div>

      {/* Right: Actions, Notifications & User Avatar + Role Pill */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Compact role switcher on tablet */}
        <div className="hidden sm:flex lg:hidden items-center">
          <DemoRoleSwitcher />
        </div>

        {/* Notification Bell with Badge Count */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotificationClick}
          aria-label="View notifications (3 unread)"
          className="relative min-h-[44px] min-w-[44px] text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg cursor-pointer"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute top-2 right-2 h-4 min-w-[16px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-2xs">
            3
          </span>
        </Button>

        {/* User Profile + Role Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <Avatar className="h-8 w-8 ring-1 ring-border">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary-light text-primary text-xs font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-text-primary leading-none">
                {userName}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] py-0 px-1.5 h-4.5 bg-primary-light text-primary border-primary/20 font-medium"
              >
                {userRole}
              </Badge>
            </div>
            <span className="text-[11px] text-text-muted mt-0.5 font-mono">
              Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
