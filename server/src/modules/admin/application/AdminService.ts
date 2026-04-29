import { IAdminRepository } from './interfaces/IAdminRepository';
import { ArtistProfile } from '@artist/index';

export class AdminService {
  constructor(private readonly adminRepo: IAdminRepository) {}

  async getPendingArtists(): Promise<ArtistProfile[]> {
    return this.adminRepo.findPendingArtists();
  }

  async approveArtist(artistId: string): Promise<{ success: boolean; message: string }> {
    const approved = await this.adminRepo.approveArtist(artistId);
    if (!approved) {
      throw new Error('Artist not found or already approved.');
    }
    return { success: true, message: 'Artist approved successfully.' };
  }

  async getDashboardStats() {
    return this.adminRepo.getDashboardStats();
  }
}
