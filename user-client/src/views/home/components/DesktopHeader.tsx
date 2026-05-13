"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { LoginModal } from "@/components/modals/loginModal";

export function DesktopHeader() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-[#F8F7FD] border-b border-[#E8E4F5]">
        <div className="max-w-[98vw] mx-auto px-4">
          {/* Top Row */}
          <div className="flex items-center justify-between py-4 gap-8">
            {/* Logo & Location */}
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-[#6F55C8] tracking-tight">
                GlowHome
              </Link>
              <button className="flex items-center gap-1.5 text-[#1A1035] hover:text-[#6F55C8] transition-colors">
                <MapPin className="w-4 h-4 text-[#6B6480]" />
                <span className="text-sm font-semibold">Mumbai</span>
              </button>
            </div>

            {/* Header Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E99B4]" />
                <input
                  type="search"
                  placeholder="Search for services, artists..."
                  className="w-full h-11 pl-10 pr-4 bg-white border border-[#E8E4F5] rounded-xl text-sm text-[#1A1035] placeholder:text-[#9E99B4] outline-none focus:border-[#6F55C8] transition-all"
                />
              </div>
            </div>

            {/* Login / Sign Up */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="h-11 px-6 bg-[#6F55C8] hover:bg-[#5540A8] text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md cursor:pointer"
            >
              Login / Sign up
            </button>
          </div>

          {/* Bottom Row - Nav Links */}
          <nav className="flex items-center gap-8 py-4">
            {["Home", "Services", "Offers", "How it Works", "About Us"].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-sm font-semibold hover:text-[#6F55C8] transition-colors ${link === "Home" ? "text-[#1A1035]" : "text-[#6B6480]"
                  }`}
              >
                {link}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
