import { apiClient } from "./api-client";
import type { User } from "@/types";

/**
 * Authentication service
 * Encapsulates all auth-related API interactions
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", payload),

  logout: () => apiClient.post("/auth/logout"),

  getProfile: () => apiClient.get<User>("/auth/me"),

  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>("/auth/refresh", { refreshToken }),
};
