import { Request, Response, NextFunction } from 'express';
import { MediaService } from '../services/media.service';
import { ApiResponse } from '../../../utils/ApiResponse';
import { AuthService } from '../../auth/services/auth.service';
import { AppError } from '../../../utils/AppError';

export class MediaController {
  static async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new AppError('No file provided', 400);
      
      const { folder, altText } = req.body;
      if (!folder) throw new AppError('Folder is required', 400);

      const userId = (req as any).user.id as string;
      const media = await MediaService.uploadMedia(req.file, folder, userId, altText);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'CREATE', 'MEDIA', ip, `Uploaded media to ${folder}`);

      res.status(201).json(new ApiResponse('Media uploaded successfully', media));
    } catch (error) {
      next(error);
    }
  }

  static async bulkUpload(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) throw new AppError('No files provided', 400);
      
      const { folder } = req.body;
      if (!folder) throw new AppError('Folder is required', 400);

      const userId = (req as any).user.id as string;
      const result = await MediaService.bulkUpload(files, folder, userId);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'CREATE', 'MEDIA', ip, `Bulk uploaded ${result.successful} media files to ${folder}`);

      res.status(201).json(new ApiResponse('Bulk upload completed', result));
    } catch (error) {
      next(error);
    }
  }

  static async getMediaList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await MediaService.getMediaList(req.query);
      res.status(200).json(new ApiResponse('Media retrieved successfully', result.data, result.pagination));
    } catch (error) {
      next(error);
    }
  }

  static async getMediaById(req: Request, res: Response, next: NextFunction) {
    try {
      const media = await MediaService.getMediaById(req.params.id as string);
      res.status(200).json(new ApiResponse('Media retrieved successfully', media));
    } catch (error) {
      next(error);
    }
  }

  static async deleteMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id as string;
      const media = await MediaService.deleteMedia(req.params.id as string);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'DELETE', 'MEDIA', ip, `Deleted media ${media.publicId}`);

      res.status(200).json(new ApiResponse('Media deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
