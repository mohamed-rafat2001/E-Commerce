class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		const queryObj = { ...this.queryString };
		const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'populate'];
		excludedFields.forEach(el => delete queryObj[el]);

		// Advanced filtering (gte, lte, etc.)
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

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

	paginate() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);
		return this;
	}

	search(modelSchema) {
		if (this.queryString.search) {
			const searchRegex = new RegExp(this.queryString.search, 'i');
			const searchConditions = [{ name: searchRegex }];
			
			// If schema is provided, check for description
			if (modelSchema && modelSchema.paths.description) {
				searchConditions.push({ description: searchRegex });
			}
			
			this.query = this.query.find({ $or: searchConditions });
		}
		return this;
	}
}

export default APIFeatures;