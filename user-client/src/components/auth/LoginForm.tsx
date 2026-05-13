"use client";

import { StepTracker } from "@/components/miscellenous/StepTracker";
import { useLoginStore } from "@/store/use-login-store";
import { StepPhone } from "./StepPhone";
import { StepOTP } from "./StepOTP";

interface LoginFormProps {
  onSuccess: () => void;
  hideTracker?: boolean;
}

export function LoginForm({ onSuccess, hideTracker = false }: LoginFormProps) {
  const { step, phone, setStep, setPhone } = useLoginStore();

  return (
    <div className="flex flex-col w-full h-full md:pt-6">
      {!hideTracker && (
        <div className="hidden md:block">
          <StepTracker current={step} total={2} />
        </div>
      )}
      {step === 1 && (
        <StepPhone
          onNext={(p) => {
            setPhone(p);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <StepOTP
          phone={phone}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}