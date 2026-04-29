import { ArtistProfile } from '../../domain/ArtistProfile.entity';

export interface IArtistRepository {
  findByUserId(userId: string): Promise<ArtistProfile | null>;
  upsert(userId: string, data: Partial<ArtistProfile>): Promise<ArtistProfile>;
}
