import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingServiceApi, type BookingType } from '@/services/booking/booking.service';

export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...bookingKeys.lists(), { page, limit }] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
};

export const useBookings = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: bookingKeys.list(page, limit),
    queryFn: () => bookingServiceApi.getBookings(page, limit),
  });
};

export const useBooking = (id: string, enabled = true) => {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingServiceApi.getBookingById(id),
    enabled: !!id && enabled,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BookingType>) => bookingServiceApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
};
