const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  },
  itemCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total and item count before saving
cartSchema.pre('save', function(next) {
  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.total = this.items.reduce((sum, item) => sum + (item.plant?.price || 0) * item.quantity, 0);
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(plantId, quantity = 1) {
  const existingItem = this.items.find(item => item.plant.toString() === plantId.toString());
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ plant: plantId, quantity });
  }
  
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(plantId) {
  this.items = this.items.filter(item => item.plant.toString() !== plantId.toString());
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = function(plantId, quantity) {
  const item = this.items.find(item => item.plant.toString() === plantId.toString());
  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter(item => item.plant.toString() !== plantId.toString());
    } else {
      item.quantity = quantity;
    }
  }
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
