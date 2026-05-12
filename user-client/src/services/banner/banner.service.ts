import { apiClient } from '@/services/api-client';
import type { PaginatedResponse } from '@/types';

export interface BannerType {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
}

export const bannerServiceApi = {
  getBanners: async (page = 1, limit = 10) => {
    return apiClient.get<PaginatedResponse<BannerType>>('/banners', {
      params: { page: String(page), limit: String(limit) },
    });
  },

  getBannerById: async (id: string) => {
    return apiClient.get<BannerType>(`/banners/${id}`);
  },
};
