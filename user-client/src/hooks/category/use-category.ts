import { useQuery } from '@tanstack/react-query';
import { categoryServiceApi } from '@/services/category/category.service';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...categoryKeys.lists(), { page, limit }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const useCategories = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: categoryKeys.list(page, limit),
    queryFn: () => categoryServiceApi.getCategories(page, limit),
  });
};

export const useCategory = (id: string, enabled = true) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryServiceApi.getCategoryById(id),
    enabled: !!id && enabled,
  });
};
