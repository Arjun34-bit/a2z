"use client";

import { ThemeProvider } from "./theme-provider";
import { ReactQueryProvider } from "./query-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Composes all application providers in a single wrapper
 * Add new providers here as the app grows (e.g. QueryClientProvider, AuthProvider)
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ReactQueryProvider>
  );
}
