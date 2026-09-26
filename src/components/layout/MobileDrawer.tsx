"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-text-primary/50 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Surface - Slide in from left */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-72 max-w-[85vw] bg-surface h-full shadow-2xl z-10 flex flex-col"
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

            <Sidebar
              className="w-full border-r-0 h-full"
              onNavClick={onClose}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
