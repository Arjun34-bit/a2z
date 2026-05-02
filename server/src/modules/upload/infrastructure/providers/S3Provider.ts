import { ImageStorageProvider } from '../../application/interfaces/ImageStorageProvider';

export class S3Provider implements ImageStorageProvider {
  async upload(file: Buffer, options?: any): Promise<{ url: string; id: string }> {
    // Structural stub for S3 implementation
    throw new Error('S3Provider.upload not implemented yet.');
  }

  async delete(fileId: string): Promise<void> {
    // Structural stub for S3 implementation
    throw new Error('S3Provider.delete not implemented yet.');
  }

  getUrl(fileId: string): string {
    // Structural stub for S3 implementation
    throw new Error('S3Provider.getUrl not implemented yet.');
  }
}
