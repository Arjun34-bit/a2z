import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartServiceApi, type CartItemType } from '@/services/cart/cart.service';

export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

export const useCart = () => {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: () => cartServiceApi.getCart(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: Omit<CartItemType, 'id'>) => cartServiceApi.addItemToCart(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartServiceApi.removeItemFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
};
