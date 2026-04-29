import { Address } from '../../domain/Address.entity';

export interface IAddressRepository {
  findByUserId(userId: string): Promise<Address[]>;
  create(userId: string, data: Partial<Address>): Promise<Address>;
}
