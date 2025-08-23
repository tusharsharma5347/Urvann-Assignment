const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
    trim: true,
    maxlength: [100, 'Plant name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'At least one category is required']
  }],
  availability: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  careLevel: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  waterNeeds: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  lightNeeds: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  height: {
    type: Number,
    min: [0, 'Height cannot be negative']
  },
  potSize: {
    type: String,
    trim: true
  },
  isPetFriendly: {
    type: Boolean,
    default: false
  },
  isAirPurifying: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for formatted price
plantSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toFixed(2)}`;
});

// Virtual for category names
plantSchema.virtual('categoryNames').get(function() {
  return this.categories.map(cat => cat.name).join(', ');
});

// Text indexes for search
plantSchema.index({ name: 'text', description: 'text' });

// Pre-save hook to validate categories
plantSchema.pre('save', async function(next) {
  if (this.isModified('categories')) {
    const Category = mongoose.model('Category');
    const validCategories = await Category.find({
      _id: { $in: this.categories }
    });
    
    if (validCategories.length !== this.categories.length) {
      return next(new Error('One or more categories are invalid'));
    }
  }
  next();
});

// Static method to search plants by name and category keywords
plantSchema.statics.searchPlants = async function(query, filters = {}) {
  const searchQuery = {};
  
  // Build search query
  if (query) {
    // Search by plant name (case-insensitive)
    searchQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }
  
  // Apply additional filters
  if (filters.categories && filters.categories.length > 0) {
    searchQuery.categories = { $in: filters.categories };
  }
  
  if (filters.availability !== undefined) {
    searchQuery.availability = filters.availability;
  }
  
  if (filters.minPrice || filters.maxPrice) {
    searchQuery.price = {};
    if (filters.minPrice) searchQuery.price.$gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) searchQuery.price.$lte = parseFloat(filters.maxPrice);
  }
  
  if (filters.careLevel) searchQuery.careLevel = filters.careLevel;
  if (filters.waterNeeds) searchQuery.waterNeeds = filters.waterNeeds;
  if (filters.lightNeeds) searchQuery.lightNeeds = filters.lightNeeds;

  // Execute search with populated categories
  let plants = await this.find(searchQuery)
    .populate('categories', 'name description color icon')
    .sort({ name: 1 })
    .limit(20);

  // If no results from direct search, try searching by category keywords
  if (plants.length === 0 && query) {
    const Category = mongoose.model('Category');
    const matchingCategories = await Category.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    if (matchingCategories.length > 0) {
      const categoryIds = matchingCategories.map(cat => cat._id);
      plants = await this.find({
        categories: { $in: categoryIds }
      })
        .populate('categories', 'name description color icon')
        .sort({ name: 1 })
        .limit(20);
    }
  }

  return plants;
};

module.exports = mongoose.model('Plant', plantSchema);
