/**
 * Properties to hydrate an AuthUser entity from a raw DB row.
 */
export interface AuthUserProps {
  id: string; // UUID
  phone: string;
  role: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/**
 * Data required to create a new auth user.
 */
export interface AuthUserCreationData {
  phone: string;
  role: string;
}

/**
 * AuthUser Domain Entity
 * 
 * Minimal identity object for the auth module.
 * No profile data, no passwords.
 */
export class AuthUser {
  readonly id: string;
  readonly phone: string;
  readonly role: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(data: AuthUserProps) {
    this.id = data.id;
    this.phone = data.phone;
    this.role = data.role;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();
  }

  /**
   * Factory for creating a new customer identity
   */
  static createNewCustomer(phone: string): AuthUserCreationData {
    return { phone, role: 'customer' };
  }
}
