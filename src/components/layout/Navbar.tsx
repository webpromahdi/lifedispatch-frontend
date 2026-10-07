"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMe, useLogout } from "@/hooks/auth.hook";

export function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: meRes, isLoading } = useGetMe();
  const authUser = meRes?.data?.user || null;
  const { mutate: logoutMutate } = useLogout();

  const getDashboardUrl = (role: string) => {
    switch (role.toLowerCase()) {
      case "super admin":
        return "/dashboard/super-admin";
      case "admin":
        return "/dashboard/admin";
      case "dispatcher":
        return "/dashboard/dispatcher";
      case "driver":
        return "/dashboard/driver";
      case "hospital staff":
        return "/dashboard/hospital-staff";
      default:
        return "/dashboard/patient";
    }
  };

  const dashboardUrl = authUser
    ? getDashboardUrl(authUser.role)
    : "/dashboard/patient";
  const userInitials = authUser
    ? authUser.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "";

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSettled: () => {
        queryClient.setQueryData(["user", "me"], null);
        toast.success("Logged out successfully");
        router.push("/login");
      },
    });
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setScrolled(y > 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={[
        "fixed left-0 right-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_16px_0_rgba(15,23,42,0.04)]"
          : "bg-transparent border-b-0 shadow-none",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-17.5 grid grid-cols-[auto_1fr_auto] items-center gap-6">
        {/* ── Logo (left zone) ── */}
        <Link
          href="/"
          className="flex items-center focus:outline-hidden shrink-0"
          aria-label="LifeDispatch Home"
        >
          <Image
            src="/lifedispatch-logo-header.png"
            alt="LifeDispatch"
            width={220}
            height={52}
            className="h-10 sm:h-11.5 w-auto object-contain"
            priority
          />
        </Link>

        {/* ── Centered Nav Links (center zone) ── */}
        <nav
          className="hidden md:flex items-center justify-center gap-8 text-[13.5px] font-medium text-slate-500"
          aria-label="Main Navigation"
        >
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Hospital Network", href: "#network" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-1 hover:text-slate-900 transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Right zone: Login CTA + mobile hamburger ── */}
        <div className="flex items-center gap-3 justify-end">
          {/* Desktop: Technical Login Button or User Control */}
          <div className="hidden md:block">
            {isLoading ? (
              <div className="w-32 h-9.5 rounded-[3px] bg-slate-100/80 animate-pulse border-2 border-slate-200"></div>
            ) : authUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-slate-900 rounded-[3px] text-slate-900 font-bold text-sm shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-50 hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0px_0px_#0f172a] transition-all cursor-pointer outline-hidden">
                  <div className="w-6 h-6 bg-primary/10 text-primary flex items-center justify-center rounded-sm text-xs">
                    {userInitials}
                  </div>
                  <span>{authUser.name}</span>
                  <ChevronDown
                    className="h-4 w-4 text-slate-500"
                    strokeWidth={2.5}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white border-2 border-slate-900 rounded-[3px] shadow-[4px_4px_0px_0px_#0f172a] p-1 mt-1"
                >
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-slate-100 font-medium text-slate-700 py-2 rounded-sm outline-hidden"
                    onClick={() => router.push(dashboardUrl)}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-slate-100 font-medium text-slate-700 py-2 rounded-sm outline-hidden"
                    onClick={() => router.push(`${dashboardUrl}#profile`)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200" />
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-red-50 text-red-600 focus:text-red-700 font-bold py-2 rounded-sm outline-hidden"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9.5 px-5 rounded-[3px] border-2 border-slate-900 bg-white text-slate-900 font-bold text-sm shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-50 hover:text-slate-900 active:translate-x-px active:translate-y-px active:shadow-none transition-all cursor-pointer"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="md:hidden min-h-11 min-w-11 p-2 text-slate-900 bg-white border-2 border-slate-900 rounded-[3px] shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-px active:translate-y-px active:shadow-none focus:outline-hidden flex items-center justify-center cursor-pointer transition-all"
          >
            {mobileMenuOpen ? (
              <X
                className="h-5 w-5 text-primary"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            ) : (
              <Menu
                className="h-5 w-5 text-slate-900"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile slide-down menu ── */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-label="Mobile navigation"
          className="md:hidden border-t-2 border-slate-200 bg-white/98 backdrop-blur-md px-6 pt-4 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-1 duration-150"
        >
          <nav
            className="flex flex-col space-y-1"
            aria-label="Mobile Navigation"
          >
            {[
              { label: "Features", id: "features" },
              { label: "How It Works", id: "how-it-works" },
              { label: "Hospital Network", id: "network" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-3 py-3 rounded-[3px] text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-primary transition-colors min-h-11 flex items-center cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="pt-3 border-t-2 border-slate-200">
            {isLoading ? (
              <div className="w-full h-11 rounded-[3px] bg-slate-100 animate-pulse border-2 border-slate-200"></div>
            ) : authUser ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 border-2 border-slate-100 rounded-[3px] bg-slate-50">
                  <div className="w-8 h-8 bg-primary/10 text-primary flex items-center justify-center rounded-sm font-bold text-sm">
                    {userInitials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-none mb-1">
                      {authUser.name}
                    </span>
                    <span className="text-xs font-medium text-slate-500 leading-none">
                      {authUser.role}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="outline"
                    className="w-full min-h-11 border-2 border-slate-200 rounded-[3px] bg-white text-slate-700 font-bold hover:bg-slate-50 hover:text-primary hover:border-primary/30 shadow-none cursor-pointer"
                    onClick={() => {
                      router.push(dashboardUrl);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full min-h-11 border-2 border-slate-200 rounded-[3px] bg-white text-slate-700 font-bold hover:bg-slate-50 hover:text-primary hover:border-primary/30 shadow-none cursor-pointer"
                    onClick={() => {
                      router.push(`${dashboardUrl}#profile`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full min-h-11 border-2 border-slate-900 rounded-[3px] bg-white text-red-600 font-bold shadow-[2px_2px_0px_0px_#0f172a] hover:bg-red-50 hover:text-red-700 active:translate-x-px active:translate-y-px active:shadow-none transition-all cursor-pointer"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full min-h-11 border-2 border-slate-900 rounded-[3px] bg-white text-slate-900 font-bold shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-50 active:translate-x-px active:translate-y-px active:shadow-none transition-all cursor-pointer"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
