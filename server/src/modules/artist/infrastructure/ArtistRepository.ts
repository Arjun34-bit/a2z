import { Sequelize, QueryTypes } from 'sequelize';
import {
  IArtistRepository,
  ProfileUpdateData,
  CreateOrgData,
  UpdateOrgData,
  VerificationUpdateData,
  PortfolioRow,
  OrgMemberRow,
  VerificationRow,
} from '../application/interfaces/IArtistRepository';
import { ArtistProfileRow } from '../domain/ArtistProfile.entity';
import { OrganizationRow } from '../domain/Organization.entity';
import { StepRow } from '../domain/ArtistOnboardingStep.entity';

export class ArtistRepository implements IArtistRepository {
  constructor(private readonly db: Sequelize) {}

  // ─── Artist Profile ────────────────────────────────────────────────────

  async createProfile(userId: string): Promise<ArtistProfileRow> {
    const results: any[] = await this.db.query(
      `INSERT INTO app.artist_profiles (artist_id, onboarding_status, created_at, updated_at)
       VALUES (:userId, 'draft', NOW(), NOW())
       ON CONFLICT (artist_id) DO UPDATE SET updated_at = app.artist_profiles.updated_at
       RETURNING *`,
      { replacements: { userId }, type: QueryTypes.INSERT }
    );
    return (results as any)[0][0];
  }

