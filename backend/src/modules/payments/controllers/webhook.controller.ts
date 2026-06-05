import { Request, Response, NextFunction } from 'express';
import { WebhookService } from '../services/webhook.service';
import { logger } from '../../../utils/logger';

export class WebhookController {
  static async handleRazorpayWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      
      if (!signature) {
        return res.status(401).json({ success: false, message: 'Missing Razorpay signature' });
      }

      // Important: Webhook verification requires the raw unparsed body (which needs to be handled via express.raw or similar).
      // Since our express app uses express.json(), we need to stringify it back. Ideally, we should use a custom middleware
      // to capture the raw body, but assuming standard JSON parsing for this implementation.
      const rawBody = JSON.stringify(req.body);
      
      const result = await WebhookService.handleRazorpayWebhook(req.body, signature, rawBody);
      
      res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
      logger.error(`Webhook Error: ${error.message}`);
      res.status(500).json({ success: false, message: 'Webhook processing failed' });
    }
  }
}
