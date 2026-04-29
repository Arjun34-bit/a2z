import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Database Singleton
 * 
 * Centralizes the Sequelize connection instance.
 * ONLY used for raw SQL queries via sequelize.query() — NO ORM models.
 * Configured with connection pooling for production readiness.
 */
export class Database {
  private static instance: Sequelize;

  // Prevent direct instantiation
  private constructor() {}

  /**
   * Returns the singleton Sequelize instance.
   * Creates it lazily on first access with connection pooling.
   */
  static getInstance(): Sequelize {
    if (!this.instance) {
      this.instance = new Sequelize(
        process.env.DB_NAME as string,
        process.env.DB_USER as string,
        process.env.DB_PASSWORD as string,
        {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432', 10),
          dialect: 'postgres',
          logging: false,
          pool: {
            min: 5,
            max: 20,
            idle: 10000,    // 10 seconds idle before release
            acquire: 30000, // 30 seconds to acquire before timeout
            evict: 1000,    // 1 second eviction check interval
          },
        }
      );
    }
    return this.instance;
  }

  /**
   * Authenticates the database connection.
   * Should be called once at server startup.
   */
  static async connect(): Promise<void> {
    try {
      const sequelize = this.getInstance();
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }
}
