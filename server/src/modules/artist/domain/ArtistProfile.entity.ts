// ── Raw DB row (as returned by SQL queries) ───────────────────────────────
export interface ArtistProfileRow {
  artist_id: string;
  org_id: string | null;
  full_name: string | null;
  display_name: string | null;
  city: string | null;
  locality: string | null;
  profile_image_id: string | null;
  bio: string | null;
  experience_years: number | null;
  rating: number;
  total_reviews: number;
  service_radius_km: number;
  onboarding_status: string;
  verification_tier: string;
  risk_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Domain Entity ─────────────────────────────────────────────────────────
export class ArtistProfile {
  readonly artistId: string;
  readonly orgId: string | null;
  readonly fullName: string | null;
  readonly displayName: string | null;
  readonly city: string | null;
  readonly locality: string | null;
  readonly profileImageId: string | null;
  readonly bio: string | null;
  readonly experienceYears: number | null;
  readonly rating: number;
  readonly totalReviews: number;
  readonly serviceRadiusKm: number;
  readonly onboardingStatus: string;
  readonly verificationTier: string;
  readonly riskScore: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(data: ArtistProfileRow) {
    this.artistId = data.artist_id;
    this.orgId = data.org_id;
    this.fullName = data.full_name;
    this.displayName = data.display_name;
    this.city = data.city;
    this.locality = data.locality;
    this.profileImageId = data.profile_image_id;
    this.bio = data.bio;
    this.experienceYears = data.experience_years;
    this.rating = data.rating;
    this.totalReviews = data.total_reviews;
    this.serviceRadiusKm = data.service_radius_km;
    this.onboardingStatus = data.onboarding_status;
    this.verificationTier = data.verification_tier;
    this.riskScore = data.risk_score;
    this.isActive = data.is_active;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
  }

  toPublicJSON() {
    return {
      artistId: this.artistId,
      orgId: this.orgId,
      fullName: this.fullName,
      displayName: this.displayName,
      city: this.city,
      locality: this.locality,
      profileImageId: this.profileImageId,
      bio: this.bio,
      experienceYears: this.experienceYears,
      rating: this.rating,
      totalReviews: this.totalReviews,
      serviceRadiusKm: this.serviceRadiusKm,
      onboardingStatus: this.onboardingStatus,
      verificationTier: this.verificationTier,
      isActive: this.isActive,
    };
  }
}
