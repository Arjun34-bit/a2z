import type { Metadata } from "next";
import LoginView from "@/views/auth/Login";

export const metadata: Metadata = {
  title: "Login | A2Z",
  description: "Sign in to your A2Z account",
};

export default function Page() {
  return <LoginView />;
}