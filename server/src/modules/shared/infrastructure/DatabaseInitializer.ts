import { Sequelize } from 'sequelize';

/**
 * DatabaseInitializer
 * 
 * Handles table creation and schema migrations using raw SQL.
 * Receives the Sequelize instance via parameter.
 * NO ORM models, NO define(), NO associations.
 */
export class DatabaseInitializer {
  static async initialize(db: Sequelize): Promise<void> {
    try {
      await db.query(`CREATE SCHEMA IF NOT EXISTS app;`);
      // 1. Enable UUID extension
      await db.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

      // 2. Auth Users Table (Identity only)
      await db.query(`
        CREATE TABLE IF NOT EXISTS "auth_users" (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          phone VARCHAR(20) UNIQUE NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'customer',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // 3. User Profiles Table (Customer Domain)
      // await db.query(`
      //   CREATE TABLE IF NOT EXISTS "user_profiles" (
      //     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      //     user_id UUID UNIQUE NOT NULL REFERENCES "auth_users"(id) ON DELETE CASCADE,
      //     name VARCHAR(255),
      //     email VARCHAR(255),
      //     avatar_url TEXT,
      //     created_at TIMESTAMPTZ DEFAULT NOW(),
      //     updated_at TIMESTAMPTZ DEFAULT NOW()
      //   );
      // `);

      // // 4. Addresses Table (Customer Domain)
      // await db.query(`
      //   CREATE TABLE IF NOT EXISTS "addresses" (
      //     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      //     user_id UUID NOT NULL REFERENCES "auth_users"(id) ON DELETE CASCADE,
      //     label VARCHAR(50),
      //     line1 VARCHAR(255) NOT NULL,
      //     line2 VARCHAR(255),
      //     city VARCHAR(100) NOT NULL,
      //     state VARCHAR(100) NOT NULL,
      //     pincode VARCHAR(10) NOT NULL,
      //     is_default BOOLEAN DEFAULT false,
      //     created_at TIMESTAMPTZ DEFAULT NOW(),
      //     updated_at TIMESTAMPTZ DEFAULT NOW()
      //   );
      // `);

      // // 5. Artist Profiles Table (Artist Domain)
      // await db.query(`
      //   CREATE TABLE IF NOT EXISTS "artist_profiles" (
      //     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      //     user_id UUID UNIQUE NOT NULL REFERENCES "auth_users"(id) ON DELETE CASCADE,
      //     display_name VARCHAR(255),
      //     bio TEXT,
      //     category VARCHAR(100),
      //     is_verified BOOLEAN DEFAULT false,
      //     is_available BOOLEAN DEFAULT true,
      //     created_at TIMESTAMPTZ DEFAULT NOW(),
      //     updated_at TIMESTAMPTZ DEFAULT NOW()
      //   );
      // `);

      console.log('Database schema set to app.');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
}
