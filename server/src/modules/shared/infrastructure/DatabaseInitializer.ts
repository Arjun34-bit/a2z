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

      // 8. Images Table (Upload Domain)
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.images (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          url TEXT NOT NULL,
          provider VARCHAR(50) NOT NULL,
          provider_file_id VARCHAR(255) NOT NULL,
          image_type TEXT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      // Safe migration: add image_type if the table already existed without it
      await db.query(`ALTER TABLE app.images ADD COLUMN IF NOT EXISTS image_type text NULL;`);

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
        CREATE INDEX IF NOT EXISTS idx_banners_active_time     ON app.banners (is_active, start_time, end_time);
        CREATE INDEX IF NOT EXISTS idx_banners_image_id        ON app.banners (image_id);
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

      // ─── Artist Onboarding Tables ─────────────────────────────────────────

      // 12. Organizations
      //     Both solo artists and parlors have an org row.
      //     Solo → org_type = 'solo', exactly 1 member (the artist themselves)
      //     Parlor → org_type = 'parlor', owner + up to 4 sub-members
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.organizations (
          org_id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name          TEXT NOT NULL,
          org_type      TEXT NULL CHECK (org_type IN ('solo', 'parlor')),
          gstin         VARCHAR(15) NULL,
          address       TEXT NULL,
          owner_user_id UUID NULL REFERENCES app.users(user_id),
          is_active     BOOLEAN DEFAULT true,
          created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_organizations_owner ON app.organizations(owner_user_id);
      `);

      // 13. Organization Members
      //     role = 'owner' (creator) | 'member' (sub-artist added by owner)
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.organization_members (
          org_id  UUID NOT NULL REFERENCES app.organizations(org_id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES app.users(user_id) ON DELETE CASCADE,
          role    TEXT NULL CHECK (role IN ('owner', 'member')),
          CONSTRAINT organization_members_pkey PRIMARY KEY (org_id, user_id)
        );
        CREATE INDEX IF NOT EXISTS idx_org_members_org  ON app.organization_members(org_id);
        CREATE INDEX IF NOT EXISTS idx_org_members_user ON app.organization_members(user_id);
      `);

      // 14. Artist Profiles
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.artist_profiles (
          artist_id         UUID PRIMARY KEY REFERENCES app.users(user_id),
          org_id            UUID NULL REFERENCES app.organizations(org_id),
          full_name         TEXT NULL,
          display_name      TEXT NULL,
          city              TEXT NULL,
          locality          TEXT NULL,
          profile_image_id  UUID NULL REFERENCES app.images(id),
          bio               TEXT NULL,
          experience_years  INT NULL,
          rating            NUMERIC(2,1) DEFAULT 0,
          total_reviews     INT DEFAULT 0,
          service_radius_km INT DEFAULT 10,
          onboarding_status TEXT DEFAULT 'draft'
            CHECK (onboarding_status IN ('draft','pending_review','approved','rejected')),
          verification_tier TEXT DEFAULT 'none',
          risk_score        INT DEFAULT 0,
          is_active         BOOLEAN DEFAULT true,
          created_at        TIMESTAMPTZ DEFAULT NOW(),
          updated_at        TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_artist_profiles_org    ON app.artist_profiles(org_id);
        CREATE INDEX IF NOT EXISTS idx_artist_profiles_status ON app.artist_profiles(onboarding_status);
      `);

      // 15. Artist Onboarding Steps
      //     Tracks which UI steps have been completed (int[] allows out-of-order completion)
      //     Step map: 1=type_selection, 2=basic_info, 3=RESERVED(services), 4=identity_verify, 5=portfolio
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.artist_onboarding_steps (
          artist_id       UUID PRIMARY KEY REFERENCES app.artist_profiles(artist_id) ON DELETE CASCADE,
          current_step    INT DEFAULT 1,
          steps_completed INT[] DEFAULT '{}',
          last_saved_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 16. Artist Portfolios
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.artist_portfolios (
          id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          artist_id         UUID NOT NULL REFERENCES app.artist_profiles(artist_id) ON DELETE CASCADE,
          image_id          UUID NOT NULL REFERENCES app.images(id) ON DELETE CASCADE,
          category          TEXT NOT NULL,
          sort_order        INT DEFAULT 0,
          is_active         BOOLEAN DEFAULT true,
          moderation_status TEXT DEFAULT 'pending'
            CHECK (moderation_status IN ('pending','approved','rejected')),
          moderation_note   TEXT NULL,
          created_at        TIMESTAMPTZ DEFAULT NOW(),
          updated_at        TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE (artist_id, image_id)
        );
        CREATE INDEX IF NOT EXISTS idx_portfolios_artist ON app.artist_portfolios(artist_id);
      `);

      // 17. Artist Verification (KYC — future-ready)
      //     kyc_status progresses: not_started → pending → verified | failed
      await db.query(`
        CREATE TABLE IF NOT EXISTS app.artist_verification (
          artist_id          UUID PRIMARY KEY REFERENCES app.artist_profiles(artist_id) ON DELETE CASCADE,
          aadhaar_last4      CHAR(4) NULL,
          aadhaar_hash       TEXT NULL,
          face_match_score   INT NULL,
          kyc_status         TEXT DEFAULT 'not_started'
            CHECK (kyc_status IN ('not_started','pending','verified','failed')),
          bank_account_last4 CHAR(4) NULL,
          bank_verified      BOOLEAN DEFAULT false,
          created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log('Database schema initialized (app schema + tables).');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
}
