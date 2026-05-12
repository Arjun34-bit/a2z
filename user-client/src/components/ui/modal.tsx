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
      {/* ── Desktop Backdrop ─────────────────────────────────────── */}
      <div
        className="hidden md:block fixed inset-0 bg-[#1A1035]/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* ── Desktop Modal ─────────────────────────────────────────── */}
      <div
        className={cn(
          "hidden md:block fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
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
        >
          <X className="w-4 h-4 text-[#6B6480]" />
        </button>

        {/* Back */}
        {showBack && (
          <button
            onClick={onBack}
            className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#F8F7FD] hover:bg-[#EDE9FF] transition-colors z-10"
          >
            <ArrowLeft className="w-4 h-4 text-[#6B6480]" />
          </button>
        )}

        {/* Content */}
        <div className="relative">{children}</div>
      </div>

      {/* ── Mobile Full-screen ────────────────────────────────────── */}
      <div
        className={cn(
          "md:hidden fixed inset-0 bg-white z-50 flex flex-col",
          "animate-in slide-in-from-bottom-4 duration-300",
          className
        )}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-5 pt-14 pb-4 border-b border-[#F3F0FB]">
          {showBack ? (
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F8F7FD]"
            >
              <ArrowLeft className="w-4 h-4 text-[#6B6480]" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F8F7FD]"
            >
              <X className="w-4 h-4 text-[#6B6480]" />
            </button>
          )}
          {title && <span className="text-[15px] font-bold text-[#1A1035]">{title}</span>}
          <div className="w-9" /> {/* spacer */}
        </div>

        {/* Mobile body */}
        <div className="flex-1 overflow-y-auto px-6 pt-8 pb-10">
          {children}
        </div>
      </div>
    </>
  );
}
