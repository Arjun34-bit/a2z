"use client";

import { useState, useRef, useEffect } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepPhone({ onNext }: { onNext: (phone: string) => void }) {
  const [localPhone, setLocalPhone] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ✅ Single source of truth
  const digits = localPhone.replace(/\D/g, "");
  const isValid = /^[6-9]\d{9}$/.test(digits); // Indian mobile validation

  const handleContinue = () => {
    if (!isValid) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    onNext(digits);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EDE9FF] mx-auto">
        <Phone className="w-6 h-6 text-[#6F55C8]" strokeWidth={2} />
      </div>

      {/* Heading */}
      <div className="text-center">
        <h2 className="text-[22px] font-extrabold text-[#1A1035] leading-tight">
          Welcome back
        </h2>
        <p className="text-[14px] text-[#6B6480] mt-1">
          Log in or create your account
        </p>
      </div>

      {/* Phone input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-[#6B6480] uppercase tracking-wide">
          Mobile Number
        </label>

        <div
          className={cn(
            "flex items-center gap-3 bg-[#F8F7FD] border rounded-xl px-4 py-3 transition-all duration-200 focus-within:border-[#6F55C8] focus-within:ring-2 focus-within:ring-[#EDE9FF]",
            error ? "border-[#EF4444]" : "border-[#E8E4F5]"
          )}
        >
          <span className="text-[15px] font-semibold text-[#1A1035] border-r border-[#E8E4F5] pr-3 shrink-0">
            +91
          </span>

          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            placeholder="Enter mobile number"
            value={localPhone}
            onChange={(e) => {
              const value = e.target.value;
              const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
              setLocalPhone(digitsOnly);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleContinue();
            }}
            className="flex-1 bg-transparent text-[15px] font-medium text-[#1A1035] placeholder:text-[#9E99B4] outline-none"
          />
        </div>

        {error && (
          <p className="text-[12px] text-[#EF4444] font-medium">{error}</p>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleContinue}
        disabled={!isValid}
        className={cn(
          "w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200",
          isValid
            ? "bg-[#6F55C8] hover:bg-[#5540A8] shadow-[0_4px_16px_rgba(111,85,200,0.28)] active:scale-[0.98]"
            : "bg-[#C4BAE8] cursor-not-allowed"
        )}
      >
        Continue
      </button>

      {/* Terms */}
      <p className="text-center text-[12px] text-[#9E99B4] leading-relaxed">
        By continuing, you agree to our{" "}
        <a
          href="#"
          className="text-[#6F55C8] font-semibold underline-offset-2 hover:underline"
        >
          Terms of service
        </a>{" "}
        &amp;{" "}
        <a
          href="#"
          className="text-[#6F55C8] font-semibold underline-offset-2 hover:underline"
        >
          Privacy policy
        </a>
      </p>
    </div>
  );
}