import { Sequelize, QueryTypes } from 'sequelize';
import bcrypt from 'bcrypt';

/**
 * AdminSeeder
 *
 * Seeds the superadmin user on server startup.
 * - Creates the admin user in app.users (email + hashed password)
 * - Ensures the 'admin' role exists in app.roles
 * - Creates a default set of permissions in app.permissions
 * - Links all permissions to the admin role in app.role_permissions
 * - Links the admin user to the admin role in app.user_roles
 *
 * Safe to run on every startup — uses ON CONFLICT DO NOTHING so it
 * won't duplicate data if the admin already exists.
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@a2z.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || 'Super';
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || 'Admin';

/**
 * Default permissions for the platform.
 * Add or remove entries here as your system grows.
 */
const DEFAULT_PERMISSIONS: string[] = [
  // User management
  'users:read',
  'users:create',
  'users:update',
  'users:delete',

  // Artist management
  'artists:read',
  'artists:create',
  'artists:update',
  'artists:delete',
  'artists:approve',

  // Booking management
  'bookings:read',
  'bookings:create',
  'bookings:update',
  'bookings:delete',

  // Payment management
  'payments:read',
  'payments:manage',

  // Role & Permission management
  'roles:read',
  'roles:create',
  'roles:update',
  'roles:delete',
  'permissions:read',
  'permissions:manage',

  // Dashboard & Analytics
  'dashboard:read',
  'analytics:read',

  // Platform settings
  'settings:read',
  'settings:update',
];

export class AdminSeeder {
  /**
   * Seeds the superadmin user, role, permissions, and all linking tables.
   * Runs inside a transaction for atomicity.
   * Skips gracefully if admin already exists.
   */
  static async seed(db: Sequelize): Promise<void> {
    const transaction = await db.transaction();

    try {
      // ──────────────────────────────────────────────
      // 1. Create admin user (skip if email exists)
      // ──────────────────────────────────────────────
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

      const userResult: any[] = await db.query(
        `INSERT INTO app.users (email, password_hash, first_name, last_name, is_active, is_verified, profile_stage, created_at, updated_at)
         VALUES (:email, :passwordHash, :firstName, :lastName, true, true, 'completed', NOW(), NOW())
         ON CONFLICT (email) DO NOTHING
         RETURNING user_id`,
        {
          replacements: {
            email: ADMIN_EMAIL,
            passwordHash,
            firstName: ADMIN_FIRST_NAME,
            lastName: ADMIN_LAST_NAME,
          },
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      // Get user_id — either from INSERT or existing row
      let adminUserId: string;
      const insertedRows = (userResult as any)[0];

      if (insertedRows && insertedRows.length > 0) {
        adminUserId = insertedRows[0].user_id;
        console.log(`[AdminSeeder] Created superadmin user: ${ADMIN_EMAIL}`);
      } else {
        // Admin already exists — fetch the user_id
        const existing: any[] = await db.query(
          `SELECT user_id FROM app.users WHERE email = :email LIMIT 1`,
          { replacements: { email: ADMIN_EMAIL }, type: QueryTypes.SELECT, transaction }
        );
        adminUserId = existing[0].user_id;
        console.log(`[AdminSeeder] Superadmin already exists: ${ADMIN_EMAIL} — skipping user creation.`);
      }

      // ──────────────────────────────────────────────
      // 2. Ensure 'admin' role exists
      // ──────────────────────────────────────────────
      await db.query(
        `INSERT INTO app.roles (role_name)
         VALUES ('admin')
         ON CONFLICT (role_name) DO NOTHING`,
        { type: QueryTypes.INSERT, transaction }
      );

      const roleResult: any[] = await db.query(
        `SELECT role_id FROM app.roles WHERE role_name = 'admin' LIMIT 1`,
        { type: QueryTypes.SELECT, transaction }
      );
      const adminRoleId: string = roleResult[0].role_id;

      // ──────────────────────────────────────────────
      // 3. Seed all default permissions
      // ──────────────────────────────────────────────
      for (const permName of DEFAULT_PERMISSIONS) {
        await db.query(
          `INSERT INTO app.permissions (permission_name)
           VALUES (:permName)
           ON CONFLICT (permission_name) DO NOTHING`,
          { replacements: { permName }, type: QueryTypes.INSERT, transaction }
        );
      }

      // ──────────────────────────────────────────────
      // 4. Link ALL permissions to the admin role
      // ──────────────────────────────────────────────
      const allPermissions: any[] = await db.query(
        `SELECT permission_id FROM app.permissions`,
        { type: QueryTypes.SELECT, transaction }
      );

      for (const perm of allPermissions) {
        await db.query(
          `INSERT INTO app.role_permissions (role_id, permission_id)
           VALUES (:roleId, :permId)
           ON CONFLICT (role_id, permission_id) DO NOTHING`,
          {
            replacements: { roleId: adminRoleId, permId: perm.permission_id },
            type: QueryTypes.INSERT,
            transaction,
          }
        );
      }

      // ──────────────────────────────────────────────
      // 5. Link admin user to admin role
      // ──────────────────────────────────────────────
      await db.query(
        `INSERT INTO app.user_roles (user_id, role_id)
         VALUES (:userId, :roleId)
         ON CONFLICT (user_id, role_id) DO NOTHING`,
        {
          replacements: { userId: adminUserId, roleId: adminRoleId },
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();
      console.log(`[AdminSeeder] Superadmin seeded successfully with ${allPermissions.length} permissions.`);
    } catch (error) {
      await transaction.rollback();
      console.error('[AdminSeeder] Failed to seed admin:', error);
      throw error;
    }
  }
}