  async findByUserId(userId: string): Promise<ArtistProfileRow | null> {
    const results: any[] = await this.db.query(
      `SELECT * FROM app.artist_profiles WHERE artist_id = :userId LIMIT 1`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? results[0] : null;
  }

  async updateProfile(userId: string, data: ProfileUpdateData): Promise<void> {
    const fields: string[] = [];
    const replacements: Record<string, any> = { userId };

    if (data.full_name !== undefined)      { fields.push('full_name = :full_name');           replacements.full_name = data.full_name; }
    if (data.display_name !== undefined)   { fields.push('display_name = :display_name');     replacements.display_name = data.display_name; }
    if (data.city !== undefined)           { fields.push('city = :city');                     replacements.city = data.city; }
    if (data.locality !== undefined)       { fields.push('locality = :locality');             replacements.locality = data.locality; }
    if (data.bio !== undefined)            { fields.push('bio = :bio');                       replacements.bio = data.bio; }
    if (data.experience_years !== undefined) { fields.push('experience_years = :experience_years'); replacements.experience_years = data.experience_years; }

    if (fields.length === 0) return;
    fields.push('updated_at = NOW()');

    await this.db.query(
      `UPDATE app.artist_profiles SET ${fields.join(', ')} WHERE artist_id = :userId`,
      { replacements, type: QueryTypes.UPDATE }
    );
  }

  async setProfileImage(userId: string, imageId: string): Promise<void> {
    await this.db.query(
      `UPDATE app.artist_profiles SET profile_image_id = :imageId, updated_at = NOW() WHERE artist_id = :userId`,
      { replacements: { userId, imageId }, type: QueryTypes.UPDATE }
    );
  }

  async setOrgId(userId: string, orgId: string): Promise<void> {
    await this.db.query(
      `UPDATE app.artist_profiles SET org_id = :orgId, updated_at = NOW() WHERE artist_id = :userId`,
      { replacements: { userId, orgId }, type: QueryTypes.UPDATE }
    );
  }

  async setOnboardingStatus(userId: string, status: string): Promise<void> {
    await this.db.query(
      `UPDATE app.artist_profiles SET onboarding_status = :status, updated_at = NOW() WHERE artist_id = :userId`,
      { replacements: { userId, status }, type: QueryTypes.UPDATE }
    );
  }

  // ─── Organization ──────────────────────────────────────────────────────

  async createOrganization(data: CreateOrgData): Promise<OrganizationRow> {
    const results: any[] = await this.db.query(
      `INSERT INTO app.organizations (name, org_type, gstin, address, owner_user_id, is_active, created_at)
       VALUES (:name, :org_type, :gstin, :address, :owner_user_id, true, NOW())
       RETURNING *`,
      {
        replacements: {
          name: data.name,
          org_type: data.org_type,
          gstin: data.gstin || null,
          address: data.address || null,
          owner_user_id: data.owner_user_id,
        },
        type: QueryTypes.INSERT,
      }
    );
    return (results as any)[0][0];
  }

  async updateOrganization(orgId: string, data: UpdateOrgData): Promise<void> {
    const fields: string[] = [];
    const replacements: Record<string, any> = { orgId };

    if (data.name !== undefined)    { fields.push('name = :name');     replacements.name = data.name; }
    if (data.gstin !== undefined)   { fields.push('gstin = :gstin');   replacements.gstin = data.gstin; }
    if (data.address !== undefined) { fields.push('address = :address'); replacements.address = data.address; }

    if (fields.length === 0) return;

    await this.db.query(
      `UPDATE app.organizations SET ${fields.join(', ')} WHERE org_id = :orgId`,
      { replacements, type: QueryTypes.UPDATE }
    );
  }

  async addOrgMember(orgId: string, userId: string, role: string): Promise<void> {
    await this.db.query(
      `INSERT INTO app.organization_members (org_id, user_id, role)
       VALUES (:orgId, :userId, :role)
       ON CONFLICT (org_id, user_id) DO NOTHING`,
      { replacements: { orgId, userId, role }, type: QueryTypes.INSERT }
    );
  }

  async getOrganization(orgId: string): Promise<OrganizationRow | null> {
    const results: any[] = await this.db.query(
      `SELECT * FROM app.organizations WHERE org_id = :orgId LIMIT 1`,
      { replacements: { orgId }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? results[0] : null;
  }

  async getOrgByOwnerId(ownerUserId: string): Promise<OrganizationRow | null> {
    const results: any[] = await this.db.query(
      `SELECT * FROM app.organizations WHERE owner_user_id = :ownerUserId LIMIT 1`,
      { replacements: { ownerUserId }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? results[0] : null;
  }

  async countOrgSubMembers(orgId: string): Promise<number> {
    const results: any[] = await this.db.query(
      `SELECT COUNT(*) AS cnt FROM app.organization_members WHERE org_id = :orgId AND role = 'member'`,
      { replacements: { orgId }, type: QueryTypes.SELECT }
    );
    return parseInt(results[0]?.cnt ?? '0', 10);
  }

  async getOrgMembers(orgId: string): Promise<OrgMemberRow[]> {
    return this.db.query(
      `SELECT om.org_id, om.user_id, om.role,
              ap.full_name, ap.profile_image_id, ap.onboarding_status
       FROM app.organization_members om
       LEFT JOIN app.artist_profiles ap ON om.user_id = ap.artist_id
       WHERE om.org_id = :orgId
       ORDER BY CASE WHEN om.role = 'owner' THEN 0 ELSE 1 END`,
      { replacements: { orgId }, type: QueryTypes.SELECT }
    ) as unknown as OrgMemberRow[];
  }

  async isOrgOwner(userId: string): Promise<boolean> {
    const results: any[] = await this.db.query(
      `SELECT 1 FROM app.organization_members WHERE user_id = :userId AND role = 'owner' LIMIT 1`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );
    return results.length > 0;
  }

  async isSubArtist(userId: string): Promise<boolean> {
    const results: any[] = await this.db.query(
      `SELECT 1 FROM app.organization_members WHERE user_id = :userId AND role = 'member' LIMIT 1`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );
    return results.length > 0;
  }

  // ─── Onboarding Steps ─────────────────────────────────────────────────

  async initOnboardingSteps(artistId: string): Promise<void> {
    await this.db.query(
      `INSERT INTO app.artist_onboarding_steps (artist_id, current_step, steps_completed, last_saved_at)
       VALUES (:artistId, 1, '{}', NOW())
       ON CONFLICT (artist_id) DO NOTHING`,
      { replacements: { artistId }, type: QueryTypes.INSERT }
    );
  }

  async getOnboardingSteps(artistId: string): Promise<StepRow | null> {
    const results: any[] = await this.db.query(
      `SELECT * FROM app.artist_onboarding_steps WHERE artist_id = :artistId LIMIT 1`,
      { replacements: { artistId }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? results[0] : null;
  }

  async advanceStep(artistId: string, step: number): Promise<void> {
    await this.db.query(
      `UPDATE app.artist_onboarding_steps
       SET
         current_step    = GREATEST(current_step, :step),
         steps_completed = CASE
           WHEN :step = ANY(steps_completed) THEN steps_completed
           ELSE array_append(steps_completed, :step)
         END,
         last_saved_at   = NOW()
       WHERE artist_id = :artistId`,
      { replacements: { artistId, step }, type: QueryTypes.UPDATE }
    );
  }

  // ─── Identity Verification ────────────────────────────────────────────

  async upsertVerification(artistId: string, data: VerificationUpdateData): Promise<void> {
    await this.db.query(
      `INSERT INTO app.artist_verification (artist_id, kyc_status, aadhaar_last4, aadhaar_hash)
       VALUES (:artistId, :kyc_status, :aadhaar_last4, :aadhaar_hash)
       ON CONFLICT (artist_id) DO UPDATE SET
         kyc_status    = EXCLUDED.kyc_status,
         aadhaar_last4 = COALESCE(EXCLUDED.aadhaar_last4, app.artist_verification.aadhaar_last4),
         aadhaar_hash  = COALESCE(EXCLUDED.aadhaar_hash,  app.artist_verification.aadhaar_hash)`,
      {
        replacements: {
          artistId,
          kyc_status:    data.kyc_status   ?? 'pending',
          aadhaar_last4: data.aadhaar_last4 ?? null,
          aadhaar_hash:  data.aadhaar_hash  ?? null,
        },
        type: QueryTypes.INSERT,
      }
    );
  }

  async getVerification(artistId: string): Promise<VerificationRow | null> {
    const results: any[] = await this.db.query(
      `SELECT artist_id, aadhaar_last4, kyc_status, bank_verified
       FROM app.artist_verification WHERE artist_id = :artistId LIMIT 1`,
      { replacements: { artistId }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? results[0] : null;
  }

  // ─── Portfolio ────────────────────────────────────────────────────────

  async addPortfolioImage(artistId: string, imageId: string, category: string): Promise<PortfolioRow> {
    const results: any[] = await this.db.query(
      `INSERT INTO app.artist_portfolios (artist_id, image_id, category, created_at, updated_at)
       VALUES (:artistId, :imageId, :category, NOW(), NOW())
       RETURNING *`,
      { replacements: { artistId, imageId, category }, type: QueryTypes.INSERT }
    );
    const row = (results as any)[0][0];
    // Join image URL for the response
    const imgResults: any[] = await this.db.query(
      `SELECT url FROM app.images WHERE id = :imageId LIMIT 1`,
      { replacements: { imageId }, type: QueryTypes.SELECT }
    );
    return { ...row, image_url: imgResults[0]?.url ?? '' };
  }

  async getPortfolio(artistId: string): Promise<PortfolioRow[]> {
    return this.db.query(
      `SELECT ap.*, i.url AS image_url
       FROM app.artist_portfolios ap
       JOIN app.images i ON ap.image_id = i.id
       WHERE ap.artist_id = :artistId AND ap.is_active = true
       ORDER BY ap.sort_order ASC, ap.created_at DESC`,
      { replacements: { artistId }, type: QueryTypes.SELECT }
    ) as unknown as PortfolioRow[];
  }

  async countPortfolio(artistId: string): Promise<number> {
    const results: any[] = await this.db.query(
      `SELECT COUNT(*) AS cnt FROM app.artist_portfolios
       WHERE artist_id = :artistId AND is_active = true`,
      { replacements: { artistId }, type: QueryTypes.SELECT }
    );
    return parseInt(results[0]?.cnt ?? '0', 10);
  }
}
