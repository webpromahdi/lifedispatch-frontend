"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, KeyRound, LogOut, Menu, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
  const { data: meRes, isLoading } = useGetMe();
  const authUser = meRes?.data?.user || null;

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
    <>
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

        {/* Right: Square Avatar + Name + Role + Dropdown Menu */}
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
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-3 p-1.5 hover:bg-slate-50 transition-colors cursor-pointer rounded-none outline-none focus-visible:ring-1 focus-visible:ring-primary border border-transparent hover:border-border"
                aria-label="User profile and account options"
              >
                <div className="w-9 h-9 bg-[#CCFBF1] text-primary-dark font-bold text-sm flex items-center justify-center rounded-none shrink-0 shadow-xs">
                  {userInitials}
                </div>
                <div className="flex flex-col text-left sm:flex">
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
