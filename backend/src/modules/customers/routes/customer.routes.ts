import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { requireAuth } from '../../../middlewares/requireAuth';
import { requirePermission } from '../../../middlewares/requirePermission';

const router = Router();

router.use(requireAuth);

router.get('/', requirePermission('customers.view'), CustomerController.getCustomers);
router.get('/:id', requirePermission('customers.view'), CustomerController.getCustomerById);
router.patch('/:id', requirePermission('customers.edit'), CustomerController.updateCustomer);

export default router;
