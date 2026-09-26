"use client";

import {
  AlertCircle,
  Ambulance,
  BarChart3,
  Building2,
  Clock,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  Radio,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export function Sidebar({
  className,
  onNavClick,
}: {
  className?: string;
  onNavClick?: () => void;
}) {
  const pathname = usePathname();

  // Determine current role based on pathname
  let roleTitle = "Dispatcher";

  if (pathname.startsWith("/dashboard/super-admin")) {
    roleTitle = "Super Admin";
  } else if (pathname.startsWith("/dashboard/admin")) {
    roleTitle = "System Admin";
  } else if (pathname.startsWith("/dashboard/driver")) {
    roleTitle = "Fleet Driver";
  } else if (pathname.startsWith("/dashboard/patient")) {
    roleTitle = "Patient Portal";
  } else if (pathname.startsWith("/dashboard/hospital-staff")) {
    roleTitle = "Hospital ER";
  }

  // Define nav links per role
  let navItems: NavItem[] = [];

  if (pathname.startsWith("/dashboard/super-admin")) {
    navItems = [
      {
        label: "Overview",
        href: "/dashboard/super-admin",
        icon: LayoutDashboard,
      },
      {
        label: "User Management",
        href: "/dashboard/super-admin/users",
        icon: Users,
      },
      {
        label: "System Analytics",
        href: "/dashboard/super-admin/analytics",
        icon: BarChart3,
      },
      {
        label: "Audit Logs",
        href: "/dashboard/super-admin/audit-logs",
        icon: FileText,
      },
    ];
  } else if (pathname.startsWith("/dashboard/admin")) {
    navItems = [
      { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      {
        label: "Emergencies",
        href: "/dashboard/admin/emergencies",
        icon: AlertCircle,
      },
      {
        label: "Ambulance Fleet",
        href: "/dashboard/admin/ambulances",
        icon: Ambulance,
      },
      { label: "Drivers", href: "/dashboard/admin/drivers", icon: UserCheck },
      {
        label: "Hospitals",
        href: "/dashboard/admin/hospitals",
        icon: Building2,
      },
      { label: "Users", href: "/dashboard/admin/users", icon: Users },
      {
        label: "Analytics",
        href: "/dashboard/admin/analytics",
        icon: BarChart3,
      },
      {
        label: "Audit Logs",
        href: "/dashboard/admin/audit-logs",
        icon: FileText,
      },
    ];
  } else if (pathname.startsWith("/dashboard/driver")) {
    navItems = [
      { label: "Active Dispatch", href: "/dashboard/driver", icon: Radio },
      { label: "Trip History", href: "/dashboard/driver/trips", icon: Clock },
      {
        label: "Driver Profile",
        href: "/dashboard/driver/profile",
        icon: UserCheck,
      },
    ];
  } else if (pathname.startsWith("/dashboard/patient")) {
    navItems = [
      {
        label: "Emergency Request",
        href: "/dashboard/patient",
        icon: AlertCircle,
      },
      {
        label: "Medical History",
        href: "/dashboard/patient/history",
        icon: Clock,
      },
    ];
  } else if (pathname.startsWith("/dashboard/hospital-staff")) {
    navItems = [
      {
        label: "ER Capacity",
        href: "/dashboard/hospital-staff",
        icon: Building2,
      },
      {
        label: "Staff Roster",
        href: "/dashboard/hospital-staff/staff",
        icon: Users,
      },
      {
        label: "Shift Schedule",
        href: "/dashboard/hospital-staff/shift",
        icon: Clock,
      },
    ];
  } else {
    // Default Dispatcher nav items
    navItems = [
      {
        label: "Live Queue",
        href: "/dashboard/dispatcher",
        icon: LayoutDashboard,
      },
      {
        label: "Fleet Monitor",
        href: "/dashboard/dispatcher/ambulances",
        icon: Ambulance,
      },
      {
        label: "Dispatch Desk",
        href: "/dashboard/dispatcher/dispatch",
        icon: Radio,
      },
    ];
  }

  return (
    <aside
      className={cn(
        "w-60 h-screen bg-sidebar border-r border-border flex flex-col justify-between shrink-0 select-none",
        className,
      )}
    >
      <div>
        {/* Brand Logo Header */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus:outline-hidden"
            onClick={onNavClick}
          >
            <Image
              src="/lifedispatch-logo-header.png"
              alt="LifeDispatch"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Role indicator banner */}
        <div className="px-5 py-3 bg-background border-b border-border text-xs flex items-center justify-between">
          <span className="text-text-muted">Viewing as:</span>
          <span className="font-semibold text-primary">{roleTitle}</span>
        </div>

        {/* Nav Items */}
        <nav
          className="p-3 space-y-1"
          aria-label="Dashboard sidebar navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group min-h-[44px]",
                  isActive
                    ? "bg-primary-light text-primary border-l-3 border-primary shadow-2xs font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-text-muted group-hover:text-text-primary",
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section with Dev Gallery & Logout */}
      <div className="p-3 border-t border-border space-y-1 bg-surface">
        <Link
          href="/dev/components"
          onClick={onNavClick}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px]",
            pathname === "/dev/components"
              ? "bg-primary-light text-primary font-semibold"
              : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover",
          )}
        >
          <Layers
            className="h-4 w-4 text-secondary shrink-0"
            aria-hidden="true"
          />
          <span>Dev Component Gallery</span>
        </Link>

        <Link
          href="/login"
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive-bg transition-colors min-h-[44px]"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
