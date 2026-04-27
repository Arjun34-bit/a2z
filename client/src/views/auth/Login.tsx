"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthLeftPanel from "@/components/miscellenous/authPage/AuthLeftPanel";

export default function LoginView() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = () => {
        const cleaned = phone.replace(/\s/g, "");

        if (cleaned.length !== 10 || !/^\d{10}$/.test(cleaned)) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }

        setError("");
        setLoading(true);

        // TODO: Call send-otp API here
        // Simulate a small delay for UX
        setTimeout(() => {
            router.push(`/login/verify-otp?phone=${encodeURIComponent(cleaned)}`);
        }, 300);
    };

    return (
        <div className="h-screen w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">

            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">

                {/* LEFT PANEL — hidden on mobile */}
                <div className="hidden md:block h-full">
                    <AuthLeftPanel />
                </div>

                {/* RIGHT PANEL — always visible */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center h-full px-4 sm:px-6"
                >
                    <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 sm:p-10 shadow-xl">

                        {/* Mobile-only branding */}
                        <div className="flex md:hidden items-center gap-2 text-yellow-400 tracking-widest text-sm mb-6">
                            <span className="border border-yellow-400 rounded-full px-3 py-1 text-xs">
                                A2Z
                            </span>
                            <span>PREMIUM SERVICES</span>
                        </div>

                        <div className="space-y-3 mb-8">
                            <h1 className="text-3xl sm:text-4xl font-semibold text-white">
                                Welcome back
                            </h1>
                            <p className="text-sm text-gray-300">
                                Sign in with your phone number
                            </p>
                        </div>

                        <div className="space-y-5">

                            {/* PHONE INPUT */}
                            <div className="space-y-2">
                                <label className="text-xs tracking-widest text-gray-400">
                                    PHONE NUMBER
                                </label>

                                <div className="flex">
                                    <div className="flex items-center gap-2 px-3 sm:px-4 h-12 border border-white/20 rounded-l-lg bg-white/10 text-sm text-white shrink-0">
                                        <span>IN</span>
                                        <span className="text-gray-300">+91</span>
                                    </div>

                                    <Input
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            if (error) setError("");
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSendOtp();
                                        }}
                                        placeholder="98765 43210"
                                        maxLength={12}
                                        inputMode="numeric"
                                        className="h-12 rounded-l-none bg-transparent border-white/20 text-white placeholder:text-gray-400"
                                    />
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-red-400"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </div>

                            <Button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full h-12 text-base bg-yellow-400 text-black hover:bg-yellow-300 transition disabled:opacity-60"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Sending OTP…
                                    </span>
                                ) : (
                                    "Send OTP"
                                )}
                            </Button>

                            <p className="text-sm text-center text-gray-400">
                                Don&apos;t have an account?{" "}
                                <span className="text-yellow-400 cursor-pointer hover:underline">
                                    Create new account
                                </span>
                            </p>
                        </div>

                        <p className="text-xs text-gray-400 mt-6">
                            By continuing, you agree to our Terms & Privacy Policy
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}