import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { requireAuth } from '../../../middlewares/requireAuth';
import { requirePermission } from '../../../middlewares/requirePermission';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/payments/create-order:
 *   post:
 *     summary: Create a new payment order with the gateway
 *     tags: [Payments]
 */
router.post('/create-order', requirePermission('orders.create'), PaymentController.createOrder);

/**
 * @openapi
 * /api/payments/verify:
 *   post:
 *     summary: Verify a payment signature from client
 *     tags: [Payments]
 */
router.post('/verify', requirePermission('orders.create'), PaymentController.verifyPayment);

/**
 * @openapi
 * /api/payments/refund:
 *   post:
 *     summary: Issue a full or partial refund
 *     tags: [Payments]
 */
router.post('/refund', requirePermission('orders.manage'), PaymentController.refundPayment);

/**
 * @openapi
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by internal payment ID
 *     tags: [Payments]
 */
router.get('/:id', requirePermission('orders.view'), PaymentController.getPaymentById);

/**
 * @openapi
 * /api/payments/order/{orderId}:
 *   get:
 *     summary: Get payment by associated order ID
 *     tags: [Payments]
 */
router.get('/order/:orderId', requirePermission('orders.view'), PaymentController.getPaymentByOrderId);

export default router;
