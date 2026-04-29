/**
 * User Module — Public API
 */

export { UserProfile } from './domain/UserProfile.entity';
export { Address } from './domain/Address.entity';

export type { IUserProfileRepository } from './application/interfaces/IUserProfileRepository';
export type { IAddressRepository } from './application/interfaces/IAddressRepository';

export { UserProfileRepository } from './infrastructure/UserProfileRepository';
export { AddressRepository } from './infrastructure/AddressRepository';
export { UserProfileService } from './application/UserProfileService';

export { UserController } from './presentation/UserController';
export { createUserRoutes } from './presentation/user.routes';
