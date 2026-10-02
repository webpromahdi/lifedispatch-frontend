"use client";

import {
  Ambulance,
  Building2,
  Clock,
  CreditCard,
  FileText,
  Home,
  LogOut,
  SquarePlus,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { seedEmergencies } from "@/lib/dummy/emergencies";
import { EmergencyStatus } from "@/lib/types/enums";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  isAction?: boolean;
  iconClassName?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface SidebarProps {
  className?: string;
  onNavClick?: () => void;
  customNavSections?: NavSection[];
}

export function Sidebar({
  className,
  onNavClick,
  customNavSections,
}: SidebarProps) {
  const pathname = usePathname();
  const isPatient = pathname.startsWith("/dashboard/patient");
  const isAdmin = pathname.startsWith("/dashboard/admin");

  // Track patient active emergency state
  const [hasActiveEmergency, setHasActiveEmergency] = useState<boolean>(() => {
    // Check initial seed data
    const active = seedEmergencies.find(
      (e) =>
        e.patientId === "usr_patient_01" &&
        (e.status === EmergencyStatus.PENDING ||
          e.status === EmergencyStatus.PRIORITIZED ||
          e.status === EmergencyStatus.DISPATCHING ||
          e.status === EmergencyStatus.ACTIVE_TRIP),
    );
    return Boolean(active);
  });

  useEffect(() => {
    const handleStatusUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ hasActiveEmergency: boolean }>;
      if (typeof customEvent.detail?.hasActiveEmergency === "boolean") {
        setHasActiveEmergency(customEvent.detail.hasActiveEmergency);
      }
    };

    window.addEventListener(
      "lifedispatch:emergency-status",
      handleStatusUpdate,
    );
    return () => {
      window.removeEventListener(
        "lifedispatch:emergency-status",
        handleStatusUpdate,
      );
    };
  }, []);

  const handleTriggerEmergencyModal = () => {
    if (hasActiveEmergency) {
      toast.info("Active Emergency in Progress", {
        description: "You already have an active emergency response underway.",
      });
      return;
    }
    if (onNavClick) onNavClick();
    window.dispatchEvent(new CustomEvent("lifedispatch:open-request-modal"));
  };



  // Define nav sections per role
  let navSections: NavSection[] = customNavSections || [];

  if (!customNavSections) {
    if (pathname.startsWith("/dashboard/super-admin")) {
      navSections = [
        {
          title: "MAIN",
          items: [
            {
              label: "Overview",
              href: "/dashboard/super-admin",
              icon: Home,
            },
            {
              label: "Emergencies",
              href: "/dashboard/admin/emergencies",
              icon: FileText,
            },
          ],
        },
        {
          title: "FLEET AND FACILITIES",
          items: [
            {
              label: "Ambulances",
              href: "/dashboard/admin/ambulances",
              icon: Ambulance,
            },
            {
              label: "Drivers",
              href: "/dashboard/admin/drivers",
              icon: User,
            },
            {
              label: "Hospitals",
              href: "/dashboard/admin/hospitals",
              icon: Building2,
              iconClassName: "text-secondary",
            },
          ],
        },
        {
          title: "SYSTEM",
          items: [
            {
              label: "Users",
              href: "/dashboard/super-admin/users",
              icon: Users,
            },
            {
              label: "Audit Logs",
              href: "/dashboard/super-admin/audit-logs",
              icon: FileText,
            },
          ],
        },
      ];
    } else if (isAdmin) {
      navSections = [
        {
          title: "MAIN",
          items: [
            {
              label: "Overview",
              href: "/dashboard/admin",
              icon: Home,
            },
            {
              label: "Emergencies",
              href: "/dashboard/admin/emergencies",
              icon: FileText,
            },
          ],
        },
        {
          title: "FLEET AND FACILITIES",
          items: [
            {
              label: "Ambulances",
              href: "/dashboard/admin/ambulances",
              icon: Ambulance,
            },
            {
              label: "Drivers",
              href: "/dashboard/admin/drivers",
              icon: User,
            },
            {
              label: "Hospitals",
              href: "/dashboard/admin/hospitals",
              icon: Building2,
              iconClassName: "text-secondary",
            },
          ],
        },
        {
          title: "SYSTEM",
          items: [
            {
              label: "Users",
              href: "/dashboard/admin/users",
              icon: Users,
            },
            {
              label: "Audit Logs",
              href: "/dashboard/admin/audit-logs",
              icon: FileText,
            },
          ],
        },
      ];
    } else if (pathname.startsWith("/dashboard/driver")) {
      navSections = [
        {
          title: "MAIN",
          items: [
            {
              label: "Overview",
              href: "/dashboard/driver",
              icon: Home,
            },
            {
              label: "Trip History",
              href: "/dashboard/driver/trips",
              icon: Clock,
            },
            {
              label: "Driver Profile",
              href: "/dashboard/driver/profile",
              icon: UserCheck,
            },
          ],
        },
      ];
    } else if (isPatient) {
      // ── Dedicated Patient Navigation matching Reference UI ──
      navSections = [
        {
          title: "MAIN",
          items: [
            {
              label: "Overview",
              href: "/dashboard/patient",
              icon: Home,
            },
            {
              label: "Request Emergency",
              href: "#request",
              icon: SquarePlus,
              isAction: true,
            },
            {
              label: "My Emergencies",
              href: "/dashboard/patient/history",
              icon: FileText,
            },
          ],
        },
        {
          title: "ACCOUNT",
          items: [
            {
              label: "Payments",
              href: "/dashboard/patient#payment",
              icon: CreditCard,
            },
            {
              label: "Profile",
              href: "/dashboard/patient#profile",
              icon: User,
            },
          ],
        },
      ];
    } else if (pathname.startsWith("/dashboard/hospital-staff")) {
      navSections = [
        {
          title: "MAIN",
          items: [
            {
              label: "Overview",
              href: "/dashboard/hospital-staff",
              icon: Home,
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
          ],
        },
      ];
    } else {
      // Default Dispatcher nav sections
      navSections = [
        {
          title: "MAIN",
          items: [
            {
              label: "Overview",
              href: "/dashboard/dispatcher",
              icon: Home,
            },
            {
              label: "Emergencies",
              href: "/dashboard/dispatcher/dispatch",
              icon: FileText,
            },
          ],
        },
        {
          title: "FLEET AND FACILITIES",
          items: [
            {
              label: "Ambulances",
              href: "/dashboard/dispatcher/ambulances",
              icon: Ambulance,
            },
            {
              label: "Drivers",
              href: "/dashboard/dispatcher#drivers",
              icon: User,
            },
            {
              label: "Hospitals",
              href: "/dashboard/dispatcher#hospitals",
              icon: Building2,
              iconClassName: "text-secondary",
            },
          ],
        },
      ];
    }
  }

  return (
    <aside
      className={cn(
        "w-60 h-screen bg-sidebar border-r border-border flex flex-col justify-between shrink-0 select-none overflow-y-auto",
        className,
      )}
    >
      <div className="flex flex-col">
        {/* Brand Logo Header */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between shrink-0 bg-surface">
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

        {/* Nav Sections */}
        <nav
          className="p-3 space-y-4"
          aria-label="Dashboard sidebar navigation"
        >
          {navSections.map((section) => (
            <div key={section.title || "section"} className="space-y-1">
              {section.title && (
                <div className="px-3 pb-1 pt-2 text-[10px] font-bold tracking-wider text-text-muted uppercase">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive =
                  !item.isAction &&
                  (pathname === item.href ||
                    (item.href !== "/dashboard/patient" &&
                      item.href !== "/dashboard/admin" &&
                      pathname.startsWith(item.href)));
                const Icon = item.icon;

                if (item.isAction) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={handleTriggerEmergencyModal}
                      disabled={hasActiveEmergency}
                      title={
                        hasActiveEmergency
                          ? "Active emergency in progress"
                          : "Request emergency ambulance"
                      }
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all group min-h-11 text-left cursor-pointer rounded-none",
                        hasActiveEmergency
                          ? "text-text-muted opacity-50 cursor-not-allowed"
                          : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover font-medium",
                      )}
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 transition-colors text-text-muted group-hover:text-text-primary"
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavClick}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm transition-all group min-h-11 rounded-none",
                      isActive
                        ? "bg-primary-light text-primary-dark border-l-2 border-primary font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-slate-50 font-medium",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-primary"
                          : item.iconClassName ||
                              "text-text-muted group-hover:text-text-primary",
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom section */}
      {isPatient ? (
        <div className="p-4 border-t border-border space-y-3 bg-white shrink-0">
          {/* Solid teal Request Emergency button */}
          <button
            type="button"
            onClick={handleTriggerEmergencyModal}
            disabled={hasActiveEmergency}
            title={
              hasActiveEmergency
                ? "Active emergency in progress"
                : "Request urgent medical ambulance"
            }
            className={cn(
              "w-full h-11 px-4 flex items-center justify-center gap-2.5 font-bold text-sm text-white select-none transition-all rounded-none",
              hasActiveEmergency
                ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60 shadow-none"
                : "bg-primary hover:bg-primary-dark active:translate-y-px shadow-sm cursor-pointer",
            )}
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
            }}
          >
            <Ambulance className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Request Emergency</span>
          </button>

          {/* Clean Logout link */}
          <Link
            href="/login"
            onClick={onNavClick}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-primary hover:text-destructive hover:bg-slate-50 transition-colors rounded-none min-h-11"
          >
            <LogOut
              className="h-4 w-4 shrink-0 text-text-primary"
              aria-hidden="true"
            />
            <span>Logout</span>
          </Link>
        </div>
      ) : (
        <div className="p-4 border-t border-border bg-white shrink-0">
          <Link
            href="/login"
            onClick={onNavClick}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-primary hover:text-destructive hover:bg-slate-50 transition-colors rounded-none min-h-11"
          >
            <LogOut
              className="h-4 w-4 shrink-0 text-text-primary"
              aria-hidden="true"
            />
            <span>Logout</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
