"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { useGetMe } from "@/hooks/auth.hook";
import {
  useIsMobileDrawerOpen,
  useSetMobileDrawerOpen,
} from "@/store/useAppStore";
import { MobileDrawer } from "./MobileDrawer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const mobileDrawerOpen = useIsMobileDrawerOpen();
  const setMobileDrawerOpen = useSetMobileDrawerOpen();
  const router = useRouter();

  const { data: meRes, isLoading, isError } = useGetMe();
  const authUser = meRes?.data?.user || null;

  // Redirect to login if the session check finished and no user was found
  useEffect(() => {
    if (!isLoading && (isError || !authUser)) {
      router.replace("/login");
    }
  }, [isLoading, isError, authUser, router]);

  // While checking auth, show a full-screen loader so the dashboard never
  // flashes to an unauthenticated visitor
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary font-medium">
            Verifying session…
          </p>
        </div>
      </div>
    );
  }

  // After loading: if there's no authenticated user, render nothing while the
  // redirect above fires (avoids a flash of the protected content)
  if (!authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Desktop Sidebar (hidden below 1024px, fixed on desktop) */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-40">
        <Sidebar />
      </div>

      {/* Mobile Drawer (visible on < 1024px when toggled) */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-60 min-w-0 min-h-screen">
        <Topbar onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
