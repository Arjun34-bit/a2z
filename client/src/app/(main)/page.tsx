import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A2Z | Home",
  description: "A2Z - Your complete drop shipping portal",
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-8">
      <section className="flex flex-col items-center justify-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            A2Z
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          Your complete drop shipping portal. Manage orders, suppliers, and
          everything in between.
        </p>
      </section>
    </div>
  );
}
