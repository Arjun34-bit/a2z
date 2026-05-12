import { apiClient } from '@/services/api-client';
import type { PaginatedResponse } from '@/types';

export interface BookingType {
  id: string;
  userId: string;
  serviceId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  date: string;
}

export const bookingServiceApi = {
  getBookings: async (page = 1, limit = 10) => {
    return apiClient.get<PaginatedResponse<BookingType>>('/bookings', {
      params: { page: String(page), limit: String(limit) },
    });
  },

  getBookingById: async (id: string) => {
    return apiClient.get<BookingType>(`/bookings/${id}`);
  },

  createBooking: async (data: Partial<BookingType>) => {
    return apiClient.post<BookingType>('/bookings', data);
  },
};
