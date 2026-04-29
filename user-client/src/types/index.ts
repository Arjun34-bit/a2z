/**
 * Shared TypeScript types used across the application
 * Domain-specific types should live near their feature modules
 */

// ─── API Response Types ──────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ─── User Types ──────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "user" | "supplier";

// ─── Common Utility Types ────────────────────────────────────────────
export type Nullable<T> = T | null;

export type WithChildren<T = object> = T & {
  children: React.ReactNode;
};

export type WithClassName<T = object> = T & {
  className?: string;
};
