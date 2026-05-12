import { useQuery } from '@tanstack/react-query';
import { bannerServiceApi } from '@/services/banner/banner.service';

export const bannerKeys = {
  all: ['banners'] as const,
  lists: () => [...bannerKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...bannerKeys.lists(), { page, limit }] as const,
  details: () => [...bannerKeys.all, 'detail'] as const,
  detail: (id: string) => [...bannerKeys.details(), id] as const,
};

export const useBanners = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: bannerKeys.list(page, limit),
    queryFn: () => bannerServiceApi.getBanners(page, limit),
  });
};

export const useBanner = (id: string, enabled = true) => {
  return useQuery({
    queryKey: bannerKeys.detail(id),
    queryFn: () => bannerServiceApi.getBannerById(id),
    enabled: !!id && enabled,
  });
};
