export interface ArtistProfileProps {
  id: string; // UUID
  user_id: string; // Refers to auth_users.id
  display_name: string | null;
  bio: string | null;
  category: string | null;
  is_verified: boolean;
  is_available: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export class ArtistProfile {
  readonly id: string;
  readonly userId: string;
  readonly displayName: string | null;
  readonly bio: string | null;
  readonly category: string | null;
  readonly isVerified: boolean;
  readonly isAvailable: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(data: ArtistProfileProps) {
    this.id = data.id;
    this.userId = data.user_id;
    this.displayName = data.display_name;
    this.bio = data.bio;
    this.category = data.category;
    this.isVerified = data.is_verified;
    this.isAvailable = data.is_available;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();
  }

  toPublicJSON() {
    return {
      id: this.id,
      userId: this.userId,
      displayName: this.displayName,
      bio: this.bio,
      category: this.category,
      isVerified: this.isVerified,
      isAvailable: this.isAvailable,
    };
  }
}
