"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { AppDialog } from "@/components/shared/AppDialog";
import { AppDrawer } from "@/components/shared/AppDrawer";
import { StepPhone } from "@/components/auth/StepPhone";
import { StepOTP } from "@/components/auth/StepOTP";

/* ── Shared Auth Flow ─────────────────────────────────────────────── */
function AuthContent({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {step === "otp" && (
        <button
          onClick={() => {
            setStep("phone");
            setPhone("");
          }}
          className="mb-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#F8F7FD] hover:bg-[#EDE9FF]"
        >
          <ArrowLeft className="w-4 h-4 text-[#6B6480]" />
        </button>
      )}

      {step === "phone" ? (
        <StepPhone
          onNext={(p) => {
            setPhone(p);
            setStep("otp");
          }}
        />
      ) : (
        <StepOTP phone={phone} onSuccess={onDone} />
      )}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */
export function LoginAuthFlow({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = <AuthContent key={open ? "open" : "closed"} onDone={onClose} />;

  if (isDesktop) {
    return (
      <AppDialog
        open={open}
        onOpenChange={(o) => !o && onClose()}
        title="" // optional
      >
        {content}
      </AppDialog>
    );
  }

  return (
    <AppDrawer
      open={open}
      onOpenChange={(o) => !o && onClose()}
      showCloseButton
      title="Login"
    >
      {content}
    </AppDrawer>
  );
}