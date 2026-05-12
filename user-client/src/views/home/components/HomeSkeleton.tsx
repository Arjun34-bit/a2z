import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <>
      {/* --- Mobile View Skeleton (< 768px) --- */}
      <div className="md:hidden flex flex-col min-h-screen bg-white">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-[#F3F0FB]">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
          {/* Search Skeleton */}
          <div className="px-4 pt-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>

          {/* Categories / Popular Services Skeleton */}
          <div className="px-4">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[70px]">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>

          <div className="mx-4 my-1 h-px bg-[#F3F0FB]" aria-hidden="true" />

          {/* Popular Near You Skeleton */}
          <div className="px-4">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-3 rounded-2xl border border-[#F3F0FB]">
                  <Skeleton className="h-24 w-24 rounded-xl flex-shrink-0" />
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-4 my-1 h-px bg-[#F3F0FB]" aria-hidden="true" />

          {/* Promo Banner Skeleton */}
          <div className="px-4 pb-8">
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </div>

      {/* --- Desktop View Skeleton (>= 768px) --- */}
      <div className="hidden md:flex flex-col min-h-screen w-full bg-white">
        {/* Desktop Header Skeleton */}
        <div className="h-20 border-b border-[#F3F0FB] flex items-center justify-between px-10">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>

        {/* Desktop Hero Skeleton */}
        <section>
          <Skeleton className="h-80 w-full rounded-3xl" />
        </section>

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 space-y-20">
          {/* Desktop Categories Skeleton */}
          <section>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          </section>

          {/* Desktop Banner Skeleton */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-3xl" />
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
