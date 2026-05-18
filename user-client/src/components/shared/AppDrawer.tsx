"use client";

import { X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   AppDrawer — a reusable bottom-sheet drawer.

   Usage (minimal):
     <AppDrawer open={open} onOpenChange={setOpen}>
       <YourContent />
     </AppDrawer>

   Usage (with title / description / footer):
     <AppDrawer
       open={open}
       onOpenChange={setOpen}
       title="Filter"
       description="Narrow down results"
       footer={<Button onClick={() => setOpen(false)}>Apply</Button>}
     >
       <FilterForm />
     </AppDrawer>
───────────────────────────────────────────────────────────────────────── */

export interface AppDrawerProps {
  /** Controls visibility */
  open: boolean;
  /** Called with `false` when the drawer should close */
  onOpenChange: (open: boolean) => void;
  /** Optional title rendered in the header */
  title?: string;
  /** Optional description rendered below the title */
  description?: string;
  /** Content rendered inside the drawer body */
  children: React.ReactNode;
  /** Optional footer content (actions, buttons, etc.) */
  footer?: React.ReactNode;
  /** Show an explicit close × button in the header */
  showCloseButton?: boolean;
  /** Extra classes for the DrawerContent panel */
  className?: string;
}

export function AppDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  className,
}: AppDrawerProps) {
  const hasHeader = title || description || showCloseButton;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>

      <DrawerContent
        className={cn(
          "px-0 border-none bg-transparent shadow-none", // remove default
          className
        )}
      >
        {title && <DrawerTitle>{title}</DrawerTitle>}
        {/* Actual panel (same as dialog card) */}
        <div
          className={cn(
            "relative bg-white rounded-t-3xl",
            "shadow-[0_-8px_40px_rgba(111,85,200,0.16)]",
            "p-6"
          )}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {/* Close button */}
          {showCloseButton && (
            <DrawerClose asChild>
              <button
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#F8F7FD] hover:bg-[#EDE9FF]"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4 text-[#6B6480]" />
              </button>
            </DrawerClose>
          )}

          {/* Header */}
          {hasHeader && (
            <DrawerHeader className="px-0 pt-0">
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
          )}

          {/* Content */}
          <div className="pt-2 pb-2">{children}</div>

          {/* Footer */}
          {footer && (
            <DrawerFooter className="px-0 pb-0 pt-4">
              {footer}
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}