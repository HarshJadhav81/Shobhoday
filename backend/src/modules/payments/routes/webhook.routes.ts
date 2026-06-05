import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router = Router();

/**
 * @openapi
 * /api/webhooks/razorpay:
 *   post:
 *     summary: Razorpay webhook listener
 *     tags: [Webhooks]
 */
router.post('/razorpay', WebhookController.handleRazorpayWebhook);

export default router;
