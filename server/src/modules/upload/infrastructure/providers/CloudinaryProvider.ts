import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { ImageStorageProvider } from '../../application/interfaces/ImageStorageProvider';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryProvider implements ImageStorageProvider {
  async upload(file: Buffer, options?: any): Promise<{ url: string; id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: options?.folder || 'a2z_uploads' },
        (error, result) => {
          if (error) {
            return reject(new Error(`Cloudinary upload failed: ${error.message}`));
          }
          if (!result) {
            return reject(new Error('Cloudinary upload failed: No result returned'));
          }
          resolve({
            url: result.secure_url,
            id: result.public_id,
          });
        }
      );

      streamifier.createReadStream(file).pipe(uploadStream);
    });
  }

  async delete(fileId: string): Promise<void> {
    const result = await cloudinary.uploader.destroy(fileId);
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Cloudinary delete failed: ${result.result}`);
    }
  }

  getUrl(fileId: string): string {
    return cloudinary.url(fileId, { secure: true });
  }
}
