import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { InventoryService } from '../services/inventory.service';
import { AuthService } from '../../auth/services/auth.service';
import { ApiResponse } from '../../../utils/ApiResponse';

const inventoryUpdateSchema = z.object({
  variantId: z.string(),
  warehouseLocation: z.enum(['Pune', 'Mumbai', 'Delhi']),
  quantityChange: z.number().min(0, 'Quantity change must be positive'),
  type: z.enum(['stock_in', 'stock_out', 'reserve', 'release', 'return', 'damage', 'adjustment']),
  referenceType: z.enum(['order', 'return', 'manual', 'adjustment']),
  referenceId: z.string().optional(),
  notes: z.string().optional(),
});

export class InventoryController {
  static async updateInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = inventoryUpdateSchema.parse(req.body);
      const userId = (req as any).user.id;
      
      const inventory = await InventoryService.updateInventory(
        data.variantId,
        data.warehouseLocation,
        data.quantityChange,
        data.type,
        data.referenceType,
        userId,
        data.referenceId,
        data.notes
      );

      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'UPDATE', 'INVENTORY', ip, `Updated inventory for variant ${data.variantId} at ${data.warehouseLocation}`);

      res.status(200).json(new ApiResponse('Inventory updated successfully', inventory));
    } catch (error) {
      next(error);
    }
  }

  static async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { variantId } = req.query;
      let result;
      
      if (variantId) {
        result = await InventoryService.getInventoryByVariant(variantId as string, req.query);
      } else {
        result = await InventoryService.getAllInventory(req.query);
      }
      
      res.status(200).json(new ApiResponse('Inventory retrieved successfully', result.data, result.pagination));
    } catch (error) {
      next(error);
    }
  }

  static async bulkUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { updates } = req.body;
      const userId = (req as any).user.id as string;
      
      const results = await InventoryService.bulkUpdate(updates, userId);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'UPDATE', 'INVENTORY', ip, `Bulk updated ${results.successful} inventory items`);

      res.status(200).json(new ApiResponse('Bulk operation completed', results));
    } catch (error) {
      next(error);
    }
  }
}
