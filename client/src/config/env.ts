/**
 * Type-safe environment variable access
 * Validates required env vars at build/runtime
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  // App
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_URL: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),

  // API
  API_URL: getEnvVar("NEXT_PUBLIC_API_URL", "http://localhost:8000/api"),

  // Feature flags
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;
