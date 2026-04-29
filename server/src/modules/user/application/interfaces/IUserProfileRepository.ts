import { UserProfile } from '../../domain/UserProfile.entity';

export interface IUserProfileRepository {
  findByUserId(userId: string): Promise<UserProfile | null>;
  upsert(userId: string, data: Partial<UserProfile>): Promise<UserProfile>;
}
