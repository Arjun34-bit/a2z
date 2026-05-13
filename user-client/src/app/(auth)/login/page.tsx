import type { Metadata } from "next";
import MobileLoginView from "@/views/auth/MobileLoginView";

export const metadata: Metadata = {
  title: "Login | A2Z",
  description: "Sign in to your A2Z account with your mobile number",
};

export default function Page() {
  return <MobileLoginView />;
}