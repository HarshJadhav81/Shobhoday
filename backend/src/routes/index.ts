import { Router } from 'express';
import authRoutes from '../modules/auth/routes/auth.routes';
import categoryRoutes from '../modules/categories/routes/category.routes';
import productRoutes from '../modules/products/routes/product.routes';
import inventoryRoutes from '../modules/inventory/routes/inventory.routes';
import customerRoutes from '../modules/customers/routes/customer.routes';
import couponRoutes from '../modules/coupons/routes/coupon.routes';
import reviewRoutes from '../modules/reviews/routes/review.routes';
import orderRoutes from '../modules/orders/routes/order.routes';
import paymentRoutes from '../modules/payments/routes/payment.routes';
import webhookRoutes from '../modules/payments/routes/webhook.routes';
import mediaRoutes from '../modules/media/routes/media.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/customers', customerRoutes);
router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/media', mediaRoutes);

export default router;
