"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer surface */}
      <div
        className={cn(
          "relative w-72 max-w-[85vw] bg-surface h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Close button */}
        <div className="absolute top-3 right-3 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="h-10 w-10 min-h-[44px] min-w-[44px] rounded-lg text-text-muted hover:text-text-primary hover:bg-muted cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <Sidebar className="w-full border-r-0 h-full" onNavClick={onClose} />
      </div>
    </div>
  );
}
