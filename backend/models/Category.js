const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true,
    default: '#10B981' // Default green color
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
categorySchema.index({ name: 1 });

// Virtual for plant count (will be populated when needed)
categorySchema.virtual('plantCount', {
  ref: 'Plant',
  localField: '_id',
  foreignField: 'categories',
  count: true
});

// Pre-save middleware to ensure unique name
categorySchema.pre('save', function(next) {
  this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  next();
});

module.exports = mongoose.model('Category', categorySchema);
