"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TableDensityToggle } from "@/components/common/DataTable";
import { ChangePasswordDialog } from "@/components/shared/ChangePasswordDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMe, useLogout, useLogoutAll } from "@/hooks/auth.hook";
import { useHasHydrated } from "@/hooks/useHasHydrated";
import {
  useIsEmergencySoundMuted,
  useIsSidebarCollapsed,
  useToggleEmergencySoundMuted,
  useToggleSidebarCollapsed,
} from "@/store/useAppStore";

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: meRes, isLoading, isError } = useGetMe();
  const authUser = meRes?.data?.user || null;
  const isUserLoading = isLoading || (!authUser && !isError);

  const isSidebarCollapsed = useIsSidebarCollapsed();
  const toggleSidebar = useToggleSidebarCollapsed();
  const isEmergencySoundMuted = useIsEmergencySoundMuted();
  const toggleEmergencySoundMuted = useToggleEmergencySoundMuted();
  const hasHydrated = useHasHydrated();
  const isCollapsed = hasHydrated && isSidebarCollapsed;
  const isMuted = hasHydrated ? isEmergencySoundMuted : false;

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogout();
  const { mutate: logoutAllMutate, isPending: isLoggingOutAll } =
    useLogoutAll();

  // If backend flags mustChangePassword, auto-open the change password dialog
  const isForcedPasswordChange = Boolean(authUser?.mustChangePassword);

  useEffect(() => {
    if (isForcedPasswordChange) {
      setChangePasswordOpen(true);
    }
  }, [isForcedPasswordChange]);

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSettled: () => {
        queryClient.setQueryData(["user", "me"], null);
        toast.success("Logged out successfully");
        router.push("/login");
      },
    });
  };

  const handleLogoutAll = () => {
    logoutAllMutate(undefined, {
      onSettled: () => {
        queryClient.setQueryData(["user", "me"], null);
        toast.success("Logged out from all devices");
        router.push("/login");
      },
    });
  };

  // Determine greeting based on current time
  const currentHour = new Date().getHours();
  let greetingTime = "morning";
  if (currentHour >= 12 && currentHour < 17) {
    greetingTime = "afternoon";
  } else if (currentHour >= 17) {
    greetingTime = "evening";
  }

  const userName = authUser?.name?.trim() || "User";
  const userRole = authUser?.role
    ? (ROLE_LABELS[authUser.role] ?? authUser.role)
    : "Member";
  const userInitials = authUser?.name
    ? authUser.name
        .trim()
        .split(/\s+/)
        .map((n: string) => n[0])
        .filter(Boolean)
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";
  const firstName = authUser?.name
    ? authUser.name.trim().split(/\s+/)[0]
    : "there";

  return (
    <>
      <header className="h-16 bg-white border-b border-border px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
        {/* Left: Mobile Drawer Trigger + Desktop Sidebar Toggle + Greeting */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileDrawer}
            aria-label="Open navigation menu"
            className="lg:hidden min-h-11 min-w-11 text-text-primary hover:bg-muted rounded-none cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={isCollapsed}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:inline-flex min-h-9 min-w-9 h-9 w-9 text-text-secondary hover:text-text-primary hover:bg-muted rounded-none cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>

          <h1 className="text-base sm:text-xl font-bold text-text-primary tracking-tight truncate max-w-35 sm:max-w-none">
            Good {greetingTime},{" "}
            {isUserLoading ? (
              <span className="inline-block w-24 h-5 bg-slate-200 animate-pulse rounded align-middle" />
            ) : (
              firstName
            )}
          </h1>
        </div>

        {/* Right: Table Density + Sound Mute Toggle + User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Table Density Selector */}
          <TableDensityToggle className="hidden sm:inline-flex" />

          {/* Emergency Audio Siren Mute Toggle */}
          <Button
            variant="ghost"
            size="icon"
            data-alert-control="true"
            onClick={toggleEmergencySoundMuted}
            aria-label={
              isMuted ? "Unmute emergency sirens" : "Mute emergency sirens"
            }
            aria-pressed={isMuted}
            title={
              isMuted
                ? "Emergency siren audio is muted (click to unmute)"
                : "Emergency siren audio is active (click to mute)"
            }
            className="min-h-9 min-w-9 h-9 w-9 text-text-secondary hover:text-text-primary hover:bg-muted rounded-none cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-text-muted" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
          </Button>
          {isUserLoading ? (
            <div
              className="flex items-center gap-2 sm:gap-3"
              role="status"
              aria-busy="true"
            >
              <span className="sr-only">Loading user profile</span>
              <div className="w-9 h-9 bg-slate-200 animate-pulse rounded-none shrink-0" />
              <div className="hidden sm:flex flex-col gap-1.5">
                <div className="w-24 h-3.5 bg-slate-200 animate-pulse rounded" />
                <div className="w-16 h-3 bg-slate-100 animate-pulse rounded" />
              </div>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 sm:gap-3 p-1.5 hover:bg-slate-50 transition-colors cursor-pointer rounded-none outline-hidden focus-visible:ring-2 focus-visible:ring-primary border border-transparent hover:border-border"
                aria-label="User profile and account options"
              >
                <div className="w-9 h-9 bg-[#CCFBF1] text-primary-dark font-bold text-sm flex items-center justify-center rounded-none shrink-0 shadow-xs">
                  {userInitials}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-semibold text-text-primary leading-tight">
                    {userName}
                  </span>
                  <span className="text-xs text-text-secondary leading-tight mt-0.5">
                    {userRole}
                  </span>
                </div>
                <ChevronDown
                  className="w-4 h-4 text-text-muted shrink-0 ml-0.5"
                  aria-hidden="true"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="w-64 rounded-none p-1.5 bg-white border border-border shadow-lg"
              >
                {/* User identity summary */}
                <DropdownMenuLabel className="p-2 space-y-1">
                  <p className="text-sm font-bold text-text-primary truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {authUser?.email || "No email available"}
                  </p>
                  <div className="pt-1">
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-semibold bg-primary-light text-primary-dark border-primary/20 rounded-none px-1.5 py-0"
                    >
                      {userRole}
                    </Badge>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-1 border-border" />

                {/* Change Password action */}
                <DropdownMenuItem
                  onClick={() => setChangePasswordOpen(true)}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-text-primary hover:bg-slate-100 cursor-pointer rounded-none"
                >
                  <KeyRound
                    className="h-4 w-4 text-text-secondary"
                    aria-hidden="true"
                  />
                  <span>Change Password</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 border-border" />

                {/* Log Out action */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-text-primary hover:bg-slate-100 cursor-pointer rounded-none disabled:opacity-50"
                >
                  <LogOut
                    className="h-4 w-4 text-text-secondary"
                    aria-hidden="true"
                  />
                  <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
                </DropdownMenuItem>

                {/* Log Out All Devices action */}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogoutAll}
                  disabled={isLoggingOutAll}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-destructive hover:bg-red-50 cursor-pointer rounded-none disabled:opacity-50"
                >
                  <ShieldAlert
                    className="h-4 w-4 text-destructive"
                    aria-hidden="true"
                  />
                  <span>
                    {isLoggingOutAll ? "Terminating..." : "Log Out All Devices"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        isForced={isForcedPasswordChange}
      />
    </>
  );
}
