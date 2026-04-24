import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | A2Z",
  description: "Manage your A2Z account settings",
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      {/* Settings content will go here */}
    </div>
  );
}
