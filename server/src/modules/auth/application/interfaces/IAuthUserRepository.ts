import { AuthUser, AuthUserCreationData } from '../../domain/AuthUser.entity';
import { Transaction } from 'sequelize';

export interface IAuthUserRepository {
  findById(id: string): Promise<AuthUser | null>;
  findByPhone(phone: string): Promise<AuthUser | null>;
  create(data: AuthUserCreationData): Promise<AuthUser>;
  createWithTransaction(data: AuthUserCreationData, transaction: Transaction): Promise<AuthUser>;
}
