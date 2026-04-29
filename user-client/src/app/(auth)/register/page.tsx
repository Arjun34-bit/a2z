import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | A2Z",
  description: "Create your A2Z account",
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to get started
        </p>
      </div>
      {/* Register form component will go here */}
    </div>
  );
}
