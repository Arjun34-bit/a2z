"use client";

import { motion } from "framer-motion";

export default function AuthLeftPanel() {
    return (
        <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between h-full p-12 bg-gradient-to-br from-black/80 to-black/40 text-white"
        >
            <div>
                <div className="flex items-center gap-2 text-yellow-400 tracking-widest text-sm">
                    <span className="border border-yellow-400 rounded-full px-3 py-1 text-xs">
                        A2Z
                    </span>
                    <span>PREMIUM SERVICES</span>
                </div>

                <h1 className="mt-14 text-5xl leading-tight font-serif max-w-xl">
                    Curated experiences, crafted for the{" "}
                    <span className="text-yellow-400 italic">discerning few.</span>
                </h1>
            </div>

            <div className="space-y-5 text-sm text-gray-300 max-w-md">
                {[
                    "Exclusive artists — hand-vetted talent",
                    "White-glove booking — concierge management",
                    "Real-time updates — zero surprises",
                ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                        <span className="text-yellow-400">•</span>
                        <p>{item}</p>
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-500">
                © 2026 A2Z · All rights reserved
            </p>
        </motion.div>
    );
}