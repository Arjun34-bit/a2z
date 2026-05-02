export interface ImageMetadata {
  id?: string;
  url: string;
  provider: string;
  provider_file_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface IImageRepository {
  /**
   * Saves image metadata to the database.
   * @param metadata Image metadata to save.
   * @returns The saved image record.
   */
  save(metadata: ImageMetadata): Promise<ImageMetadata>;

  /**
   * Retrieves image metadata by its database ID.
   * @param id Database ID of the image.
   * @returns The image record, or null if not found.
   */
  findById(id: string): Promise<ImageMetadata | null>;

  /**
   * Deletes image metadata from the database.
   * @param id Database ID of the image.
   * @returns True if deleted, false otherwise.
   */
  delete(id: string): Promise<boolean>;
}
