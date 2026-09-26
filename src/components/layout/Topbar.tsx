"use client";

import { Bell, Menu } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DemoRoleSwitcher } from "./DemoRoleSwitcher";

export interface TopbarProps {
  onOpenMobileDrawer: () => void;
}

export function Topbar({ onOpenMobileDrawer }: TopbarProps) {
  const handleNotificationClick = () => {
    toast.info("Notifications", {
      description: "All emergency dispatch channels operational.",
    });
  };

  return (
    <header className="h-16 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30">
      {/* Left: Mobile hamburger menu + Mobile logo */}
      <div className="flex items-center gap-2">
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

        {/* Desktop Role switcher */}
        <div className="hidden lg:flex items-center">
          <DemoRoleSwitcher />
        </div>
      </div>

      {/* Right: Actions, Notifications & Avatar */}
      <div className="flex items-center gap-3">
        {/* Compact role switcher on tablet */}
        <div className="hidden sm:flex lg:hidden items-center">
          <DemoRoleSwitcher />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotificationClick}
          aria-label="View system notifications"
          className="relative min-h-[44px] min-w-[44px] text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg cursor-pointer"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-status" />
        </Button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <Avatar className="h-8 w-8 ring-1 ring-border">
            <AvatarImage
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Active User"
            />
            <AvatarFallback className="bg-primary-light text-primary text-xs font-semibold">
              LD
            </AvatarFallback>
          </Avatar>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-text-primary leading-none">
              LifeDispatch HQ
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">
              Live Operations
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
