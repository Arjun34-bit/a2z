import { ImageStorageProvider } from '../application/interfaces/ImageStorageProvider';
import { CloudinaryProvider } from './providers/CloudinaryProvider';
import { S3Provider } from './providers/S3Provider';
import dotenv from 'dotenv';

dotenv.config();

export class StorageFactory {
  static getProvider(): ImageStorageProvider {
    const storageType = process.env.STORAGE?.toLowerCase() || 'cloudinary';

    switch (storageType) {
      case 's3':
        return new S3Provider();
      case 'cloudinary':
        return new CloudinaryProvider();
      default:
        console.warn(`Unknown storage type "${storageType}", defaulting to Cloudinary`);
        return new CloudinaryProvider();
    }
  }
}
