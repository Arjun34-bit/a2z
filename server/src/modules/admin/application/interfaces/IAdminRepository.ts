import { ArtistProfile } from '@artist/index';

export interface IAdminRepository {
  findPendingArtists(): Promise<ArtistProfile[]>;
  approveArtist(artistId: string): Promise<boolean>;
  getDashboardStats(): Promise<{
    totalUsers: number;
    totalArtists: number;
    pendingApprovals: number;
  }>;
}
