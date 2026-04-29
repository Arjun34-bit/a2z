import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyOtpView from "@/views/auth/VerifyOtp";

export const metadata: Metadata = {
  title: "Verify OTP | A2Z",
  description: "Enter the OTP sent to your phone to verify your identity",
};

export default function Page() {
  return (
    <Suspense>
      <VerifyOtpView />
    </Suspense>
  );
}
