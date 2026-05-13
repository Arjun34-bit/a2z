"use client";

import Link from "next/link";
import { MapPin, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E8E4F5]">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Location */}
        <button
          id="location-picker-btn"
          className="flex items-center gap-1.5 text-[#1A1035] hover:text-[#6F55C8] transition-colors"
          aria-label="Change location"
        >
          <MapPin className="w-4 h-4 text-[#6F55C8] shrink-0" />
          <span className="text-sm font-600 font-semibold text-[#1A1035]">
            Mumbai, Andheri
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#9E99B4]" />
        </button>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Login button → navigates to /login on mobile */}
          <Link href="/login">
            <Button
              id="login-btn"
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-sm font-semibold text-[#6F55C8] hover:bg-[#EDE9FF] hover:text-[#5A44B0] rounded-full border border-[#6F55C8] hover:border-[#5A44B0] transition-colors"
              aria-label="Login"
            >
              Login
            </Button>
          </Link>

          {/* Notification bell */}
          <Button
            id="notification-bell-btn"
            variant="ghost"
            size="icon"
            className="relative w-9 h-9 rounded-full text-[#1A1035] hover:bg-[#EDE9FF] hover:text-[#6F55C8]"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6F55C8] ring-2 ring-white" />
          </Button>
        </div>
      </div>
    </header>
  );
}