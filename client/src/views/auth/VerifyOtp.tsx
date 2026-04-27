"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthLeftPanel from "@/components/miscellenous/authPage/AuthLeftPanel";

const OTP_LENGTH = 6;

export default function VerifyOtpView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") || "";

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Redirect if no phone number provided
    useEffect(() => {
        if (!phone) {
            router.replace("/login");
        }
    }, [phone, router]);

    // Resend countdown timer
    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (error) setError("");

        // Move to next input
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "Enter") {
            handleVerify();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;

        const newOtp = [...otp];
        for (let i = 0; i < pasted.length; i++) {
            newOtp[i] = pasted[i];
        }
        setOtp(newOtp);

        const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleVerify = () => {
        const code = otp.join("");
        if (code.length !== OTP_LENGTH) {
            setError("Please enter the complete OTP");
            return;
        }

        setError("");
        setLoading(true);

        // TODO: Call verify-otp API here
        console.log("Verify OTP:", code, "for phone:", phone);
    };

    const handleResend = () => {
        if (resendTimer > 0) return;
        setResendTimer(30);
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        // TODO: Call resend-otp API here
    };

    const formatPhone = (p: string) => {
        if (p.length === 10) {
            return `${p.slice(0, 5)} ${p.slice(5)}`;
        }
        return p;
    };

    return (
        <div className="h-screen w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">

            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">

                {/* LEFT PANEL — hidden on mobile */}
                <div className="hidden md:block h-full">
                    <AuthLeftPanel />
                </div>

                {/* RIGHT PANEL */}
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
                                Enter OTP
                            </h1>
                            <p className="text-sm text-gray-300">
                                We sent a verification code to{" "}
                                <span className="text-white font-medium">
                                    +91 {formatPhone(phone)}
                                </span>
                            </p>
                        </div>

                        <div className="space-y-5">

                            {/* OTP INPUTS */}
                            <div className="space-y-2">
                                <label className="text-xs tracking-widest text-gray-400">
                                    VERIFICATION CODE
                                </label>

                                <div
                                    className="flex gap-2 sm:gap-3 justify-between"
                                    onPaste={handlePaste}
                                >
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { inputRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className={`
                                                w-10 h-12 sm:w-12 sm:h-14
                                                text-center text-lg sm:text-xl font-semibold text-white
                                                bg-white/5 border rounded-lg
                                                outline-none transition-all duration-200
                                                focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400
                                                ${digit
                                                    ? "border-yellow-400/60 bg-yellow-400/5"
                                                    : "border-white/20"
                                                }
                                                ${error ? "border-red-400/60" : ""}
                                            `}
                                        />
                                    ))}
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
                                onClick={handleVerify}
                                disabled={loading}
                                className="w-full h-12 text-base bg-yellow-400 text-black hover:bg-yellow-300 transition disabled:opacity-60"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Verifying…
                                    </span>
                                ) : (
                                    "Verify OTP"
                                )}
                            </Button>

                            {/* Resend & Back */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => router.back()}
                                    className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Change number
                                </button>

                                <button
                                    onClick={handleResend}
                                    disabled={resendTimer > 0}
                                    className={`text-sm transition ${resendTimer > 0
                                            ? "text-gray-500 cursor-not-allowed"
                                            : "text-yellow-400 hover:underline cursor-pointer"
                                        }`}
                                >
                                    {resendTimer > 0
                                        ? `Resend in ${resendTimer}s`
                                        : "Resend OTP"}
                                </button>
                            </div>
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
