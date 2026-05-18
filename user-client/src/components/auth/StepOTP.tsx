"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type OtpFormValues = {
  otp: string;
};

export function StepOTP({
  phone,
  onSuccess,
}: {
  phone: string;
  onSuccess: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormValues>({
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const t = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const syncToForm = (newDigits: string[]) => {
    setValue("otp", newDigits.join(""), { shouldValidate: true });
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    syncToForm(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    text.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    syncToForm(next);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const onSubmit = (_data: OtpFormValues) => {
    // TODO: call verify API with _data.otp
    onSuccess();
  };

  const maskedPhone = `+91 ${phone.slice(0, 2)}****${phone.slice(-2)}`;
  const otpComplete = digits.join("").length === 6;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300"
      noValidate
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EDE9FF] mx-auto">
        <Shield className="w-6 h-6 text-[#6F55C8]" strokeWidth={2} />
      </div>

      {/* Heading */}
      <div className="text-center">
        <h2 className="text-[22px] font-extrabold text-[#1A1035] leading-tight">
          Verify your number
        </h2>
        <p className="text-[14px] text-[#6B6480] mt-1">
          OTP sent to <span className="font-semibold text-[#1A1035]">{maskedPhone}</span>
        </p>
      </div>

      {/* Hidden RHF field for OTP value — validation lives here */}
      <Controller
        name="otp"
        control={control}
        rules={{
          validate: (val) =>
            val.length === 6 || "Please enter the 6-digit OTP.",
        }}
        render={() => <input type="hidden" />}
      />

      {/* OTP boxes */}
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={cn(
              "w-11 h-12 text-center text-[18px] font-bold rounded-xl border bg-[#F8F7FD] text-[#1A1035] outline-none transition-all duration-200 focus:border-[#6F55C8] focus:ring-2 focus:ring-[#EDE9FF]",
              digit ? "border-[#6F55C8] bg-[#EDE9FF]" : "border-[#E8E4F5]",
              errors.otp && !digit && "border-[#EF4444]"
            )}
          />
        ))}
      </div>

      {errors.otp && (
        <p className="text-center text-[12px] text-[#EF4444] font-medium -mt-2">
          {errors.otp.message}
        </p>
      )}

      {/* Resend */}
      <p className="text-center text-[13px] text-[#9E99B4]">
        {resendTimer > 0 ? (
          <>
            Resend OTP in <span className="font-semibold text-[#6F55C8]">{resendTimer}s</span>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setResendTimer(30)}
            className="font-semibold text-[#6F55C8] hover:underline"
          >
            Resend OTP
          </button>
        )}
      </p>

      {/* Verify CTA */}
      <button
        type="submit"
        disabled={!otpComplete}
        className={cn(
          "w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200",
          otpComplete
            ? "bg-[#6F55C8] hover:bg-[#5540A8] shadow-[0_4px_16px_rgba(111,85,200,0.28)] active:scale-[0.98]"
            : "bg-[#C4BAE8] cursor-not-allowed"
        )}
      >
        Verify &amp; Continue
      </button>
    </form>
  );
}
