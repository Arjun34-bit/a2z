"use client";

import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Composes all application providers in a single wrapper
 * Add new providers here as the app grows (e.g. QueryClientProvider, AuthProvider)
 */
export function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
