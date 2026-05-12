import { apiClient } from '@/services/api-client';
import type { PaginatedResponse } from '@/types';

// Example type for MakeupService
export interface MakeupServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const makeupServiceApi = {
  getServices: async (page = 1, limit = 10) => {
    return apiClient.get<PaginatedResponse<MakeupServiceType>>('/makeup-services', {
      params: { page: String(page), limit: String(limit) },
    });
  },

  getServiceById: async (id: string) => {
    return apiClient.get<MakeupServiceType>(`/makeup-services/${id}`);
  },
};
