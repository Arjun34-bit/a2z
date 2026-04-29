import { z } from 'zod';

export const phoneSchema = z.object({
  phone: z.string().min(10, 'Invalid phone number'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().min(10, 'Invalid phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type PhoneInput = z.infer<typeof phoneSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
