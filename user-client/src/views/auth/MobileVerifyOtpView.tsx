"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { StepOTP } from "@/components/auth/StepOTP";

export default function MobileVerifyOtpView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  // Guard: if no phone, send back to login
  useEffect(() => {
    if (!phone) {
      router.replace("/login");
    }
  }, [phone, router]);

  const handleSuccess = () => {
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
          id="mobile-verify-otp-back-btn"
          onClick={() => router.back()}
          aria-label="Go back to phone entry"
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
                  ${s.id < 2
                    ? "bg-[#6F55C8] text-white"
                    : s.id === 2
                      ? "bg-[#6F55C8] text-white ring-4 ring-[#6F55C8]/20"
                      : "bg-[#F4F2FB] text-[#9E99B4]"
                  }
                `}
              >
                {s.id < 2 ? (
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
                className={`text-[12px] font-semibold transition-all duration-300 ${s.id === 2
                    ? "text-[#1A1035]"
                    : s.id < 2
                      ? "text-[#6F55C8]"
                      : "text-[#9E99B4]"
                  }`}
              >
                {s.label}
              </span>
            </div>
            {index < arr.length - 1 && (
              <div
                className={`h-px w-8 rounded-full transition-all duration-500 ${s.id < 2 ? "bg-[#6F55C8]" : "bg-[#E8E4F5]"
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Subtitle ──────────────────────────────────────── */}
      <p className="text-center text-[#9E99B4] text-[13px] mt-1 mb-4">
        Enter the OTP sent to your mobile number
      </p>

      {/* ── StepOTP Form ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-5">
        <div className="w-full max-w-sm">
          {phone && <StepOTP phone={phone} onSuccess={handleSuccess} />}
        </div>
      </div>
    </div>
  );
}
