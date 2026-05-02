export interface ImageStorageProvider {
  /**
   * Uploads a file buffer to the storage provider.
   * @param file The file buffer to upload.
   * @param options Optional provider-specific options.
   * @returns An object containing the public URL and the provider's file ID.
   */
  upload(file: Buffer, options?: any): Promise<{ url: string; id: string }>;

  /**
   * Deletes a file from the storage provider using its ID.
   * @param fileId The provider-specific file ID.
   */
  delete(fileId: string): Promise<void>;

  /**
   * Generates a public URL for a given file ID.
   * @param fileId The provider-specific file ID.
   */
  getUrl(fileId: string): string;
}
