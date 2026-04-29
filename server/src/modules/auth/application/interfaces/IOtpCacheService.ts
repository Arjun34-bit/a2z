/**
 * IOtpCacheService
 * 
 * Abstraction over OTP-related caching operations.
 * Implemented by OtpCacheService which wraps the Redis singleton.
 * Services NEVER touch Redis directly — they go through this interface.
 */
export interface IOtpCacheService {
  storeOtp(key: string, otp: string, ttlSeconds: number): Promise<void>;
  getOtp(key: string): Promise<string | null>;
  deleteOtp(key: string): Promise<void>;
  getAttempts(key: string): Promise<number>;
  incrementAttempts(key: string, ttlSeconds: number): Promise<void>;
  resetAttempts(key: string): Promise<void>;
}
