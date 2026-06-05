import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { requireAuth } from '../../../middlewares/requireAuth';
import { requirePermission } from '../../../middlewares/requirePermission';

const router = Router();

router.use(requireAuth);

router.post('/bulk-status-update', requirePermission('orders.manage'), OrderController.bulkStatusUpdate);

router.post('/', requirePermission('orders.create'), OrderController.createOrder);
router.get('/', requirePermission('orders.view'), OrderController.getOrders);
router.get('/:id', requirePermission('orders.view'), OrderController.getOrderById);
router.patch('/:id', requirePermission('orders.manage'), OrderController.updateOrderStatus);

export default router;
