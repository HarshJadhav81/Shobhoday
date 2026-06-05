import { User } from '../../users/models/User.model';
import { AppError } from '../../../utils/AppError';
import { ApiFeatures } from '../../../utils/ApiFeatures';

export class CustomerService {
  static async getCustomers(queryString: any) {
    const features = new ApiFeatures(User.find({ isDeleted: false }).select('-password -loginHistory'), queryString)
      .filter()
      .sort()
      .limitFields()
      .search(['firstName', 'lastName', 'email', 'phone']);

    await features.paginate(User);
    const data = await features.query.lean();

    return {
      data,
      pagination: features.paginationData,
    };
  }

  static async getCustomerById(id: string) {
    const customer = await User.findOne({ _id: id, isDeleted: false }).select('-password').lean();
    if (!customer) throw new AppError('Customer not found', 404);
    return customer;
  }

  static async updateCustomer(id: string, data: any) {
    // Admins can patch loyalty points, status, etc.
    const customer = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true }
    ).select('-password').lean();
    
    if (!customer) throw new AppError('Customer not found', 404);
    return customer;
  }
}
