import { IOtpCacheService } from '../application/interfaces/IOtpCacheService';
import { RedisClient } from '@infrastructure/RedisClient';

/**
 * OtpCacheService
 * 
 * Module-specific Redis wrapper for OTP operations.
 * Services call this — they NEVER access Redis directly.
 * 
 * Encapsulates key naming conventions (otp:, attempts:) so
 * consumers don't need to know about Redis key structure.
 */
export class OtpCacheService implements IOtpCacheService {
  private readonly OTP_PREFIX = 'otp:';
  private readonly ATTEMPTS_PREFIX = 'attempts:';

  constructor(private readonly redis: RedisClient) {}

  /**
   * Stores an OTP with a time-to-live.
   */
  async storeOtp(key: string, otp: string, ttlSeconds: number): Promise<void> {
    await this.redis.setEx(`${this.OTP_PREFIX}${key}`, ttlSeconds, otp);
  }

  /**
   * Retrieves a stored OTP (or null if expired/missing).
   */
  async getOtp(key: string): Promise<string | null> {
    return this.redis.get(`${this.OTP_PREFIX}${key}`);
  }

  /**
   * Deletes a stored OTP (e.g., after successful verification).
   */
  async deleteOtp(key: string): Promise<void> {
    await this.redis.del(`${this.OTP_PREFIX}${key}`);
  }

  /**
   * Returns the current OTP attempt count for a given key.
   */
  async getAttempts(key: string): Promise<number> {
    const value = await this.redis.get(`${this.ATTEMPTS_PREFIX}${key}`);
    return value ? parseInt(value, 10) : 0;
  }

  /**
   * Increments the OTP attempt counter.
   * Sets a TTL on first increment for automatic cooldown reset.
   */
  async incrementAttempts(key: string, ttlSeconds: number): Promise<void> {
    const fullKey = `${this.ATTEMPTS_PREFIX}${key}`;
    const current = await this.redis.get(fullKey);

    await this.redis.incr(fullKey);

    // Set TTL only on the first attempt
    if (!current) {
      await this.redis.expire(fullKey, ttlSeconds);
    }
  }

  /**
   * Resets the attempt counter (e.g., after successful OTP verification).
   */
  async resetAttempts(key: string): Promise<void> {
    await this.redis.del(`${this.ATTEMPTS_PREFIX}${key}`);
  }
}
