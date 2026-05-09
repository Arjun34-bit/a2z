import Link from "next/link";

/* ---------- Inline SVG icons (matching the line-art style) ---------- */
const FacialIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
    <circle cx="20" cy="16" r="9" stroke="#6F55C8" strokeWidth="1.8" />
    <path d="M16 15.5c0 .8.4 1.5 1 1.5s1-.7 1-1.5" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M22 15.5c0 .8.4 1.5 1 1.5s1-.7 1-1.5" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M17 20c.8 1.2 2 2 3 2s2.2-.8 3-2" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M13 25c2 2.5 4.3 4 7 4s5-1.5 7-4" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="16" cy="13" r="0.8" fill="#6F55C8" />
    <circle cx="24" cy="13" r="0.8" fill="#6F55C8" />
  </svg>
);

const NailArtIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
    <path d="M14 28l-2-10 4-6h8l4 6-2 10H14z" stroke="#6F55C8" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M16 28l-1-8 3-4h4l3 4-1 8" stroke="#6F55C8" strokeWidth="1.4" strokeLinejoin="round" />
    <ellipse cx="20" cy="11" rx="4" ry="2.5" stroke="#6F55C8" strokeWidth="1.6" />
    <path d="M17 20h6M17 23h6" stroke="#6F55C8" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const MakeupIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
    <path d="M20 8l2 6h-4l2-6z" stroke="#6F55C8" strokeWidth="1.6" strokeLinejoin="round" />
    <rect x="17" y="14" width="6" height="12" rx="3" stroke="#6F55C8" strokeWidth="1.8" />
    <path d="M18 26v3a2 2 0 004 0v-3" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="20" cy="21" r="2" fill="#EDE9FF" stroke="#6F55C8" strokeWidth="1.4" />
  </svg>
);

const HairSpaIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
    <circle cx="20" cy="15" r="7" stroke="#6F55C8" strokeWidth="1.8" />
    <path d="M15 22c-3 2-4 5-3 8" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M25 22c3 2 4 5 3 8" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M17 30h6" stroke="#6F55C8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 12c0-2 4-2 4 0" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M17 16c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5" stroke="#6F55C8" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ThreadingIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
    <path d="M12 28L28 12M12 12l16 16" stroke="#6F55C8" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="20" cy="20" r="3" stroke="#6F55C8" strokeWidth="1.8" fill="#F8F7FD" />
    <path d="M10 12c2-2 4-2 6 0" stroke="#6F55C8" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M24 28c2 2 4 2 6 0" stroke="#6F55C8" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const MassageIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
    <path d="M14 26c-2-2-2-5 0-7l6-6c2-2 5-2 7 0M26 26c2-2 2-5 0-7l-6-6c-2-2-5-2-7 0" stroke="#6F55C8" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="20" cy="14" r="4" stroke="#6F55C8" strokeWidth="1.8" />
  </svg>
);

const CATEGORIES = [
  { id: "facial", label: "Facial", icon: <FacialIcon />, href: "/services/facial" },
  { id: "nail-art", label: "Nail Art", icon: <NailArtIcon />, href: "/services/nail-art" },
  { id: "makeup", label: "Makeup", icon: <MakeupIcon />, href: "/services/makeup" },
  { id: "hair-spa", label: "Hair Spa", icon: <HairSpaIcon />, href: "/services/hair-spa" },
  { id: "threading", label: "Threading", icon: <ThreadingIcon />, href: "/services/threading" },
  { id: "massage", label: "Massage", icon: <MassageIcon />, href: "/services/massage" },
];

export function DesktopCategories() {
  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1A1035]">Popular Categories</h2>
        <Link href="/services" className="text-sm font-semibold text-[#6B6480] hover:text-[#6F55C8] transition-colors">
          View all
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="flex flex-col items-center gap-3 p-6 bg-white border border-[#E8E4F5] rounded-2xl hover:border-[#6F55C8]/30 hover:bg-[#F8F7FD] hover:shadow-sm transition-all group"
          >
            <div className="text-[#1A1035] group-hover:scale-110 transition-transform duration-300">
              {cat.icon}
            </div>
            <span className="text-[15px] font-semibold text-[#1A1035]">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
