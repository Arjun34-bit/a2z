// ── Raw DB row ────────────────────────────────────────────────────────────
export interface OrganizationRow {
  org_id: string;
  name: string;
  org_type: string | null;   // 'solo' | 'parlor'
  gstin: string | null;
  address: string | null;
  owner_user_id: string | null;
  is_active: boolean;
  created_at: string;
}

// ── Domain Entity ─────────────────────────────────────────────────────────
export class Organization {
  readonly orgId: string;
  readonly name: string;
  readonly orgType: string | null;
  readonly gstin: string | null;
  readonly address: string | null;
  readonly ownerUserId: string | null;
  readonly isActive: boolean;
  readonly createdAt: Date;

  constructor(data: OrganizationRow) {
    this.orgId = data.org_id;
    this.name = data.name;
    this.orgType = data.org_type;
    this.gstin = data.gstin;
    this.address = data.address;
    this.ownerUserId = data.owner_user_id;
    this.isActive = data.is_active;
    this.createdAt = new Date(data.created_at);
  }

  toPublicJSON() {
    return {
      orgId: this.orgId,
      name: this.name,
      orgType: this.orgType,
      gstin: this.gstin,
      address: this.address,
      ownerUserId: this.ownerUserId,
      isActive: this.isActive,
    };
  }
}
