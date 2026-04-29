import { Sequelize, QueryTypes, Transaction } from 'sequelize';
import { IAuthUserRepository } from '../application/interfaces/IAuthUserRepository';
import { AuthUser, AuthUserCreationData } from '../domain/AuthUser.entity';

export class AuthUserRepository implements IAuthUserRepository {
  constructor(private readonly db: Sequelize) {}

  async findById(id: string): Promise<AuthUser | null> {
    const results: any[] = await this.db.query(
      `SELECT id, phone, role, created_at, updated_at
       FROM "auth_users"
       WHERE id = :id LIMIT 1`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? new AuthUser(results[0]) : null;
  }

  async findByPhone(phone: string): Promise<AuthUser | null> {
    const results: any[] = await this.db.query(
      `SELECT id, phone, role, created_at, updated_at
       FROM "auth_users"
       WHERE phone = :phone LIMIT 1`,
      { replacements: { phone }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? new AuthUser(results[0]) : null;
  }

  async create(data: AuthUserCreationData): Promise<AuthUser> {
    const results: any[] = await this.db.query(
      `INSERT INTO "auth_users" (phone, role, created_at, updated_at)
       VALUES (:phone, :role, NOW(), NOW())
       RETURNING id, phone, role, created_at, updated_at`,
      {
        replacements: { phone: data.phone, role: data.role },
        type: QueryTypes.INSERT,
      }
    );
    const row = (results as any)[0][0];
    return new AuthUser(row);
  }

  async createWithTransaction(data: AuthUserCreationData, transaction: Transaction): Promise<AuthUser> {
    const results: any[] = await this.db.query(
      `INSERT INTO "auth_users" (phone, role, created_at, updated_at)
       VALUES (:phone, :role, NOW(), NOW())
       RETURNING id, phone, role, created_at, updated_at`,
      {
        replacements: { phone: data.phone, role: data.role },
        type: QueryTypes.INSERT,
        transaction,
      }
    );
    const row = (results as any)[0][0];
    return new AuthUser(row);
  }
}
