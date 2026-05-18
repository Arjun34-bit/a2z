import { ReactNode } from "react";
import { X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Modal — desktop-only centred dialog.
 * On mobile the auth flow is handled by the dedicated /login page.
 */
export function Modal({
  open,
  onClose,
  title,
  showBack,
  onBack,
  children,
  className,
}: ModalProps) {
  if (!open) return null;

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-[#1A1035]/40 z-50"
        onClick={onClose}
      />

      {/* ── Desktop Modal ─────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-full max-w-md bg-white rounded-3xl shadow-[0_8px_48px_rgba(111,85,200,0.18)]",
          "p-8 animate-in fade-in zoom-in-95 duration-300",
          className
        )}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#F8F7FD] hover:bg-[#EDE9FF] transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-[#6B6480]" />
        </button>

        {/* Back */}
        {showBack && (
          <button
            onClick={onBack}
            className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#F8F7FD] hover:bg-[#EDE9FF] transition-colors z-10"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[#6B6480]" />
          </button>
        )}

        {/* Title */}
        {title && (
          <p className="text-center text-[15px] font-bold text-[#1A1035] mb-4">
            {title}
          </p>
        )}

        {/* Content */}
        <div className="relative">{children}</div>
      </div>
    </>
  );
}
