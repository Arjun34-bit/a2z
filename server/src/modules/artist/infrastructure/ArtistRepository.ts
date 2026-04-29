import { Sequelize, QueryTypes } from 'sequelize';
import { IArtistRepository } from '../application/interfaces/IArtistRepository';
import { ArtistProfile } from '../domain/ArtistProfile.entity';

export class ArtistRepository implements IArtistRepository {
  constructor(private readonly db: Sequelize) {}

  async findByUserId(userId: string): Promise<ArtistProfile | null> {
    const results: any[] = await this.db.query(
      `SELECT * FROM "artist_profiles" WHERE user_id = :userId LIMIT 1`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? new ArtistProfile(results[0]) : null;
  }

  async upsert(userId: string, data: Partial<ArtistProfile>): Promise<ArtistProfile> {
    const results: any[] = await this.db.query(
      `INSERT INTO "artist_profiles" (user_id, display_name, bio, category, is_available, updated_at)
       VALUES (:userId, :displayName, :bio, :category, :isAvailable, NOW())
       ON CONFLICT (user_id) 
       DO UPDATE SET 
          display_name = COALESCE(EXCLUDED.display_name, "artist_profiles".display_name),
          bio = COALESCE(EXCLUDED.bio, "artist_profiles".bio),
          category = COALESCE(EXCLUDED.category, "artist_profiles".category),
          is_available = COALESCE(EXCLUDED.is_available, "artist_profiles".is_available),
          updated_at = NOW()
       RETURNING *`,
      {
        replacements: { 
          userId, 
          displayName: data.displayName || null, 
          bio: data.bio || null, 
          category: data.category || null,
          isAvailable: data.isAvailable !== undefined ? data.isAvailable : true
        },
        type: QueryTypes.INSERT,
      }
    );
    return new ArtistProfile((results as any)[0][0]);
  }
}
