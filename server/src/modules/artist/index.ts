/**
 * Artist Module — Public API
 */

// Domain
export { ArtistProfile } from './domain/ArtistProfile.entity';
export type { ArtistProfileRow } from './domain/ArtistProfile.entity';
export { Organization } from './domain/Organization.entity';
export type { OrganizationRow } from './domain/Organization.entity';
export { ArtistOnboardingStep } from './domain/ArtistOnboardingStep.entity';
export type { StepRow } from './domain/ArtistOnboardingStep.entity';

// Application
export type { IArtistRepository } from './application/interfaces/IArtistRepository';
export { ArtistService } from './application/ArtistService';

// Infrastructure
export { ArtistRepository } from './infrastructure/ArtistRepository';

// Presentation
export { ArtistController } from './presentation/ArtistController';
export { createArtistRoutes } from './presentation/artist.routes';
