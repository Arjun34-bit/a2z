import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

/**
 * RedisClient Singleton
 * 
 * Centralizes the Redis connection instance.
 * Individual modules should NOT use this directly — instead,
 * they should create domain-specific cache classes that wrap this.
 */
export class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.on('connect', () => console.log('Connected to Redis successfully'));
  }

  /**
   * Returns the singleton RedisClient instance.
   */
  static getInstance(): RedisClient {
    if (!this.instance) {
      this.instance = new RedisClient();
    }
    return this.instance;
  }

  /**
   * Connects to Redis. Should be called once at server startup.
   */
  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  /**
   * Disconnects from Redis gracefully.
   */
  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  // ─── Typed Accessors ──────────────────────────────────────────

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async setEx(key: string, ttlSeconds: number, value: string): Promise<void> {
    await this.client.setEx(key, ttlSeconds, value);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }
}
