import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { requireAuth } from '../../../middlewares/requireAuth';
import { requirePermission } from '../../../middlewares/requirePermission';

const router = Router();

router.use(requireAuth);

router.post('/bulk-update', requirePermission('inventory.update'), InventoryController.bulkUpdate);

router.get('/', requirePermission('inventory.view'), InventoryController.getInventory);
router.post('/', requirePermission('inventory.update'), InventoryController.updateInventory);

export default router;
