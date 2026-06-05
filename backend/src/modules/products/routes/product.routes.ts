import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { requireAuth } from '../../../middlewares/requireAuth';
import { requirePermission } from '../../../middlewares/requirePermission';

const router = Router();

router.post('/bulk-publish', requireAuth, requirePermission('products.edit'), ProductController.bulkPublish);
router.post('/bulk-delete', requireAuth, requirePermission('products.delete'), ProductController.bulkDelete);

// PUBLIC ROUTES
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

// PROTECTED ROUTES
router.post('/', requireAuth, requirePermission('products.create'), ProductController.createProduct);
router.patch('/:id', requireAuth, requirePermission('products.edit'), ProductController.updateProduct);
router.delete('/:id', requireAuth, requirePermission('products.delete'), ProductController.deleteProduct);

export default router;
