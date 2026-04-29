import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | A2Z",
  description: "Your A2Z dashboard",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here&apos;s an overview of your activity.
        </p>
      </div>
      {/* Dashboard content will go here */}
    </div>
  );
}
