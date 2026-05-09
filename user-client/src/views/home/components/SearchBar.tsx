"use client";

import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="px-4 pt-4 pb-2">
      <label htmlFor="search-services" className="sr-only">
        Search for services
      </label>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E99B4] pointer-events-none" />
        <input
          id="search-services"
          type="search"
          placeholder="Search for services"
          className="
            w-full h-11 pl-10 pr-4
            bg-[#F8F7FD] border border-[#E8E4F5]
            rounded-xl text-sm
            text-[#1A1035] placeholder:text-[#9E99B4]
            outline-none
            focus:border-[#6F55C8] focus:ring-2 focus:ring-[#6F55C8]/10
            transition-all duration-200
          "
          aria-label="Search for services"
        />
      </div>
    </div>
  );
}
