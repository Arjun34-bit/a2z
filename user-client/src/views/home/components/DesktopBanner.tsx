import Image from "next/image";

export function DesktopBanner() {
  return (
    <section className="relative w-full bg-[#EDE9FF] rounded-[2rem] overflow-hidden flex items-center justify-between px-16 h-[240px]">
      {/* Left Content */}
      <div className="z-10 py-12">
        <h2 className="text-[28px] font-bold text-[#1A1035] mb-2 tracking-tight">
          Exclusive Offers for You
        </h2>
        <p className="text-lg text-[#6B6480] font-medium mb-8">
          Up to 30% off on all services
        </p>

        {/* Promo Code Box */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F3F0FB] border border-[#C4B9F0] rounded-xl">
          <span className="text-sm font-medium text-[#6B6480]">Use code:</span>
          <span className="text-sm font-bold text-[#1A1035] tracking-wide">GLOW30</span>
        </div>
      </div>

      {/* Right Content - Image cut off at bottom like design */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[300px]">
        <Image
          src="/images/desktop_banner_model.png"
          alt="Smiling woman"
          width={400}
          height={300}
          className="object-cover object-top"
          priority
        />
        {/* Soft gradient fade on the left of the image to blend into background */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#EDE9FF] to-transparent z-10" />
      </div>
    </section>
  );
}
