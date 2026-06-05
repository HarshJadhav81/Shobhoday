import { Coupon } from '../models/Coupon.model';
import { AppError } from '../../../utils/AppError';
import { ApiFeatures } from '../../../utils/ApiFeatures';

export class CouponService {
  static async createCoupon(data: any) {
    const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
    if (existing) throw new AppError('Coupon code already exists', 400);

    data.code = data.code.toUpperCase();
    return Coupon.create(data);
  }

  static async getCoupons(queryString: any) {
    const features = new ApiFeatures(Coupon.find({ isDeleted: false }), queryString)
      .filter()
      .sort()
      .limitFields()
      .search(['code']);

    await features.paginate(Coupon);
    const data = await features.query.lean();

    return {
      data,
      pagination: features.paginationData,
    };
  }

  static async getCouponById(id: string) {
    const coupon = await Coupon.findOne({ _id: id, isDeleted: false }).lean();
    if (!coupon) throw new AppError('Coupon not found', 404);
    return coupon;
  }

  static async updateCoupon(id: string, data: any) {
    if (data.code) {
      data.code = data.code.toUpperCase();
      const existing = await Coupon.findOne({ code: data.code, _id: { $ne: id } });
      if (existing) throw new AppError('Coupon code already exists', 400);
    }

    const coupon = await Coupon.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true }
    );
    if (!coupon) throw new AppError('Coupon not found', 404);
    return coupon;
  }

  static async deleteCoupon(id: string, deletedBy: string) {
    const coupon = await Coupon.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy, isActive: false },
      { new: true }
    );
    if (!coupon) throw new AppError('Coupon not found', 404);
    return coupon;
  }
}
