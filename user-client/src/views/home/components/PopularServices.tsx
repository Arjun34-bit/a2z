import Link from "next/link";

interface ServiceCategory {
  id: string;
  label: string;
  alt: string;
  icon: React.ReactNode;
  href: string;
}

/* ---------- Inline SVG icons (match the line-art style in the design) ---------- */
const FacialIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
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
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <path d="M14 28l-2-10 4-6h8l4 6-2 10H14z" stroke="#6F55C8" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M16 28l-1-8 3-4h4l3 4-1 8" stroke="#6F55C8" strokeWidth="1.4" strokeLinejoin="round" />
    <ellipse cx="20" cy="11" rx="4" ry="2.5" stroke="#6F55C8" strokeWidth="1.6" />
    <path d="M17 20h6M17 23h6" stroke="#6F55C8" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const MakeupIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <path d="M20 8l2 6h-4l2-6z" stroke="#6F55C8" strokeWidth="1.6" strokeLinejoin="round" />
    <rect x="17" y="14" width="6" height="12" rx="3" stroke="#6F55C8" strokeWidth="1.8" />
    <path d="M18 26v3a2 2 0 004 0v-3" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="20" cy="21" r="2" fill="#EDE9FF" stroke="#6F55C8" strokeWidth="1.4" />
  </svg>
);

const HairSpaIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <circle cx="20" cy="15" r="7" stroke="#6F55C8" strokeWidth="1.8" />
    <path d="M15 22c-3 2-4 5-3 8" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M25 22c3 2 4 5 3 8" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M17 30h6" stroke="#6F55C8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 12c0-2 4-2 4 0" stroke="#6F55C8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M17 16c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5" stroke="#6F55C8" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const CATEGORIES: ServiceCategory[] = [
  {
    id: "facial",
    label: "Facial",
    alt: "Facial beauty treatment service",
    icon: <FacialIcon />,
    href: "/services/facial",
  },
  {
    id: "nail-art",
    label: "Nail Art",
    alt: "Nail art and manicure service",
    icon: <NailArtIcon />,
    href: "/services/nail-art",
  },
  {
    id: "makeup",
    label: "Makeup",
    alt: "Professional makeup service",
    icon: <MakeupIcon />,
    href: "/services/makeup",
  },
  {
    id: "hair-spa",
    label: "Hair Spa",
    alt: "Hair spa and treatment service",
    icon: <HairSpaIcon />,
    href: "/services/hair-spa",
  },
];

export function PopularServices() {
  return (
    <section className="px-4 pt-5 pb-2" aria-labelledby="popular-services-heading">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          id="popular-services-heading"
          className="text-base font-bold text-[#1A1035]"
        >
          Popular Services
        </h2>
        <Link
          href="/services"
          id="view-all-services-link"
          className="text-xs font-semibold text-[#6F55C8] hover:text-[#5540A8] transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            id={`service-category-${cat.id}`}
            className="flex flex-col items-center gap-2 group"
            aria-label={cat.alt}
          >
            {/* Icon tile */}
            <div
              className="
                w-16 h-16 rounded-2xl
                bg-[#F8F7FD] border border-[#E8E4F5]
                flex items-center justify-center
                group-hover:bg-[#EDE9FF] group-hover:border-[#6F55C8]/30
                group-active:scale-95
                transition-all duration-200
              "
              aria-hidden="true"
              role="img"
              aria-label={cat.alt}
            >
              {cat.icon}
            </div>

            {/* Label */}
            <span className="text-[11.5px] font-semibold text-[#6B6480] text-center leading-tight group-hover:text-[#6F55C8] transition-colors">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
