"use client";

import type React from "react";
import { useState } from "react";
import { MobileDrawer } from "./MobileDrawer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Desktop Sidebar (hidden on mobile, fixed on desktop) */}
      <div className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:z-40">
        <Sidebar />
      </div>

      {/* Mobile Drawer (visible on < md when toggled) */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-60 min-w-0 min-h-screen">
        <Topbar onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
