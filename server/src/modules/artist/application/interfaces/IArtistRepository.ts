import { ArtistProfileRow } from '../../domain/ArtistProfile.entity';
import { OrganizationRow } from '../../domain/Organization.entity';
import { StepRow } from '../../domain/ArtistOnboardingStep.entity';

// ── Supporting Types ──────────────────────────────────────────────────────

export interface ProfileUpdateData {
  full_name?: string | null;
  display_name?: string | null;
  city?: string | null;
  locality?: string | null;
  bio?: string | null;
  experience_years?: number | null;
}

export interface CreateOrgData {
  name: string;
  org_type: 'solo' | 'parlor';
  gstin?: string | null;
  address?: string | null;
  owner_user_id: string;
}

export interface UpdateOrgData {
  name?: string;
  gstin?: string | null;
  address?: string | null;
}

export interface VerificationUpdateData {
  kyc_status?: string;
  aadhaar_last4?: string | null;
  aadhaar_hash?: string | null;
}

export interface PortfolioRow {
  id: string;
  artist_id: string;
  image_id: string;
  image_url: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  moderation_status: string;
  moderation_note: string | null;
  created_at: string;
}

export interface OrgMemberRow {
  org_id: string;
  user_id: string;
  role: string;
  full_name: string | null;
  profile_image_id: string | null;
  onboarding_status: string;
}

export interface VerificationRow {
  artist_id: string;
  aadhaar_last4: string | null;
  kyc_status: string;
  bank_verified: boolean;
}

// ── Repository Interface ──────────────────────────────────────────────────

export interface IArtistRepository {
  // ── Artist Profile ──
  createProfile(userId: string): Promise<ArtistProfileRow>;
  findByUserId(userId: string): Promise<ArtistProfileRow | null>;
  updateProfile(userId: string, data: ProfileUpdateData): Promise<void>;
  setProfileImage(userId: string, imageId: string): Promise<void>;
  setOrgId(userId: string, orgId: string): Promise<void>;
  setOnboardingStatus(userId: string, status: string): Promise<void>;

  // ── Organization ──
  createOrganization(data: CreateOrgData): Promise<OrganizationRow>;
  updateOrganization(orgId: string, data: UpdateOrgData): Promise<void>;
  addOrgMember(orgId: string, userId: string, role: string): Promise<void>;
  getOrganization(orgId: string): Promise<OrganizationRow | null>;
  getOrgByOwnerId(ownerUserId: string): Promise<OrganizationRow | null>;
  countOrgSubMembers(orgId: string): Promise<number>;
  getOrgMembers(orgId: string): Promise<OrgMemberRow[]>;
  isOrgOwner(userId: string): Promise<boolean>;
  isSubArtist(userId: string): Promise<boolean>;

  // ── Onboarding Steps ──
  initOnboardingSteps(artistId: string): Promise<void>;
  getOnboardingSteps(artistId: string): Promise<StepRow | null>;
  advanceStep(artistId: string, step: number): Promise<void>;

  // ── Identity Verification ──
  upsertVerification(artistId: string, data: VerificationUpdateData): Promise<void>;
  getVerification(artistId: string): Promise<VerificationRow | null>;

  // ── Portfolio ──
  addPortfolioImage(artistId: string, imageId: string, category: string): Promise<PortfolioRow>;
  getPortfolio(artistId: string): Promise<PortfolioRow[]>;
  countPortfolio(artistId: string): Promise<number>;
}
