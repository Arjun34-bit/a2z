import sequelize from './index';

export const initializeDatabase = async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();

    // 1. Create Users Table
    // Updated to support either (name, email, password) for regular registration, or just (phoneOrEmail) for OTP
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "Users" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NULL,
        email VARCHAR(255) UNIQUE NULL,
        password VARCHAR(255) NULL,
        "phoneOrEmail" VARCHAR(255) UNIQUE NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add columns dynamically in case the table already exists from previous runs
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='phoneOrEmail') THEN
          ALTER TABLE "Users" ADD COLUMN "phoneOrEmail" VARCHAR(255) UNIQUE NULL;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='name' AND is_nullable='NO') THEN
          ALTER TABLE "Users" ALTER COLUMN name DROP NOT NULL;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='password' AND is_nullable='NO') THEN
          ALTER TABLE "Users" ALTER COLUMN password DROP NOT NULL;
        END IF;
      END $$;
    `);

    console.log('Auth database tables verified/created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
