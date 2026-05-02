import { Sequelize, QueryTypes } from 'sequelize';
import { IImageRepository, ImageMetadata } from '../application/interfaces/IImageRepository';

export class ImageRepository implements IImageRepository {
  constructor(private readonly db: Sequelize) {}

  async save(metadata: ImageMetadata): Promise<ImageMetadata> {
    const results: any[] = await this.db.query(
      `INSERT INTO app.images (url, provider, provider_file_id, created_at, updated_at)
       VALUES (:url, :provider, :provider_file_id, NOW(), NOW())
       RETURNING *`,
      {
        replacements: {
          url: metadata.url,
          provider: metadata.provider,
          provider_file_id: metadata.provider_file_id,
        },
        type: QueryTypes.INSERT,
      }
    );
    return (results as any)[0][0];
  }

  async findById(id: string): Promise<ImageMetadata | null> {
    const results: any[] = await this.db.query(
      `SELECT * FROM app.images WHERE id = :id LIMIT 1`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? results[0] : null;
  }

  async delete(id: string): Promise<boolean> {
    const result: any = await this.db.query(
      `DELETE FROM app.images WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.DELETE }
    );
    return (result as any)?.rowCount > 0 || (Array.isArray(result) && (result[1] as any)?.rowCount > 0);
  }
}
