import type { Metadata } from "next";
import { HomeView } from "@/views/home/HomeView";

export const metadata: Metadata = {
  title: "A2Z | Beauty & Wellness Services",
  description:
    "Book top-rated beauty and wellness services near you — facials, nail art, makeup, hair spa, and more.",
};

export default function HomePage() {
  return <HomeView />;
}
