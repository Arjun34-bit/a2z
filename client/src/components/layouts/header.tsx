import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-lg font-bold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="flex flex-1 items-center justify-end space-x-4">
          {/* Add nav links here */}
        </nav>
      </div>
    </header>
  );
}
