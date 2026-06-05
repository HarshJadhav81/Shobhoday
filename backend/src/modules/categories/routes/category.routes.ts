import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { requireAuth } from '../../../middlewares/requireAuth';
import { requirePermission } from '../../../middlewares/requirePermission';

const router = Router();

router.post('/bulk-delete', requireAuth, requirePermission('categories.delete'), CategoryController.bulkDelete);

// PROTECTED ROUTES
router.post('/', requireAuth, requirePermission('categories.create'), CategoryController.createCategory);
router.patch('/:id', requireAuth, CategoryController.updateCategory);
router.delete('/:id', requireAuth, CategoryController.deleteCategory);

// PUBLIC ROUTES
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);

export default router;
