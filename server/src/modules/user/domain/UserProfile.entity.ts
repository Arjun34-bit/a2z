export interface UserProfileProps {
  id: string; // UUID
  user_id: string; // Refers to auth_users.id
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
  profilestage?: string | null | undefined;
}

export class UserProfile {
  readonly id: string;
  readonly userId: string;
  readonly name: string | null;
  readonly email: string | null;
  readonly avatarUrl: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly profilestage: string | null | undefined;

  constructor(data: UserProfileProps) {
    this.id = data.id;
    this.userId = data.user_id;
    this.name = data.name;
    this.email = data.email;
    this.avatarUrl = data.avatar_url;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();
    this.profilestage = data.profilestage;
  }

  toPublicJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      email: this.email,
      avatarUrl: this.avatarUrl,
      profilestage: this.profilestage,
    };
  }
}
