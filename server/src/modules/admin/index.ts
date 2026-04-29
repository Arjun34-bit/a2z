/**
 * Admin Module — Public API
 */

export type { IAdminRepository } from './application/interfaces/IAdminRepository';
export { AdminRepository } from './infrastructure/AdminRepository';
export { AdminService } from './application/AdminService';
export { AdminController } from './presentation/AdminController';
export { createAdminRoutes } from './presentation/admin.routes';
