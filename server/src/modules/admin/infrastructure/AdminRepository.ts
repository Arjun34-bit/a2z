import { Sequelize, QueryTypes } from 'sequelize';
import { IAdminRepository } from '../application/interfaces/IAdminRepository';
import { ArtistProfile } from '@artist/index';

export class AdminRepository implements IAdminRepository {
  constructor(private readonly db: Sequelize) {}

  async findPendingArtists(): Promise<ArtistProfile[]> {
    const results: any[] = await this.db.query(
      `SELECT * FROM "artist_profiles" WHERE is_verified = false ORDER BY created_at ASC`,
      { type: QueryTypes.SELECT }
    );
    return results.map(row => new ArtistProfile(row));
  }

  async approveArtist(artistId: string): Promise<boolean> {
    const [_, metadata] = await this.db.query(
      `UPDATE "artist_profiles" SET is_verified = true, updated_at = NOW() WHERE id = :artistId`,
      { replacements: { artistId }, type: QueryTypes.UPDATE }
    );
    return (metadata as any).rowCount > 0;
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalArtists: number;
    pendingApprovals: number;
  }> {
    const results: any[] = await this.db.query(
      `SELECT 
        (SELECT COUNT(*) FROM "auth_users" WHERE role = 'customer') as "totalUsers",
        (SELECT COUNT(*) FROM "artist_profiles" WHERE is_verified = true) as "totalArtists",
        (SELECT COUNT(*) FROM "artist_profiles" WHERE is_verified = false) as "pendingApprovals"
      `,
      { type: QueryTypes.SELECT }
    );

    const row = results[0];
    return {
      totalUsers: parseInt(row.totalUsers, 10),
      totalArtists: parseInt(row.totalArtists, 10),
      pendingApprovals: parseInt(row.pendingApprovals, 10),
    };
  }
}
