"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type PhoneFormValues = {
  phone: string;
};

export function StepPhone({ onNext }: { onNext: (phone: string) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<PhoneFormValues>({
    defaultValues: { phone: "" },
    mode: "onChange",
  });

  // Destructure register result so we can wire ref/name/onBlur to the Input
  // but handle onChange ourselves via onInput (works on Android IME keyboards)
  const { ref, name, onBlur } = register("phone", {
    required: "Please enter a valid 10-digit mobile number.",
    validate: (value) =>
      /^[6-9]\d{9}$/.test(value) || "Please enter a valid 10-digit mobile number.",
  });

  const onSubmit: SubmitHandler<PhoneFormValues> = (data) => {
    onNext(data.phone);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 duration-300"
      noValidate
    >
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
            errors.phone ? "border-[#EF4444]" : "border-[#E8E4F5]"
          )}
        >
          <span className="text-[15px] font-semibold text-[#1A1035] border-r border-[#E8E4F5] pr-3 shrink-0">
            +91
          </span>

          <Input
            // Wire RHF's ref, name, onBlur from register()
            ref={ref}
            name={name}
            onBlur={onBlur}
            // Use onInput instead of onChange:
            // onInput fires on every keystroke on Android (incl. swipe/IME keyboards),
            // unlike onChange which can be deferred during composition on Samsung Chrome.
            // setValue with shouldValidate:true is the reliable way to update RHF state.
            onInput={(e) => {
              const cleaned = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
              e.currentTarget.value = cleaned; // keep DOM in sync
              setValue("phone", cleaned, { shouldValidate: true, shouldDirty: true });
            }}
            variant="ghost"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            placeholder="Enter mobile number"
            className="flex-1 p-0 h-auto text-[15px] font-medium text-[#1A1035] placeholder:text-[#9E99B4]"
          />
        </div>

        {errors.phone && (
          <span className="text-[12px] text-[#EF4444] font-medium">
            {errors.phone.message}
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={!isValid}
        className={cn(
          "w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200",
          isValid
            ? "bg-[#6F55C8] hover:bg-[#5540A8] active:scale-[0.98]"
            : "bg-[#C4BEEA] cursor-not-allowed"
        )}
      >
        Continue
      </button>

      {/* Terms */}
      <p className="text-center text-[12px] text-[#9E99B4] leading-relaxed">
        By continuing, you agree to our{" "}
        <a href="#" className="text-[#6F55C8] font-semibold underline-offset-2 hover:underline">
          Terms of service
        </a>{" "}
        &amp;{" "}
        <a href="#" className="text-[#6F55C8] font-semibold underline-offset-2 hover:underline">
          Privacy policy
        </a>
      </p>
    </form>
  );
}