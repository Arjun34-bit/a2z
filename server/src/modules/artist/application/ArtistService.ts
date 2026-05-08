import * as crypto from 'crypto';
import {
  IArtistRepository,
  ProfileUpdateData,
} from './interfaces/IArtistRepository';
import { ImageService } from '@upload/index';
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  ConflictError,
  ValidationError,
} from '@shared/index';

// ── Onboarding Step Constants ─────────────────────────────────────────────
export const STEP = {
  TYPE_SELECTION:   1,
  BASIC_INFO:       2,
  // 3 = RESERVED for service-adding
  IDENTITY_VERIFY:  4,
  PORTFOLIO:        5,
} as const;

export const MIN_PORTFOLIO_IMAGES = 5;
export const MAX_SUB_MEMBERS      = 4;

export class ArtistService {
  constructor(
    private readonly artistRepo: IArtistRepository,
    private readonly imageService: ImageService
  ) {}

  // ── 1. Start Onboarding ─────────────────────────────────────────────────
  /**
   * Idempotent — safe to call multiple times.
   * Creates artist_profile + step tracker if they don't exist.
   */
  async startOnboarding(userId: string) {
    let profile = await this.artistRepo.findByUserId(userId);

    if (!profile) {
      profile = await this.artistRepo.createProfile(userId);
      await this.artistRepo.initOnboardingSteps(userId);
    }

    const steps = await this.artistRepo.getOnboardingSteps(userId);

    return {
      profile,
      steps,
    };
  }

  // ── 2. Set Artist Type (Step 1) ─────────────────────────────────────────
  /**
   * Creates the organization shell for the artist.
   * Solo artists get org_type='solo'; parlors get org_type='parlor'.
   * Both cases: artist becomes org owner + member.
   */
  async setArtistType(userId: string, orgType: 'solo' | 'parlor') {
    const profile = await this.artistRepo.findByUserId(userId);
    if (!profile) throw new NotFoundError('Artist profile not found. Call /onboarding/start first.');

    // If org already exists, update the type
    if (profile.org_id) {
      await this.artistRepo.updateOrganization(profile.org_id, {});
      await this.artistRepo.advanceStep(userId, STEP.TYPE_SELECTION);
      return this.artistRepo.getOrganization(profile.org_id);
    }

    // Create organization shell (name will be filled at basic_info step)
    const org = await this.artistRepo.createOrganization({
      name: orgType === 'solo' ? 'Solo Artist' : 'Parlor',
      org_type: orgType,
      owner_user_id: userId,
    });

    // Link org to artist profile
    await this.artistRepo.setOrgId(userId, org.org_id);

    // Add artist as owner in organization_members
    await this.artistRepo.addOrgMember(org.org_id, userId, 'owner');

    // Advance step
    await this.artistRepo.advanceStep(userId, STEP.TYPE_SELECTION);

    return org;
  }

  // ── 3. Update Basic Info (Step 2) ───────────────────────────────────────
  /**
   * Solo:   requires full_name, city, locality
   * Parlor: requires full_name, city, locality + parlor_name, gstin, address
   * Organisation name is updated from the parlor_name (or full_name for solo).
   */
  async updateBasicInfo(userId: string, data: {
    full_name?: string;
    display_name?: string;
    city?: string;
    locality?: string;
    bio?: string;
    experience_years?: number;
    parlor_name?: string;
    gstin?: string;
    address?: string;
  }) {
    const profile = await this.artistRepo.findByUserId(userId);
    if (!profile) throw new NotFoundError('Artist profile not found.');
    if (!profile.org_id) throw new BadRequestError('Artist type not selected. Complete step 1 first.');

    const org = await this.artistRepo.getOrganization(profile.org_id);
    if (!org) throw new NotFoundError('Organization not found.');

    const isParlor = org.org_type === 'parlor';

    // Validation — required fields vary by type
    const missing: string[] = [];
    if (!data.full_name)  missing.push('full_name');
    if (!data.city)       missing.push('city');
    if (!data.locality)   missing.push('locality');
    if (isParlor) {
      if (!data.parlor_name) missing.push('parlor_name');
      if (!data.gstin)       missing.push('gstin');
      if (!data.address)     missing.push('address');
    }
    if (missing.length > 0) {
      throw new ValidationError('Missing required fields', { missing });
    }

    // Update artist profile fields
    const profileData: ProfileUpdateData = {
      full_name:       data.full_name       ?? null,
      display_name:    data.display_name    ?? null,
      city:            data.city            ?? null,
      locality:        data.locality        ?? null,
      bio:             data.bio             ?? null,
      experience_years: data.experience_years ?? null,
    };
    await this.artistRepo.updateProfile(userId, profileData);

    // Update organization details
    const orgUpdateData: { name?: string; gstin?: string | null; address?: string | null } = {};
    if (isParlor) {
      orgUpdateData.name    = data.parlor_name!;
      orgUpdateData.gstin   = data.gstin!;
      orgUpdateData.address = data.address!;
    } else {
      // Solo: use full_name as org name
      orgUpdateData.name = data.full_name!;
    }
    await this.artistRepo.updateOrganization(profile.org_id, orgUpdateData);

    await this.artistRepo.advanceStep(userId, STEP.BASIC_INFO);

    return this.artistRepo.findByUserId(userId);
  }

