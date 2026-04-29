import { IUserProfileRepository } from './interfaces/IUserProfileRepository';
import { IAddressRepository } from './interfaces/IAddressRepository';
import { UserProfile } from '../domain/UserProfile.entity';
import { Address } from '../domain/Address.entity';

export class UserProfileService {
  constructor(
    private readonly profileRepo: IUserProfileRepository,
    private readonly addressRepo: IAddressRepository,
  ) {}

  async getProfile(userId: string): Promise<UserProfile | null> {
    return this.profileRepo.findByUserId(userId);
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return this.profileRepo.upsert(userId, data);
  }

  async getAddresses(userId: string): Promise<Address[]> {
    return this.addressRepo.findByUserId(userId);
  }

  async addAddress(userId: string, data: Partial<Address>): Promise<Address> {
    // If it's the first address, make it default (business logic can go here)
    const existing = await this.addressRepo.findByUserId(userId);
    let addressData = { ...data };
    if (existing.length === 0) {
      addressData.isDefault = true;
    }
    return this.addressRepo.create(userId, addressData);
  }
}
