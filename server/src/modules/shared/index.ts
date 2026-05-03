/**
 * Shared Module — Public API
 */

// Infrastructure
export { DatabaseInitializer } from './infrastructure/DatabaseInitializer';
export { AdminSeeder } from './infrastructure/AdminSeeder';

// Middlewares
export { requireAuth } from './middlewares/requireAuth';
export { requireRole } from './middlewares/requireRole';
export { errorHandler } from './middlewares/errorHandler';
export type { AuthRequest } from './middlewares/requireAuth';

// Utilities
export { decryptPayload, encryptPayload } from './utils/crypto';
export { generateToken, generateTokens, verifyToken, verifyRefreshToken } from './utils/jwt';
export type { JwtPayload } from './utils/jwt';
export { generateOTP } from './utils/otp';
export * from './utils/errors';
export { AppError } from './utils/AppError';
