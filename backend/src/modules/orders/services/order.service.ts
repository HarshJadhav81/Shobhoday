import mongoose from 'mongoose';
import { Order } from '../models/Order.model';
import { OrderItem } from '../models/OrderItem.model';
import { ProductVariant } from '../../products/models/ProductVariant.model';
import { Product } from '../../products/models/Product.model';
import { Inventory } from '../../inventory/models/Inventory.model';
import { InventoryTransaction } from '../../inventory/models/InventoryTransaction.model';
import { AppError } from '../../../utils/AppError';
import { ApiFeatures } from '../../../utils/ApiFeatures';

const validTransitions: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled', 'payment_failed'],
  confirmed: ['processing', 'cancelled'],
  processing: ['packed'],
  packed: ['shipped'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'],
  returned: ['refunded'],
  cancelled: [],
  refunded: [],
};

export class OrderService {
  static async createOrder(orderData: any, itemsData: any[], userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Calculate totals and Validate Inventory
      let subTotal = 0;
      let taxTotal = 0;
      const orderItemsPayload = [];
      const inventoryUpdates = [];

      for (const item of itemsData) {
        const variant = await ProductVariant.findById(item.variantId).session(session);
        if (!variant) throw new AppError(`Variant ${item.variantId} not found`, 404);

        const product = await Product.findById(variant.product).session(session);
        if (!product) throw new AppError(`Product ${variant.product} not found`, 404);

        // Fetch Inventory (assuming default warehouse for simplicity if not provided)
        // Usually, order routing decides warehouse. We will pick the first one with enough stock.
        const inventory = await Inventory.findOne({ variant: variant._id }).sort({ availableStock: -1 }).session(session);
        
        if (!inventory || inventory.availableStock < item.quantity) {
          throw new AppError(`Insufficient stock for ${product.title} (${variant.sku}). Available: ${inventory ? inventory.availableStock : 0}`, 400);
        }

        // Snapshot calculations
        const itemTotal = variant.price * item.quantity;
        const taxAmount = itemTotal * (variant.gstPercentage / 100);
        
        subTotal += itemTotal;
        taxTotal += taxAmount;

        orderItemsPayload.push({
          product: product._id,
          variant: variant._id,
          productName: product.title,
          sku: variant.sku,
          quantity: item.quantity,
          price: variant.price,
          costPrice: variant.costPrice,
          gstPercentage: variant.gstPercentage,
          taxAmount,
          discountAmount: 0,
          total: itemTotal + taxAmount,
        });

        inventoryUpdates.push({
          inventory,
          variantId: variant._id,
          quantity: item.quantity,
          beforeQty: inventory.availableStock
        });
      }

      const grandTotal = subTotal + taxTotal + (orderData.shippingFee || 0) - (orderData.discountTotal || 0);

      // 2. Create Order
      const order = new Order({
        ...orderData,
        user: orderData.user,
        status: 'confirmed', // Assuming direct confirmation for admin/API
        statusHistory: [{ status: 'confirmed', changedBy: userId, notes: 'Order created and confirmed' }],
        subTotal,
        taxTotal,
        grandTotal,
      });

      await order.save({ session });

      // 3. Insert Order Items
      const insertedItems = await OrderItem.insertMany(
        orderItemsPayload.map(p => ({ ...p, order: order._id })),
        { session }
      );

      // 4. Synchronous Inventory Deduction
      for (const update of inventoryUpdates) {
        const inv = update.inventory;
        
        inv.availableStock -= update.quantity;
        inv.reservedStock += update.quantity;
        await inv.save({ session });

        await InventoryTransaction.create([{
          variantId: update.variantId,
          warehouseId: inv._id,
          type: 'reserve',
          quantity: update.quantity,
          beforeQty: update.beforeQty,
          afterQty: inv.availableStock,
          referenceType: 'order',
          referenceId: order._id,
          changedBy: userId,
          notes: `Order ${order.orderNumber} confirmed`
        }], { session });
      }

      await session.commitTransaction();
      session.endSession();

      return { order, items: insertedItems };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  static async getOrders(queryString: any) {
    const features = new ApiFeatures(Order.find({ isDeleted: false }).populate('user', 'firstName lastName email'), queryString)
      .filter()
      .sort()
      .limitFields()
      .search(['orderNumber']);

    await features.paginate(Order);
    const data = await features.query.lean();

    return {
      data,
      pagination: features.paginationData,
    };
  }

  static async getOrderById(id: string) {
    const order = await Order.findOne({ _id: id, isDeleted: false }).populate('user', 'firstName lastName email').lean();
    if (!order) throw new AppError('Order not found', 404);

    const items = await OrderItem.find({ order: order._id, isDeleted: false }).lean();
    return { order, items };
  }

  static async updateOrderStatus(id: string, newStatus: string, userId: string, notes?: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findOne({ _id: id, isDeleted: false }).session(session);
      if (!order) throw new AppError('Order not found', 404);

      const currentStatus = order.status;
      const allowedNext = validTransitions[currentStatus] || [];

      if (!allowedNext.includes(newStatus)) {
        throw new AppError(`Invalid state transition from ${currentStatus} to ${newStatus}`, 400);
      }

      const items = await OrderItem.find({ order: order._id }).session(session);

      // Inventory Sync Logic based on transition
      for (const item of items) {
        // We look up the inventory record where the reserve originally happened.
        // For simplicity, we grab the first matching warehouse for the variant.
        const inv = await Inventory.findOne({ variant: item.variant }).session(session);
        if (!inv) continue;

        const beforeQty = inv.availableStock;

        if (newStatus === 'cancelled') {
          inv.availableStock += item.quantity;
          inv.reservedStock -= item.quantity;
          await inv.save({ session });

          await InventoryTransaction.create([{
            variantId: item.variant,
            warehouseId: inv._id,
            type: 'release',
            quantity: item.quantity,
            beforeQty,
            afterQty: inv.availableStock,
            referenceType: 'order',
            referenceId: order._id,
            changedBy: userId,
            notes: `Order ${order.orderNumber} cancelled, stock released`
          }], { session });
        } else if (newStatus === 'shipped') {
          inv.reservedStock -= item.quantity;
          await inv.save({ session });

          await InventoryTransaction.create([{
            variantId: item.variant,
            warehouseId: inv._id,
            type: 'stock_out',
            quantity: item.quantity,
            beforeQty,
            afterQty: inv.availableStock,
            referenceType: 'order',
            referenceId: order._id,
            changedBy: userId,
            notes: `Order ${order.orderNumber} shipped, reserved stock consumed`
          }], { session });
        } else if (newStatus === 'returned') {
          inv.returnedStock += item.quantity;
          await inv.save({ session });

          await InventoryTransaction.create([{
            variantId: item.variant,
            warehouseId: inv._id,
            type: 'return',
            quantity: item.quantity,
            beforeQty,
            afterQty: inv.availableStock,
            referenceType: 'return',
            referenceId: order._id,
            changedBy: userId,
            notes: `Order ${order.orderNumber} returned, sent to returned pile`
          }], { session });
        }
      }

      order.status = newStatus as any;
      order.statusHistory.push({
        status: newStatus,
        changedBy: new mongoose.Types.ObjectId(userId),
        ...(notes && { notes }),
        date: new Date()
      });

      await order.save({ session });
      await session.commitTransaction();
      session.endSession();

      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  static async bulkStatusUpdate(updates: { id: string, status: string, notes?: string }[], userId: string) {
    const results = { processed: 0, successful: 0, failed: 0, failures: [] as any[] };
    
    for (const update of updates) {
      results.processed++;
      try {
        await this.updateOrderStatus(update.id, update.status, userId, update.notes);
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.failures.push({ id: update.id, reason: error.message });
      }
    }
    
    return results;
  }
}
