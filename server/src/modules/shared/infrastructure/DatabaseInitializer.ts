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

      await db.query(`SET search_path TO app;`);
      // 1. Enable UUID extension
      await db.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

      // 2. Auth Users Table (Identity only)
      // await db.query(`
      //   CREATE TABLE IF NOT EXISTS "auth_users" (
      //     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      //     phone VARCHAR(20) UNIQUE NOT NULL,
      //     role VARCHAR(20) NOT NULL DEFAULT 'customer',
      //     created_at TIMESTAMPTZ DEFAULT NOW(),
      //     updated_at TIMESTAMPTZ DEFAULT NOW()
      //   );
      // `);

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


      // 8. Images Table (Upload Domain)
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.images (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          url TEXT NOT NULL,
          provider VARCHAR(50) NOT NULL,
          provider_file_id VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // 9. Banner Positions
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.banner_positions ( 
            position_id VARCHAR(50) PRIMARY KEY, 
            description TEXT 
        );
      `);

      // 10. Banners
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.banners ( 
            banner_id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
            title VARCHAR(255), 
            image_id UUID REFERENCES app.images(id) ON DELETE SET NULL,
            mobile_image_id UUID REFERENCES app.images(id) ON DELETE SET NULL,
            redirect_url TEXT, 
            description TEXT, 
            position VARCHAR(50) REFERENCES app.banner_positions(position_id) ON DELETE SET NULL, 
            start_time TIMESTAMPTZ, 
            end_time TIMESTAMPTZ, 
            is_active BOOLEAN DEFAULT true, 
            is_deleted BOOLEAN DEFAULT false, 
            priority INT DEFAULT 0, 
            created_at TIMESTAMPTZ DEFAULT NOW(), 
            updated_at TIMESTAMPTZ DEFAULT NOW() 
        );
        CREATE INDEX IF NOT EXISTS idx_banners_active_time ON app.banners (is_active, start_time, end_time); 
        CREATE INDEX IF NOT EXISTS idx_banners_image_id ON app.banners (image_id); 
        CREATE INDEX IF NOT EXISTS idx_banners_mobile_image_id ON app.banners (mobile_image_id); 
      `);

      // 11. Banner Targeting
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.banner_targeting ( 
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
            banner_id UUID REFERENCES app.banners(banner_id) ON DELETE CASCADE, 
            user_type VARCHAR(50), 
            platform VARCHAR(50), 
            country VARCHAR(50), 
            state VARCHAR(50), 
            min_app_version VARCHAR(20), 
            created_at TIMESTAMPTZ DEFAULT NOW() 
        );
        CREATE INDEX IF NOT EXISTS idx_banner_targeting_banner ON app.banner_targeting (banner_id);
      `);

      console.log('Database schema initialized (app schema + tables).');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
}
