import { Sequelize, QueryTypes } from 'sequelize';
import { IAddressRepository } from '../application/interfaces/IAddressRepository';
import { Address } from '../domain/Address.entity';

export class AddressRepository implements IAddressRepository {
  constructor(private readonly db: Sequelize) { }

  async findByUserId(userId: string): Promise<Address[]> {
    const results: any[] = await this.db.query(
      `SELECT ua.*,u.profile_stage as profileStage FROM "user_addresses" as ua LEFT JOIN users u ON ua.user_id = u.user_id WHERE u.user_id = :userId ORDER BY ua.is_default DESC`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );
    return results.map(row => new Address(row));
  }

  async create(userId: string, data: Partial<Address>): Promise<Address> {
    const transaction = await this.db.transaction();

    try {
      const results: any[] = await this.db.query(
        `INSERT INTO "user_addresses" 
       (user_id, label, address_line1, address_line2, city, state, pincode, is_default)
       VALUES (:userId, :label, :line1, :line2, :city, :state, :pincode, :isDefault)
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
          transaction,
        }
      );

      await this.db.query(
        `UPDATE "users"
       SET profile_stage = 'address_added'
       WHERE user_id = :userId`,
        {
          replacements: { userId },
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      await transaction.commit();

      return new Address((results as any)[0][0]);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
