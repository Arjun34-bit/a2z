import { Sequelize, QueryTypes } from 'sequelize';
import { IUserProfileRepository } from '../application/interfaces/IUserProfileRepository';
import { UserProfile } from '../domain/UserProfile.entity';

export class UserProfileRepository implements IUserProfileRepository {
  constructor(private readonly db: Sequelize) { }

  async findByUserId(userId: string): Promise<UserProfile | null> {
    const results: any = await this.db.query(
      `SELECT up.*, u.profile_stage as profileStage
      FROM "user_profiles" up
      LEFT JOIN "users" u ON u.user_id = up.user_id
      WHERE up.user_id = :userId
      LIMIT 1`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      }
    );
    return results.length > 0 ? new UserProfile(results[0]) : null;
  }

  async upsert(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const transaction = await this.db.transaction();

    try {
      const results: any[] = await this.db.query(
        `INSERT INTO "user_profiles" (user_id, name, email, avatar_url, updated_at)
       VALUES (:userId, :name, :email, :avatarUrl, NOW())
       ON CONFLICT (user_id) 
       DO UPDATE SET 
          name = COALESCE(EXCLUDED.name, "user_profiles".name),
          email = COALESCE(EXCLUDED.email, "user_profiles".email),
          avatar_url = COALESCE(EXCLUDED.avatar_url, "user_profiles".avatar_url),
          updated_at = NOW()
       RETURNING *`,
        {
          replacements: {
            userId,
            name: data.name || null,
            email: data.email || null,
            avatarUrl: data.avatarUrl || null
          },
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await this.db.query(
        `UPDATE "users"
       SET profile_stage = 'name_added'
       WHERE user_id = :userId`,
        {
          replacements: { userId },
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      await transaction.commit();

      return new UserProfile((results as any)[0][0]);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
