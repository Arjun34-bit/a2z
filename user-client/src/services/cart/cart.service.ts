import { apiClient } from '@/services/api-client';

export interface CartItemType {
  id: string;
  serviceId: string;
  quantity: number;
}

export interface CartType {
  id: string;
  items: CartItemType[];
  totalAmount: number;
}

export const cartServiceApi = {
  getCart: async () => {
    return apiClient.get<CartType>('/cart');
  },

  addItemToCart: async (item: Omit<CartItemType, 'id'>) => {
    return apiClient.post<CartType>('/cart/items', item);
  },

  removeItemFromCart: async (itemId: string) => {
    return apiClient.delete<CartType>(`/cart/items/${itemId}`);
  },
};
