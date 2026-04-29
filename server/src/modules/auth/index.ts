/**
 * Auth Module — Public API
 */

// Domain
export { AuthUser } from './domain/AuthUser.entity';

// Interfaces
export type { IAuthUserRepository } from './application/interfaces/IAuthUserRepository';
export type { IOtpCacheService } from './application/interfaces/IOtpCacheService';
export type { IAuthService } from './application/interfaces/IAuthService';

// Implementations
export { AuthUserRepository } from './infrastructure/AuthUserRepository';
export { OtpCacheService } from './infrastructure/OtpCacheService';
export { AuthService } from './application/AuthService';

// Presentation
export { AuthController } from './presentation/AuthController';
export { createAuthRoutes } from './presentation/auth.routes';
