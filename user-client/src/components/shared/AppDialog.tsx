"use client";

import * as React from "react";
import { X, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface AppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function AppDialog({
  open,
  onOpenChange,
  title,
  showBack,
  onBack,
  children,
  className,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 border-none bg-transparent shadow-none",
          "max-w-md"
        )}
      >
        <div
          className={cn(
            "relative bg-white rounded-3xl p-8",
            "shadow-[0_8px_48px_rgba(111,85,200,0.18)]",
            className
          )}
        >
          {/* Close button */}
          <DialogClose
            render={
              <button
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#F8F7FD] hover:bg-[#EDE9FF]"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4 text-[#6B6480]" />
              </button>
            }
          />

          {/* Back button */}
          {showBack && (
            <button
              onClick={onBack}
              className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#F8F7FD] hover:bg-[#EDE9FF]"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-[#6B6480]" />
            </button>
          )}

          {/* Title */}
          {title && (
            <DialogTitle className="text-center text-[15px] font-bold text-[#1A1035] mb-4">
              {title}
            </DialogTitle>
          )}

          {/* Content */}
          <div>{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}