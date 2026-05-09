import Link from "next/link";
import { Star, ChevronRight, MapPin } from "lucide-react";

interface NearbyArtist {
  id: string;
  name: string;
  rating: number;
  distance: string;
  bookings: string;
  href: string;
  /** alt text for the salon/artist image placeholder */
  imageAlt: string;
}

const NEARBY_ARTISTS: NearbyArtist[] = [
  {
    id: "glow-and-go-salon",
    name: "Glow & Go Salon",
    rating: 4.6,
    distance: "1.2 km",
    bookings: "500+",
    href: "/salons/glow-and-go",
    imageAlt: "Glow and Go Salon storefront photo",
  },
  {
    id: "neha-makeup-artist",
    name: "Neha Makeup Artist",
    rating: 4.8,
    distance: "2.1 km",
    bookings: "300+",
    href: "/salons/neha-makeup-artist",
    imageAlt: "Neha Makeup Artist studio photo",
  },
];

/* Image placeholder matching the ✕ box in the design */
function ImagePlaceholder({ alt }: { alt: string }) {
  return (
    <div
      className="w-14 h-14 rounded-xl bg-[#F0EDFC] border border-[#E8E4F5] flex items-center justify-center shrink-0"
      role="img"
      aria-label={alt}
    >
      {/* X cross — mirrors the placeholder box in the mockup */}
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 text-[#C4B9F0]"
        aria-hidden="true"
      >
        <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function PopularNearYou() {
  return (
    <section className="px-4 pt-5 pb-2" aria-labelledby="popular-near-you-heading">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <h2
          id="popular-near-you-heading"
          className="text-base font-bold text-[#1A1035]"
        >
          Popular Near You
        </h2>
        <Link
          href="/salons"
          id="view-all-salons-link"
          className="text-xs font-semibold text-[#6F55C8] hover:text-[#5540A8] transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Artist cards */}
      <div className="space-y-3">
        {NEARBY_ARTISTS.map((artist, index) => (
          <Link
            key={artist.id}
            href={artist.href}
            id={`nearby-artist-${artist.id}`}
            className="
              flex items-center gap-3 p-3
              bg-[#F8F7FD] rounded-2xl border border-[#E8E4F5]
              hover:border-[#6F55C8]/30 hover:bg-[#EDE9FF]/40
              active:scale-[0.98]
              transition-all duration-200
              group
            "
            aria-label={`${artist.name} — ${artist.rating} stars, ${artist.distance} away, ${artist.bookings} bookings`}
          >
            {/* Thumbnail */}
            <ImagePlaceholder alt={artist.imageAlt} />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1A1035] truncate">
                {artist.name}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-[#6B6480]">
                {/* Rating */}
                <span className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
                  <span className="font-semibold text-[#1A1035]">{artist.rating}</span>
                </span>

                <span className="text-[#E8E4F5]">·</span>

                {/* Distance */}
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-[#9E99B4]" aria-hidden="true" />
                  {artist.distance}
                </span>

                <span className="text-[#E8E4F5]">·</span>

                {/* Bookings */}
                <span>{artist.bookings} bookings</span>
              </div>
            </div>

            {/* Chevron — only on first card, matching the design */}
            {index === 0 && (
              <ChevronRight
                className="w-4 h-4 text-[#9E99B4] shrink-0 group-hover:text-[#6F55C8] transition-colors"
                aria-hidden="true"
              />
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