  // ── 4. Upload Profile Image ─────────────────────────────────────────────
  async uploadProfileImage(userId: string, fileBuffer: Buffer) {
    const profile = await this.artistRepo.findByUserId(userId);
    if (!profile) throw new NotFoundError('Artist profile not found.');

    const imageMeta = await this.imageService.upload(fileBuffer, 'artist_profiles', 'profile');
    await this.artistRepo.setProfileImage(userId, imageMeta.id!);

    return imageMeta;
  }

  // ── STEP 3 RESERVED ─────────────────────────────────────────────────────
  // Service-adding will be implemented here (between basic_info and identity_verify)

  // ── 5. Submit Identity Verification (Step 4) ───────────────────────────
  /**
   * Sub-artists (role='member') are NOT allowed to submit identity verification.
   * This endpoint is for solo artists and parlor owners only.
   */
  async submitIdentityVerification(userId: string, data: {
    document_type: string;
    document_number: string;
    aadhaar_last4?: string;
  }, fileBuffer?: Buffer) {
    const profile = await this.artistRepo.findByUserId(userId);
    if (!profile) throw new NotFoundError('Artist profile not found.');

    // Sub-artists skip identity verification
    const isSub = await this.artistRepo.isSubArtist(userId);
    if (isSub) {
      throw new ForbiddenError('Sub-artists do not require identity verification.');
    }

    // Upload document image if provided
    if (fileBuffer) {
      await this.imageService.upload(fileBuffer, 'artist_documents', 'document');
    }

    // Derive last4 for Aadhaar
    const aadhaar_last4 =
      data.document_type === 'aadhaar'
        ? (data.aadhaar_last4 ?? data.document_number.slice(-4))
        : null;

    // Hash the document number for privacy
    const aadhaar_hash = crypto
      .createHash('sha256')
      .update(data.document_number)
      .digest('hex');

    await this.artistRepo.upsertVerification(userId, {
      kyc_status:    'pending',
      aadhaar_last4: aadhaar_last4,
      aadhaar_hash:  aadhaar_hash,
    });

    await this.artistRepo.advanceStep(userId, STEP.IDENTITY_VERIFY);

    return { success: true, message: 'Identity verification submitted. Pending review.' };
  }

  // ── 6. Add Portfolio Image (Step 5) ────────────────────────────────────
  async addPortfolioImage(userId: string, fileBuffer: Buffer, category: string) {
    const profile = await this.artistRepo.findByUserId(userId);
    if (!profile) throw new NotFoundError('Artist profile not found.');

    const imageMeta = await this.imageService.upload(fileBuffer, 'artist_portfolios', 'portfolio');
    const portfolioItem = await this.artistRepo.addPortfolioImage(userId, imageMeta.id!, category);

    // Track step 5 when first image is added
    const count = await this.artistRepo.countPortfolio(userId);
    if (count >= 1) {
      await this.artistRepo.advanceStep(userId, STEP.PORTFOLIO);
    }

    return portfolioItem;
  }

  // ── 7. Get Portfolio ────────────────────────────────────────────────────
  async getPortfolio(userId: string) {
    const profile = await this.artistRepo.findByUserId(userId);
    if (!profile) throw new NotFoundError('Artist profile not found.');
    return this.artistRepo.getPortfolio(userId);
  }

  // ── 8. Add Sub-Artist (Parlor only) ────────────────────────────────────
  /**
   * Only parlor org owners can call this.
   * Sub-artist must already have a user account.
   * Max 4 sub-artists per org.
   * Sub-artist's onboarding starts at step 2 (type_selection is skipped).
   */
  async addSubArtist(ownerUserId: string, targetUserId: string) {
    const ownerProfile = await this.artistRepo.findByUserId(ownerUserId);
    if (!ownerProfile)       throw new NotFoundError('Artist profile not found.');
    if (!ownerProfile.org_id) throw new BadRequestError('Organization not set. Complete onboarding step 1 first.');

    const org = await this.artistRepo.getOrganization(ownerProfile.org_id);
    if (!org) throw new NotFoundError('Organization not found.');

    if (org.org_type !== 'parlor') {
      throw new ForbiddenError('Only parlor organisations can add sub-artists.');
    }

    const subCount = await this.artistRepo.countOrgSubMembers(ownerProfile.org_id);
    if (subCount >= MAX_SUB_MEMBERS) {
      throw new ConflictError(`Maximum of ${MAX_SUB_MEMBERS} sub-artists allowed per organisation.`);
    }

    if (targetUserId === ownerUserId) {
      throw new BadRequestError('You cannot add yourself as a sub-artist.');
    }

    // Create or fetch target artist profile
    let targetProfile = await this.artistRepo.findByUserId(targetUserId);
    if (!targetProfile) {
      targetProfile = await this.artistRepo.createProfile(targetUserId);
      await this.artistRepo.initOnboardingSteps(targetUserId);
    }

    // Link sub-artist to this org
    await this.artistRepo.setOrgId(targetUserId, ownerProfile.org_id);
    await this.artistRepo.addOrgMember(ownerProfile.org_id, targetUserId, 'member');

    // Sub-artist skips step 1 (type selection) — mark it done automatically
    await this.artistRepo.advanceStep(targetUserId, STEP.TYPE_SELECTION);

    return this.artistRepo.findByUserId(targetUserId);
  }

