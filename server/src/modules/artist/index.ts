/**
 * Artist Module — Public API
 */

export { ArtistProfile } from './domain/ArtistProfile.entity';
export type { IArtistRepository } from './application/interfaces/IArtistRepository';
export { ArtistRepository } from './infrastructure/ArtistRepository';
export { ArtistService } from './application/ArtistService';
export { ArtistController } from './presentation/ArtistController';
export { createArtistRoutes } from './presentation/artist.routes';
