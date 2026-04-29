import { IArtistRepository } from './interfaces/IArtistRepository';
import { ArtistProfile } from '../domain/ArtistProfile.entity';

export class ArtistService {
  constructor(private readonly artistRepo: IArtistRepository) {}

  async getProfile(userId: string): Promise<ArtistProfile | null> {
    return this.artistRepo.findByUserId(userId);
  }

  async updateProfile(userId: string, data: Partial<ArtistProfile>): Promise<ArtistProfile> {
    return this.artistRepo.upsert(userId, data);
  }
}
