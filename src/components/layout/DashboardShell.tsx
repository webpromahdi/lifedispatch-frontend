"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { DemoRoleSwitcher } from "./DemoRoleSwitcher";
import { MobileDrawer } from "./MobileDrawer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

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
          <div className="max-w-7xl mx-auto w-full">
            {/* Page transition: opacity: 0→1, y: 10→0, 0.25s ease, via AnimatePresence keyed by usePathname() */}
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Floating Demo Role Switcher placed at bottom-left; Toaster is at bottom-right (no collision) */}
        <DemoRoleSwitcher floating />
      </div>
    </div>
  );
}
