import { Review } from '../models/Review.model';
import { AppError } from '../../../utils/AppError';
import { ApiFeatures } from '../../../utils/ApiFeatures';

export class ReviewService {
  static async createReview(data: any) {
    // This is primarily for the storefront, but can be used via admin API for seeding.
    return Review.create(data);
  }

  static async getReviews(queryString: any) {
    const query = Review.find({ isDeleted: false })
      .populate('user', 'firstName lastName email')
      .populate('product', 'title slug');
      
    const features = new ApiFeatures(query, queryString)
      .filter()
      .sort()
      .limitFields()
      .search(['title', 'comment']);

    await features.paginate(Review);
    const data = await features.query.lean();

    return {
      data,
      pagination: features.paginationData,
    };
  }

  static async updateReview(id: string, data: any) {
    const review = await Review.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true }
    );
    if (!review) throw new AppError('Review not found', 404);
    return review;
  }
}
