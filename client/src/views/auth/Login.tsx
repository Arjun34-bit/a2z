"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthLeftPanel from "@/components/miscellenous/authPage/AuthLeftPanel";

export default function LoginView() {
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [phone, setPhone] = useState("");

    const handleContinue = () => {
        if (step === "phone") {
            if (phone.length < 10) return;
            setStep("otp");
        } else {
            // handle OTP verify here
            console.log("Verify OTP");
        }
    };

    return (
        <div className="h-screen w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">

            <div className="w-full h-full grid grid-cols-2">

                {/* LEFT PANEL */}
                <AuthLeftPanel />

                {/* RIGHT PANEL */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center h-full"
                >
                    <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-10 shadow-xl">

                        <div className="space-y-3 mb-8">
                            <h1 className="text-4xl font-semibold text-white">
                                {step === "phone" ? "Welcome back" : "Enter OTP"}
                            </h1>
                            <p className="text-sm text-gray-300">
                                {step === "phone"
                                    ? "Sign in with your phone number"
                                    : `OTP sent to +91 ${phone}`}
                            </p>
                        </div>

                        <div className="space-y-5">

                            {/* PHONE INPUT */}
                            {step === "phone" && (
                                <div className="space-y-2">
                                    <label className="text-xs tracking-widest text-gray-400">
                                        PHONE NUMBER
                                    </label>

                                    <div className="flex">
                                        <div className="flex items-center gap-2 px-4 h-12 border border-white/20 rounded-l-lg bg-white/10 text-sm text-white">
                                            <span>IN</span>
                                            <span className="text-gray-300">+91</span>
                                        </div>

                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="98765 43210"
                                            className="h-12 rounded-l-none bg-transparent border-white/20 text-white placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* OTP INPUT */}
                            {step === "otp" && (
                                <Input
                                    placeholder="Enter OTP"
                                    className="h-12 bg-transparent border-white/20 text-white placeholder:text-gray-400"
                                />
                            )}

                            <Button
                                onClick={handleContinue}
                                className="w-full h-12 text-base bg-yellow-400 text-black hover:bg-yellow-300 transition"
                            >
                                {step === "phone" ? "Send OTP" : "Verify OTP"}
                            </Button>

                            {step === "phone" && (
                                <p className="text-sm text-center text-gray-400">
                                    Don’t have an account?{" "}
                                    <span className="text-yellow-400 cursor-pointer hover:underline">
                                        Create new account
                                    </span>
                                </p>
                            )}
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