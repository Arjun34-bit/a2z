import { ImageStorageProvider } from './interfaces/ImageStorageProvider';
import { IImageRepository, ImageMetadata } from './interfaces/IImageRepository';

export class ImageService {
  constructor(
    private readonly storageProvider: ImageStorageProvider,
    private readonly imageRepository: IImageRepository
  ) {}

  /**
   * Uploads an image to the storage provider and saves its metadata in the database.
   * @param fileBuffer The image file buffer.
   * @param folder Optional folder name in the storage provider.
   * @returns The saved image metadata.
   */
  async upload(fileBuffer: Buffer, folder?: string): Promise<ImageMetadata> {
    // 1. Upload to storage provider
    const { url, id: provider_file_id } = await this.storageProvider.upload(fileBuffer, { folder });

    // 2. Determine provider name (e.g. from class name or env)
    const providerName = process.env.STORAGE?.toLowerCase() || 'cloudinary';

    // 3. Save metadata to DB
    const imageMetadata: ImageMetadata = {
      url,
      provider: providerName,
      provider_file_id,
    };

    return this.imageRepository.save(imageMetadata);
  }

  /**
   * Deletes an image from the storage provider and removes its metadata from the database.
   * @param id Database ID of the image.
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    // 1. Find image in DB
    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new Error('Image not found.');
    }

    // 2. Delete from storage provider
    await this.storageProvider.delete(image.provider_file_id);

    // 3. Delete from DB
    await this.imageRepository.delete(id);

    return { success: true, message: 'Image deleted successfully.' };
  }
}
