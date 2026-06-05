import { Inventory } from '../models/Inventory.model';
import { InventoryTransaction } from '../models/InventoryTransaction.model';
import { AppError } from '../../../utils/AppError';
import { ApiFeatures } from '../../../utils/ApiFeatures';

export class InventoryService {
  static async updateInventory(
    variantId: string,
    warehouseLocation: 'Pune' | 'Mumbai' | 'Delhi',
    quantityChange: number,
    type: 'stock_in' | 'stock_out' | 'reserve' | 'release' | 'return' | 'damage' | 'adjustment',
    referenceType: 'order' | 'return' | 'manual' | 'adjustment',
    userId: string,
    referenceId?: string,
    notes?: string
  ) {
    // Upsert the inventory record
    let inventory = await Inventory.findOne({ variant: variantId, warehouseLocation });

    if (!inventory) {
      if (quantityChange < 0) throw new AppError('Cannot reduce inventory below 0', 400);
      inventory = await Inventory.create({
        variant: variantId,
        warehouseLocation,
        availableStock: 0,
        reservedStock: 0,
        damagedStock: 0,
        returnedStock: 0,
        reorderLevel: 5,
      });
    }

    const beforeQty = inventory.availableStock;
    let afterQty = beforeQty;

    switch (type) {
      case 'stock_in':
      case 'return':
      case 'adjustment':
        afterQty = beforeQty + quantityChange;
        inventory.availableStock = afterQty;
        break;
      case 'stock_out':
        afterQty = beforeQty - quantityChange;
        if (afterQty < 0) throw new AppError('Insufficient stock', 400);
        inventory.availableStock = afterQty;
        break;
      case 'reserve':
        if (inventory.availableStock < quantityChange) throw new AppError('Insufficient stock to reserve', 400);
        inventory.availableStock -= quantityChange;
        inventory.reservedStock += quantityChange;
        afterQty = inventory.availableStock;
        break;
      case 'release':
        if (inventory.reservedStock < quantityChange) throw new AppError('Insufficient reserved stock to release', 400);
        inventory.reservedStock -= quantityChange;
        inventory.availableStock += quantityChange;
        afterQty = inventory.availableStock;
        break;
      case 'damage':
        afterQty = beforeQty - quantityChange;
        if (afterQty < 0) throw new AppError('Insufficient stock', 400);
        inventory.availableStock = afterQty;
        inventory.damagedStock += quantityChange;
        break;
    }

    await inventory.save();

    // Create the mandatory InventoryTransaction record
    await InventoryTransaction.create({
      variantId,
      warehouseId: inventory._id, // Just using the inventory ID as location context for now
      type,
      quantity: quantityChange,
      beforeQty,
      afterQty,
      referenceType,
      ...(referenceId && { referenceId }),
      changedBy: userId,
      ...(notes && { notes }),
    });

    return inventory;
  }

  static async getInventoryByVariant(variantId: string, queryString: any) {
    const features = new ApiFeatures(Inventory.find({ variant: variantId }), queryString)
      .filter()
      .sort()
      .limitFields();
      
    await features.paginate(Inventory);
    const data = await features.query.lean();
    return { data, pagination: features.paginationData };
  }

  static async getAllInventory(queryString: any) {
    const features = new ApiFeatures(Inventory.find().populate('variant'), queryString)
      .filter()
      .sort()
      .limitFields();
      
    await features.paginate(Inventory);
    const data = await features.query.lean();
    return { data, pagination: features.paginationData };
  }

  static async bulkUpdate(updates: any[], userId: string) {
    const results = { processed: 0, successful: 0, failed: 0, failures: [] as any[] };
    
    for (const update of updates) {
      results.processed++;
      try {
        await this.updateInventory(
          update.variantId,
          update.warehouseLocation,
          update.quantityChange,
          update.type,
          update.referenceType,
          userId,
          update.referenceId,
          update.notes
        );
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.failures.push({ variantId: update.variantId, reason: error.message });
      }
    }
    
    return results;
  }
}
