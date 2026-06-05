import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller';
import { requireAuth } from '../../../middlewares/requireAuth';
import { requirePermission } from '../../../middlewares/requirePermission';

const router = Router();

router.use(requireAuth);

router.post('/', requirePermission('coupons.manage'), CouponController.createCoupon);
router.get('/', requirePermission('coupons.manage'), CouponController.getCoupons);
router.patch('/:id', requirePermission('coupons.manage'), CouponController.updateCoupon);
router.delete('/:id', requirePermission('coupons.manage'), CouponController.deleteCoupon);

export default router;
