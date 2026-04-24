import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-7xl font-bold tracking-tighter text-primary">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
