import { apiClient } from '@/services/api-client';
import type { User, PaginatedResponse } from '@/types';

export const userService = {
  // Get all users (example paginated response)
  getUsers: async (page = 1, limit = 10) => {
    return apiClient.get<PaginatedResponse<User>>('/users', {
      params: { page: String(page), limit: String(limit) },
    });
  },

  // Get a single user by ID
  getUserById: async (id: string) => {
    return apiClient.get<User>(`/users/${id}`);
  },

  // Update a user profile
  updateUser: async (id: string, data: Partial<User>) => {
    return apiClient.put<User>(`/users/${id}`, data);
  },
};
