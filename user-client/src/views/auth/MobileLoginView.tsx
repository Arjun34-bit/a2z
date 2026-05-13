"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useLoginStore } from "@/store/use-login-store";

export default function MobileLoginView() {
  const router = useRouter();
  const { step, setStep, reset } = useLoginStore();

  const handleBack = () => {
    if (step > 1) {
      setStep(1);
    } else {
      reset();
      router.back();
    }
  };

  const handleSuccess = () => {
    reset();
    router.replace("/");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Back Button ───────────────────────────────────── */}
      <div className="px-4 pt-4">
        <button
          id="mobile-auth-back-btn"
          onClick={handleBack}
          aria-label={step > 1 ? "Go back to phone entry" : "Go back"}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F4F2FB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#1A1035]" />
        </button>
      </div>

      {/* ── Step Tracker ──────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3 pt-6 pb-2">
        {[
          { id: 1, label: "Verify" },
          { id: 2, label: "Details" },
        ].map((s, index, arr) => (
          <div key={s.id} className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className={`
                  flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold transition-all duration-300
                  ${s.id < step
                    ? "bg-[#6F55C8] text-white"
                    : s.id === step
                      ? "bg-[#6F55C8] text-white ring-4 ring-[#6F55C8]/20"
                      : "bg-[#F4F2FB] text-[#9E99B4]"
                  }
                `}
              >
                {s.id < step ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  s.id
                )}
              </div>
              <span
                className={`text-[12px] font-semibold transition-all duration-300 ${s.id === step ? "text-[#1A1035]" : s.id < step ? "text-[#6F55C8]" : "text-[#9E99B4]"
                  }`}
              >
                {s.label}
              </span>
            </div>
            {index < arr.length - 1 && (
              <div
                className={`h-px w-8 rounded-full transition-all duration-500 ${s.id < step ? "bg-[#6F55C8]" : "bg-[#E8E4F5]"
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Subtitle ──────────────────────────────────────── */}
      <p className="text-center text-[#9E99B4] text-[13px] mt-1 mb-4">
        {step === 1
          ? "Enter your mobile number to get started"
          : "Complete your profile details"}
      </p>

      {/* ── Form ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-5">
        <div className="w-full max-w-sm">
          <LoginForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}