const express = require('express');
const Cart = require('../models/Cart');
const Plant = require('../models/Plant');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// GET /api/cart - Get user's cart
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.plant');
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/cart/add - Add item to cart
router.post('/add', authenticateToken, async (req, res, next) => {
  try {
    const { plantId, quantity = 1 } = req.body;

    if (!plantId) {
      return res.status(400).json({
        success: false,
        error: 'Plant ID is required'
      });
    }

    // Check if plant exists and is available
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }

    if (!plant.availability) {
      return res.status(400).json({
        success: false,
        error: 'Plant is not available'
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Add item to cart
    await cart.addItem(plantId, quantity);
    await cart.populate('items.plant');

    res.json({
      success: true,
      data: cart,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cart/update - Update item quantity
router.put('/update', authenticateToken, async (req, res, next) => {
  try {
    const { plantId, quantity } = req.body;

    if (!plantId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Plant ID and quantity are required'
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity cannot be negative'
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    await cart.updateQuantity(plantId, quantity);
    await cart.populate('items.plant');

    res.json({
      success: true,
      data: cart,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/remove - Remove item from cart
router.delete('/remove/:plantId', authenticateToken, async (req, res, next) => {
  try {
    const { plantId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    await cart.removeItem(plantId);
    await cart.populate('items.plant');

    res.json({
      success: true,
      data: cart,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', authenticateToken, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      data: cart,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/cart/count - Get cart item count
router.get('/count', authenticateToken, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const itemCount = cart ? cart.itemCount : 0;

    res.json({
      success: true,
      data: { itemCount }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
