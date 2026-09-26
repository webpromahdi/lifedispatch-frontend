"use client";

import {
  Hospital,
  Radio,
  Shield,
  ShieldAlert,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ROLES = [
  { name: "Super Admin", path: "/dashboard/super-admin", icon: Shield },
  { name: "Admin", path: "/dashboard/admin", icon: ShieldAlert },
  { name: "Dispatcher", path: "/dashboard/dispatcher", icon: Radio },
  { name: "Driver", path: "/dashboard/driver", icon: Truck },
  { name: "Patient", path: "/dashboard/patient", icon: User },
  { name: "Hospital Staff", path: "/dashboard/hospital-staff", icon: Hospital },
];

export function DemoRoleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div
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
    </div>
  );
}
