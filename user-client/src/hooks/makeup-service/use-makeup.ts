import { useQuery } from '@tanstack/react-query';
import { makeupServiceApi } from '@/services/makeup-service/makeup.service';

export const makeupServiceKeys = {
  all: ['makeup-services'] as const,
  lists: () => [...makeupServiceKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...makeupServiceKeys.lists(), { page, limit }] as const,
  details: () => [...makeupServiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...makeupServiceKeys.details(), id] as const,
};

export const useMakeupServices = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: makeupServiceKeys.list(page, limit),
    queryFn: () => makeupServiceApi.getServices(page, limit),
  });
};

export const useMakeupService = (id: string, enabled = true) => {
  return useQuery({
    queryKey: makeupServiceKeys.detail(id),
    queryFn: () => makeupServiceApi.getServiceById(id),
    enabled: !!id && enabled,
  });
};
