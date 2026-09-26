"use client";

import {
  ChevronDown,
  ChevronUp,
  Hospital,
  Layers,
  Radio,
  Shield,
  ShieldAlert,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ROLES = [
  { name: "Super Admin", path: "/dashboard/super-admin", icon: Shield },
  { name: "Admin", path: "/dashboard/admin", icon: ShieldAlert },
  { name: "Dispatcher", path: "/dashboard/dispatcher", icon: Radio },
  { name: "Driver", path: "/dashboard/driver", icon: Truck },
  { name: "Patient", path: "/dashboard/patient", icon: User },
  { name: "Hospital Staff", path: "/dashboard/hospital-staff", icon: Hospital },
];

export interface DemoRoleSwitcherProps {
  className?: string;
  floating?: boolean;
}

export function DemoRoleSwitcher({
  className,
  floating = false,
}: DemoRoleSwitcherProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If floating mode, renders fixed at bottom-left, completely separated from Sonner Toaster at bottom-right
  if (floating) {
    return (
      <aside
        aria-label="Demo role floating switcher"
        className={cn(
          "fixed bottom-4 left-4 md:left-[256px] z-40 transition-all duration-200 select-none",
          className,
        )}
      >
        <div className="bg-surface/95 backdrop-blur-md border border-border shadow-lg rounded-2xl p-1.5 flex items-center gap-1.5 max-w-[calc(100vw-2rem)] sm:max-w-none overflow-x-auto">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted hover:text-text-primary rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label={isCollapsed ? "Expand demo role switcher" : "Collapse demo role switcher"}
            title="Toggle role switcher"
          >
            <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span className="hidden sm:inline">Role Switcher</span>
            {isCollapsed ? (
              <ChevronUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            )}
          </button>

          {!isCollapsed && (
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {ROLES.map((role) => {
                const isActive = pathname.startsWith(role.path);
                const Icon = role.icon;

                return (
                  <Link
                    key={role.path}
                    href={role.path}
                    aria-label={`Switch demo role to ${role.name}`}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 min-h-[38px] cursor-pointer",
                      isActive
                        ? "bg-primary text-white shadow-xs font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-background border border-transparent hover:border-border",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{role.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    );
  }

  // Inline mode (used in Topbar or Dev Gallery)
  return (
    <nav
      aria-label="Demo role selector"
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto py-1",
        className,
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-text-muted mr-1 shrink-0 hidden sm:inline">
        Demo Role:
      </span>
      {ROLES.map((role) => {
        const isActive = pathname.startsWith(role.path);
        const Icon = role.icon;

        return (
          <Link
            key={role.path}
            href={role.path}
            aria-label={`Switch demo role to ${role.name}`}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 min-h-[38px] cursor-pointer",
              isActive
                ? "bg-primary-light text-primary border border-primary/30 shadow-2xs font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-background border border-border",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{role.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
