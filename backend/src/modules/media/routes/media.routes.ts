import { Router } from 'express';
import { MediaController } from '../controllers/media.controller';
import { requireAuth } from '../../../middlewares/requireAuth';
import { requirePermission } from '../../../middlewares/requirePermission';
import { upload } from '../../../middlewares/upload';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/media/upload:
 *   post:
 *     summary: Upload a single media file
 *     tags: [Media]
 */
router.post(
  '/upload',
  requirePermission('media.create'),
  upload.single('file'),
  MediaController.upload
);

/**
 * @openapi
 * /api/media/bulk-upload:
 *   post:
 *     summary: Upload multiple media files concurrently
 *     tags: [Media]
 */
router.post(
  '/bulk-upload',
  requirePermission('media.create'),
  upload.array('files', 10), // Limit to 10 files
  MediaController.bulkUpload
);

/**
 * @openapi
 * /api/media:
 *   get:
 *     summary: Retrieve media library (paginated)
 *     tags: [Media]
 */
router.get(
  '/',
  requirePermission('media.view'),
  MediaController.getMediaList
);

/**
 * @openapi
 * /api/media/{id}:
 *   get:
 *     summary: Retrieve single media asset
 *     tags: [Media]
 */
router.get(
  '/:id',
  requirePermission('media.view'),
  MediaController.getMediaById
);

/**
 * @openapi
 * /api/media/{id}:
 *   delete:
 *     summary: Delete a media asset from cloud and database
 *     tags: [Media]
 */
router.delete(
  '/:id',
  requirePermission('media.delete'),
  MediaController.deleteMedia
);

export default router;
