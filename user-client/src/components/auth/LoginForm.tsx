"use client";

import { useState, useCallback } from "react";
import { StepPhone } from "./StepPhone";
import { StepOTP } from "./StepOTP";

interface LoginFormProps {
  onSuccess: () => void;
}

/**
 * Self-contained login flow.
 * Manages phone / OTP step state locally — no global store needed.
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");

  const handlePhoneNext = useCallback((p: string) => {
    setPhone(p);
    setStep(2);
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      {step === 1 && <StepPhone onNext={handlePhoneNext} />}
      {step === 2 && <StepOTP phone={phone} onSuccess={onSuccess} />}
    </div>
  );
}