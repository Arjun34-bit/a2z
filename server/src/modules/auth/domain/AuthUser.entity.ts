/**
 * Properties to hydrate an AuthUser entity from a raw DB row.
 * Maps to: app.users JOIN app.user_roles JOIN app.roles
 */
export interface AuthUserProps {
  user_id: string; // UUID
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
  role_name?: string | null; // from joined roles table
  profilestage?: string | null;
}

/**
 * Data required to create a new auth user.
 */
export interface AuthUserCreationData {
  phone: string;
}

/**
 * AuthUser Domain Entity
 * 
 * Minimal identity object for the auth module.
 * Login is phone + OTP only. Role comes from the roles/user_roles tables.
 */
export class AuthUser {
  readonly id: string;
  readonly phone: string | null | undefined;
  readonly firstName: string | null | undefined;
  readonly lastName: string | null | undefined;
  readonly isActive: boolean;
  readonly isVerified: boolean;
  readonly role: string; // primary role from roles table
  readonly profilestage: string | null | undefined;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(data: AuthUserProps) {
    this.id = data.user_id;
    this.phone = data.phone;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.isActive = data.is_active ?? true;
    this.isVerified = data.is_verified ?? false;
    this.role = data.role_name ?? 'user';
    this.profilestage = data.profilestage;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();
  }

  /**
   * Factory for creating a new user identity (phone-only registration)
   */
  static createNewUser(phone: string): AuthUserCreationData {
    return { phone };
  }
}
