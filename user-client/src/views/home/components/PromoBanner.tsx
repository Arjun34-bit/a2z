"use client";

import Link from "next/link";
import { Gift } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="px-4 pt-4 pb-6" aria-label="Promotional offer">
      <Link
        href="/offers/first-booking"
        id="promo-banner-link"
        className="
          flex items-center justify-between
          bg-[#EDE9FF] rounded-2xl px-5 py-4
          border border-[#6F55C8]/20
          hover:bg-[#E0D9FF] active:scale-[0.98]
          transition-all duration-200
          group
        "
        aria-label="Get flat 20% off on your first booking"
      >
        {/* Text block */}
        <div>
          <p className="text-sm font-bold text-[#1A1035] leading-tight">
            Flat 20% OFF
          </p>
          <p className="text-xs text-[#6B6480] mt-0.5 font-medium">
            On your first booking
          </p>
        </div>

        {/* Gift icon */}
        <div
          className="
            w-11 h-11 rounded-xl
            bg-white/70 border border-[#6F55C8]/20
            flex items-center justify-center
            group-hover:bg-white
            transition-all duration-200
          "
          aria-hidden="true"
        >
          <Gift className="w-5 h-5 text-[#6F55C8]" />
        </div>
      </Link>
    </section>
  );
}
