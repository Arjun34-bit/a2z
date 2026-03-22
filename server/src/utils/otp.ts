import crypto from 'crypto';

export const generateOTP = (): string => {
  // Generates a random 6-digit OTP string between 100000 and 999999
  return crypto.randomInt(100000, 999999).toString();
};
