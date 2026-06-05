import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../../../config/cloudinary';
import { Media } from '../models/Media.model';
import { AppError } from '../../../utils/AppError';
import { ApiFeatures } from '../../../utils/ApiFeatures';

export class MediaService {
  /**
   * Helper to upload a buffer stream to Cloudinary
   */
  private static uploadStream(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          if (result) return resolve(result);
          reject(new Error('Unknown error during upload'));
        }
      );
      upload.end(buffer);
    });
  }

  static async uploadMedia(file: Express.Multer.File, folder: 'products' | 'variants' | 'categories' | 'banners' | 'blogs' | 'users', uploadedBy: string, altText?: string) {
    try {
      const result = await this.uploadStream(file.buffer, folder);

      const media = await Media.create({
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        folder,
        mediaType: result.resource_type,
        width: result.width as number,
        height: result.height as number,
        size: result.bytes,
        altText: altText as string,
        uploadedBy
      });

      return media;
    } catch (error: any) {
      throw new AppError(`Media upload failed: ${error.message}`, 500);
    }
  }

  static async bulkUpload(files: Express.Multer.File[], folder: 'products' | 'variants' | 'categories' | 'banners' | 'blogs' | 'users', uploadedBy: string) {
    const uploadPromises = files.map(file => this.uploadMedia(file, folder, uploadedBy));
    const results = await Promise.allSettled(uploadPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').map((r: any) => r.value);
    const failed = results.filter(r => r.status === 'rejected').map((r: any) => r.reason.message);
    
    return {
      processed: files.length,
      successful: successful.length,
      failed: failed.length,
      media: successful,
      errors: failed
    };
  }

  static async getMediaList(queryString: any) {
    const features = new ApiFeatures(Media.find({ isDeleted: false }), queryString)
      .filter()
      .sort()
      .limitFields();
      
    await features.paginate(Media);
    const data = await features.query.lean();
    
    return { data, pagination: features.paginationData };
  }

  static async getMediaById(id: string) {
    const media = await Media.findOne({ _id: id, isDeleted: false });
    if (!media) throw new AppError('Media not found', 404);
    return media;
  }

  static async deleteMedia(id: string) {
    const media = await Media.findOne({ _id: id, isDeleted: false });
    if (!media) throw new AppError('Media not found', 404);

    try {
      // Destroy physically in Cloudinary
      await cloudinary.uploader.destroy(media.publicId);
      
      // Remove or mark as deleted in DB
      media.isDeleted = true;
      await media.save();
      
      return media;
    } catch (error: any) {
      throw new AppError(`Failed to delete media: ${error.message}`, 500);
    }
  }
}