  // ── 9. Get Sub-Artists ──────────────────────────────────────────────────
  async getSubArtists(ownerUserId: string) {
    const profile = await this.artistRepo.findByUserId(ownerUserId);
    if (!profile)        throw new NotFoundError('Artist profile not found.');
    if (!profile.org_id) throw new BadRequestError('Organization not set.');

    const org = await this.artistRepo.getOrganization(profile.org_id);
    if (org?.org_type !== 'parlor') {
      throw new ForbiddenError('Only parlor organisations have sub-artists.');
    }

    return this.artistRepo.getOrgMembers(profile.org_id);
  }

  // ── 10. Submit Onboarding ──────────────────────────────────────────────
  /**
   * Validates all requirements, then sets onboarding_status = 'pending_review'.
   * Validation rules differ by artist type (solo/parlor owner vs sub-artist).
   */
  async submitOnboarding(userId: string) {
    const profile = await this.artistRepo.findByUserId(userId);
    if (!profile) throw new NotFoundError('Artist profile not found.');

    if (profile.onboarding_status === 'pending_review') {
      throw new ConflictError('Onboarding already submitted and is pending review.');
    }
    if (profile.onboarding_status === 'approved') {
      throw new ConflictError('Artist is already approved.');
    }

    const isSub = await this.artistRepo.isSubArtist(userId);
    const org   = profile.org_id ? await this.artistRepo.getOrganization(profile.org_id) : null;

    const missing: string[] = [];

    // Common requirements for ALL artists
    if (!profile.full_name)       missing.push('full_name');
    if (!profile.city)            missing.push('city');
    if (!profile.locality)        missing.push('locality');
    if (!profile.profile_image_id) missing.push('profile_image_id');

    const portfolioCount = await this.artistRepo.countPortfolio(userId);
    if (portfolioCount < MIN_PORTFOLIO_IMAGES) {
      missing.push(`portfolio_images (have ${portfolioCount}, need ${MIN_PORTFOLIO_IMAGES})`);
    }

    // Parlor owner — additional organisation requirements
    if (!isSub && org?.org_type === 'parlor') {
      if (!org.gstin)   missing.push('org.gstin');
      if (!org.address) missing.push('org.address');
    }

    // Identity verification — required for solo + parlor owner; skipped for sub-artists
    if (!isSub) {
      const verification = await this.artistRepo.getVerification(userId);
      if (!verification || verification.kyc_status === 'not_started') {
        missing.push('identity_verification');
      }
    }

    if (missing.length > 0) {
      throw new ValidationError('Cannot submit onboarding. Missing requirements.', { missing });
    }

    await this.artistRepo.setOnboardingStatus(userId, 'pending_review');

    return {
      success: true,
      message: 'Onboarding submitted successfully. Your profile is pending review.',
    };
  }

  // ── 11. Get Onboarding Status ──────────────────────────────────────────
  async getOnboardingStatus(userId: string) {
    const profile = await this.artistRepo.findByUserId(userId);
    if (!profile) throw new NotFoundError('Artist profile not found.');

    const steps        = await this.artistRepo.getOnboardingSteps(userId);
    const isSub        = await this.artistRepo.isSubArtist(userId);
    const org          = profile.org_id ? await this.artistRepo.getOrganization(profile.org_id) : null;
    const verification = await this.artistRepo.getVerification(userId);
    const portfolioCount = await this.artistRepo.countPortfolio(userId);

    const missing: string[] = [];

    if (!profile.full_name)        missing.push('full_name');
    if (!profile.city)             missing.push('city');
    if (!profile.locality)         missing.push('locality');
    if (!profile.profile_image_id) missing.push('profile_image_id');

    if (portfolioCount < MIN_PORTFOLIO_IMAGES) {
      missing.push(`portfolio_images (${portfolioCount}/${MIN_PORTFOLIO_IMAGES})`);
    }

    if (!isSub && org?.org_type === 'parlor') {
      if (!org.gstin)   missing.push('org.gstin');
      if (!org.address) missing.push('org.address');
    }

    if (!isSub && (!verification || verification.kyc_status === 'not_started')) {
      missing.push('identity_verification');
    }

    return {
      onboardingStatus: profile.onboarding_status,
      orgType:          org?.org_type ?? null,
      isSubArtist:      isSub,
      steps:            steps ?? null,
      missingRequirements: missing,
      readyToSubmit:    missing.length === 0 && profile.onboarding_status === 'draft',
    };
  }
}
