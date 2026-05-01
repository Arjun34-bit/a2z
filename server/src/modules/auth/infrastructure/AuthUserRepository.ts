import { Sequelize, QueryTypes, Transaction } from 'sequelize';
import { IAuthUserRepository } from '../application/interfaces/IAuthUserRepository';
import { AuthUser, AuthUserCreationData } from '../domain/AuthUser.entity';

export class AuthUserRepository implements IAuthUserRepository {
  constructor(private readonly db: Sequelize) { }

  async findById(id: string): Promise<AuthUser | null> {
    const results: any[] = await this.db.query(
      `SELECT u.user_id, u.phone, u.first_name, u.last_name,
              u.is_active, u.is_verified, u.created_at, u.updated_at, u.profile_stage as profilestage,
              r.role_name
       FROM app.users u
       LEFT JOIN app.user_roles ur ON u.user_id = ur.user_id
       LEFT JOIN app.roles r ON ur.role_id = r.role_id
       WHERE u.user_id = :id
       LIMIT 1`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? new AuthUser(results[0]) : null;
  }

  async findByPhone(phone: string): Promise<AuthUser | null> {
    const results: any[] = await this.db.query(
      `SELECT u.user_id, u.phone, u.first_name, u.last_name,
              u.is_active, u.is_verified, u.created_at, u.updated_at,u.profile_stage as profilestage,
              r.role_name
       FROM app.users u
       LEFT JOIN app.user_roles ur ON u.user_id = ur.user_id
       LEFT JOIN app.roles r ON ur.role_id = r.role_id
       WHERE u.phone = :phone
       LIMIT 1`,
      { replacements: { phone }, type: QueryTypes.SELECT }
    );
    console.log("results---->", results)
    return results.length > 0 ? new AuthUser(results[0]) : null;
  }

  /**
   * Creates a new user with phone and assigns the default 'user' role.
   * Uses a transaction to ensure atomicity across users, roles, and user_roles tables.
   */
  async create(data: AuthUserCreationData): Promise<AuthUser> {
    const transaction = await this.db.transaction();
    try {
      const user = await this._createUserWithRole(data, transaction);
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async createWithTransaction(data: AuthUserCreationData, transaction: Transaction): Promise<AuthUser> {
    return this._createUserWithRole(data, transaction);
  }

  /**
   * Internal helper: creates user row, ensures 'user' role exists, links them.
   */
  private async _createUserWithRole(data: AuthUserCreationData, transaction: Transaction): Promise<AuthUser> {
    // 1. Insert into app.users
    const userResults: any[] = await this.db.query(
      `INSERT INTO app.users (phone, created_at, updated_at)
       VALUES (:phone, NOW(), NOW())
       RETURNING user_id, phone, first_name, last_name, is_active, is_verified, created_at, updated_at`,
      {
        replacements: { phone: data.phone },
        type: QueryTypes.INSERT,
        transaction,
      }
    );
    const userRow = (userResults as any)[0][0];

    // 2. Ensure 'user' role exists in app.roles (INSERT ... ON CONFLICT DO NOTHING)
    await this.db.query(
      `INSERT INTO app.roles (role_name)
       VALUES ('user')
       ON CONFLICT (role_name) DO NOTHING`,
      { type: QueryTypes.INSERT, transaction }
    );

    // 3. Get the role_id for 'user'
    const roleResults: any[] = await this.db.query(
      `SELECT role_id FROM app.roles WHERE role_name = 'user' LIMIT 1`,
      { type: QueryTypes.SELECT, transaction }
    );
    const roleId = roleResults[0].role_id;

    // 4. Link user to role via app.user_roles
    await this.db.query(
      `INSERT INTO app.user_roles (user_id, role_id)
       VALUES (:userId, :roleId)`,
      {
        replacements: { userId: userRow.user_id, roleId },
        type: QueryTypes.INSERT,
        transaction,
      }
    );

    // Return hydrated entity with role
    return new AuthUser({ ...userRow, role_name: 'user' });
  }
}
