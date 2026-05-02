/**
 * Upload Module — Public API
 */

// Interfaces
export type { ImageStorageProvider } from './application/interfaces/ImageStorageProvider';
export type { IImageRepository, ImageMetadata } from './application/interfaces/IImageRepository';

// Infrastructure
export { StorageFactory } from './infrastructure/StorageFactory';
export { ImageRepository } from './infrastructure/ImageRepository';

// Application
export { ImageService } from './application/ImageService';

// Presentation
export { UploadController } from './presentation/UploadController';
export { createUploadRoutes } from './presentation/upload.routes';
