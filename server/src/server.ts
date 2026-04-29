import dotenv from 'dotenv';
dotenv.config();

import { Database } from '@infrastructure/Database';
import { RedisClient } from '@infrastructure/RedisClient';
import { DatabaseInitializer } from '@shared/index';

// Auth Module
import { AuthUserRepository, OtpCacheService, AuthService, AuthController } from '@auth/index';

// User Module
import { UserProfileRepository, AddressRepository, UserProfileService, UserController } from '@user/index';

// Artist Module
import { ArtistRepository, ArtistService, ArtistController } from '@artist/index';

// Admin Module
import { AdminRepository, AdminService, AdminController } from '@admin/index';

import { createApp } from './app';

const PORT = process.env.PORT || 8000;

/**
 * Composition Root — Server Bootstrap
 * This is where ALL dependency injection wiring happens.
 */
const startServer = async () => {
  try {
    // 1. Infrastructure Singletons
    const db = Database.getInstance();
    await Database.connect();

    const redis = RedisClient.getInstance();
    await redis.connect();

    // 2. Database Initialization
    // NOTE: This will create the new UUID tables (auth_users, user_profiles, etc)
    await DatabaseInitializer.initialize(db);

    // 3. DI Wiring
    
    // Auth Module
    const authUserRepo = new AuthUserRepository(db);
    const otpCache = new OtpCacheService(redis);
    const authService = new AuthService(authUserRepo, otpCache);
    const authController = new AuthController(authService);

    // User Module
    const userProfileRepo = new UserProfileRepository(db);
    const addressRepo = new AddressRepository(db);
    const userProfileService = new UserProfileService(userProfileRepo, addressRepo);
    const userController = new UserController(userProfileService);

    // Artist Module
    const artistRepo = new ArtistRepository(db);
    const artistService = new ArtistService(artistRepo);
    const artistController = new ArtistController(artistService);

    // Admin Module
    const adminRepo = new AdminRepository(db);
    const adminService = new AdminService(adminRepo);
    const adminController = new AdminController(adminService);

    // 4. Create Express App
    const app = createApp({
      authController,
      userController,
      artistController,
      adminController,
    });

    // 5. Start Server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
