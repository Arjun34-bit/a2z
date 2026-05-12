import { apiClient } from '@/services/api-client';
import type { PaginatedResponse } from '@/types';

export interface CategoryType {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export const categoryServiceApi = {
  getCategories: async (page = 1, limit = 10) => {
    return apiClient.get<PaginatedResponse<CategoryType>>('/categories', {
      params: { page: String(page), limit: String(limit) },
    });
  },

  getCategoryById: async (id: string) => {
    return apiClient.get<CategoryType>(`/categories/${id}`);
  },
};
