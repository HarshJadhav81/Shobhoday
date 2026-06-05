import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { requireAuth } from '../../../middlewares/requireAuth';
import { requirePermission } from '../../../middlewares/requirePermission';

const router = Router();

router.use(requireAuth);

router.post('/', requirePermission('reviews.moderate'), ReviewController.createReview);
router.get('/', requirePermission('reviews.moderate'), ReviewController.getReviews);
router.patch('/:id', requirePermission('reviews.moderate'), ReviewController.updateReview);

export default router;
