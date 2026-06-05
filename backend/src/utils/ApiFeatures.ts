export class ApiFeatures {
  query: any;
  queryString: any;
  paginationData: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
    this.paginationData = null;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Handle date ranges (from/to)
    if (queryObj.from || queryObj.to) {
      queryObj.createdAt = {};
      if (queryObj.from) {
        queryObj.createdAt.$gte = new Date(queryObj.from);
        delete queryObj.from;
      }
      if (queryObj.to) {
        queryObj.createdAt.$lte = new Date(queryObj.to);
        delete queryObj.to;
      }
    }

    // Advanced filtering for >=, <=, etc
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  search(searchFields: string[]) {
    if (this.queryString.search && searchFields.length > 0) {
      const regex = new RegExp(this.queryString.search, 'i');
      const searchArray = searchFields.map((field) => ({ [field]: regex }));
      
      this.query = this.query.find({ $or: searchArray });
    }
    return this;
  }

  async paginate(model: any) {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // We clone the query to get total count before pagination is applied
    const totalQuery = model.find(this.query.getQuery());
    const total = await totalQuery.countDocuments();

    this.query = this.query.skip(skip).limit(limit);

    this.paginationData = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return this;
  }
}
