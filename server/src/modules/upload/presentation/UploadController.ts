import { Request, Response } from 'express';
import { ImageService } from '../application/ImageService';

export class UploadController {
  constructor(private readonly imageService: ImageService) {}

  uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file provided.' });
        return;
      }

      const folder = (req.body.folder as string) || 'a2z_uploads';
      const image = await this.imageService.upload(req.file.buffer, folder);

      res.status(201).json({ success: true, data: image });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.imageService.delete(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };
}
