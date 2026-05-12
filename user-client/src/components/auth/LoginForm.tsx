"use client";

import { StepTracker } from "@/components/miscellenous/StepTracker";
import { useLoginStore } from "@/store/use-login-store";
import { StepPhone } from "./StepPhone";
import { StepOTP } from "./StepOTP";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { step, phone, setStep, setPhone } = useLoginStore();

  return (
    <div className="flex flex-col w-full h-full md:pt-6">
      <StepTracker current={1} total={2} />
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
