"use client";

import { useCategories } from "@/hooks/category/use-category";
import { useBanners } from "@/hooks/banner/use-banner";
import {
  HomeHeader,
  SearchBar,
  PopularServices,
  PopularNearYou,
  PromoBanner,
  DesktopHeader,
  DesktopHero,
  DesktopCategories,
  DesktopBanner,
  HomeSkeleton,
} from "./index";

/**
 * HomeView — composes all sections of the home screen.
 */
export function HomeView() {
  const { isLoading: categoriesLoading } = useCategories();
  const { isLoading: bannersLoading } = useBanners();

  // Show skeleton until critical data loads
  // if (categoriesLoading || bannersLoading) {
  //   return <HomeSkeleton />;
  // }
  return (
    <>
      {/* --- Mobile View (< 768px) --- */}
      <div className="md:hidden flex flex-col min-h-screen bg-white">
        {/* Top navigation bar */}
        <HomeHeader />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Search */}
          <SearchBar />

          {/* Service categories */}
          <PopularServices />

          {/* Divider */}
          <div className="mx-4 my-1 h-px bg-[#F3F0FB]" aria-hidden="true" />

          {/* Nearby salons / artists */}
          <PopularNearYou />

          {/* Divider */}
          <div className="mx-4 my-1 h-px bg-[#F3F0FB]" aria-hidden="true" />

          {/* Promo offer */}
          <PromoBanner />
        </div>
      </div>

      {/* --- Desktop View (>= 768px) --- */}
      <div className="hidden md:flex flex-col min-h-screen w-full bg-white">
        <DesktopHeader />
        <DesktopHero />
        <main className="flex-1 max-w-8xl w-full mx-auto px-6 py-10 space-y-16">

          <DesktopCategories />
          <DesktopBanner />
        </main>
      </div>
    </>
  );
}
