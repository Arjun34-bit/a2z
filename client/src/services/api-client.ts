import { API_BASE_URL } from "@/config/constants";
import type { ApiResponse, ApiError } from "@/types";

/**
 * Centralized API client — wraps fetch with:
 * - Base URL injection
 * - Auth token headers
 * - Standardized error handling
 * - Type-safe responses
 */

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  params?: Record<string, string>;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { body, params, headers: customHeaders, ...restOptions } = options;

    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    // Add auth token from localStorage if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        (headers as Record<string, string>)["Authorization"] =
          `Bearer ${token}`;
      }
    }

    const response = await fetch(url.toString(), {
      ...restOptions,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: "An unexpected error occurred",
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json() as Promise<ApiResponse<T>>;
  }

  async get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  async delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
