import Image from "next/image";
import { Search } from "lucide-react";

export function DesktopHero() {
  return (
    <section className="bg-white rounded-[2rem] p-12 flex items-center justify-between shadow-sm overflow-hidden border border-[#E8E4F5]">
      {/* Left Content */}
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold text-[#1A1035] leading-[1.15] tracking-tight mb-4">
          Book Beauty
          <br />
          Services at Home
        </h1>
        <p className="text-lg text-[#6B6480] mb-10">
          Professional beauty experts
          <br />
          at your convenience
        </p>

        {/* Hero Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E99B4]" />
            <input
              type="search"
              placeholder="Search for services..."
              className="w-full h-14 pl-12 pr-4 bg-white border border-[#E8E4F5] rounded-2xl text-[15px] text-[#1A1035] placeholder:text-[#9E99B4] outline-none focus:border-[#6F55C8] transition-all"
            />
          </div>
          <button className="h-14 px-8 bg-[#6F55C8] hover:bg-[#5540A8] text-white text-[15px] font-semibold rounded-2xl transition-all shadow-sm hover:shadow-md">
            Search
          </button>
        </div>
      </div>

      {/* Right Content - Image */}
      <div className="relative w-[400px] h-[320px] rounded-2xl overflow-hidden shrink-0">
        <Image
          src="/images/desktop_hero_model.png"
          alt="Woman touching her face"
          width={400}
          height={320}
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
