/**
 * Application-wide constants
 * Centralized to avoid magic numbers/strings scattered across the codebase
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const AUTH = {
  TOKEN_KEY: "auth_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  SESSION_DURATION: 60 * 60 * 24 * 7, // 7 days in seconds
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  PROFILE: "/profile",
} as const;
