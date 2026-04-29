import { Sequelize, QueryTypes } from 'sequelize';
import { IAddressRepository } from '../application/interfaces/IAddressRepository';
import { Address } from '../domain/Address.entity';

export class AddressRepository implements IAddressRepository {
  constructor(private readonly db: Sequelize) {}

  async findByUserId(userId: string): Promise<Address[]> {
    const results: any[] = await this.db.query(
      `SELECT * FROM "addresses" WHERE user_id = :userId ORDER BY is_default DESC, created_at DESC`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );
    return results.map(row => new Address(row));
  }

  async create(userId: string, data: Partial<Address>): Promise<Address> {
    const results: any[] = await this.db.query(
      `INSERT INTO "addresses" (user_id, label, line1, line2, city, state, pincode, is_default, created_at, updated_at)
       VALUES (:userId, :label, :line1, :line2, :city, :state, :pincode, :isDefault, NOW(), NOW())
       RETURNING *`,
      {
        replacements: { 
          userId, 
          label: data.label || null,
          line1: data.line1,
          line2: data.line2 || null,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          isDefault: data.isDefault || false
        },
        type: QueryTypes.INSERT,
      }
    );
    return new Address((results as any)[0][0]);
  }
}
