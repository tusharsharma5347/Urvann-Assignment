const express = require('express');
const Plant = require('../models/Plant');
const Category = require('../models/Category');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');

// GET /api/plants - Get all plants with pagination and filtering
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      categories,
      availability,
      minPrice,
      maxPrice,
      careLevel,
      waterNeeds,
      lightNeeds,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build search query
    const searchQuery = {};
    
    if (search) {
      // Use the same search logic as the searchPlants method
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (categories) {
      const categoryIds = categories.split(',').map(id => id.trim());
      searchQuery.categories = { $in: categoryIds };
    }
    
    if (availability !== undefined) {
      searchQuery.availability = availability === 'true';
    }
    
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
    }
    
    if (careLevel) searchQuery.careLevel = careLevel;
    if (waterNeeds) searchQuery.waterNeeds = waterNeeds;
    if (lightNeeds) searchQuery.lightNeeds = lightNeeds;

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let plants, total;
    
    if (search) {
      // If searching, first try direct plant search
      [plants, total] = await Promise.all([
        Plant.find(searchQuery)
          .populate('categories', 'name color')
          .sort(sortObject)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Plant.countDocuments(searchQuery)
      ]);
      
      // If no results, try searching by category keywords
      if (plants.length === 0) {
        const Category = mongoose.model('Category');
        const matchingCategories = await Category.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        });

        if (matchingCategories.length > 0) {
          const categoryIds = matchingCategories.map(cat => cat._id);
          const categorySearchQuery = { ...searchQuery };
          categorySearchQuery.categories = { $in: categoryIds };
          
          [plants, total] = await Promise.all([
            Plant.find(categorySearchQuery)
              .populate('categories', 'name color')
              .sort(sortObject)
              .skip(skip)
              .limit(parseInt(limit))
              .lean(),
            Plant.countDocuments(categorySearchQuery)
          ]);
        }
      }
    } else {
      // No search, just get plants with filters
      [plants, total] = await Promise.all([
        Plant.find(searchQuery)
          .populate('categories', 'name color')
          .sort(sortObject)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Plant.countDocuments(searchQuery)
      ]);
    }

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: plants,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/plants/search - Advanced search endpoint
router.get('/search', async (req, res, next) => {
  try {
    const { q, filters } = req.query;
    const parsedFilters = filters ? JSON.parse(filters) : {};
    
    const plants = await Plant.searchPlants(q, parsedFilters);
    
    res.json({
      success: true,
      data: plants,
      count: plants.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/plants/:id - Get single plant by ID
router.get('/:id', async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id)
      .populate('categories', 'name description color icon');
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }
    
    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/plants - Create new plant (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const {
      name,
      price,
      categories,
      availability = true,
      description,
      imageUrl,
      careLevel,
      waterNeeds,
      lightNeeds,
      height,
      potSize,
      isPetFriendly,
      isAirPurifying
    } = req.body;

    // Validate required fields
    if (!name || !price || !categories || categories.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and at least one category are required'
      });
    }

    // Validate categories exist
    const validCategories = await Category.find({
      _id: { $in: categories }
    });
    
    if (validCategories.length !== categories.length) {
      return res.status(400).json({
        success: false,
        error: 'One or more categories are invalid'
      });
    }

    // Create plant
    const plant = new Plant({
      name,
      price: parseFloat(price),
      categories,
      availability,
      description,
      imageUrl,
      careLevel,
      waterNeeds,
      lightNeeds,
      height: height ? parseFloat(height) : undefined,
      potSize,
      isPetFriendly: Boolean(isPetFriendly),
      isAirPurifying: Boolean(isAirPurifying)
    });

    await plant.save();
    
    // Populate categories for response
    await plant.populate('categories', 'name color');

    res.status(201).json({
      success: true,
      data: plant,
      message: 'Plant created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/plants/:id - Update plant (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key === 'price' && req.body[key] !== undefined) {
        plant[key] = parseFloat(req.body[key]);
      } else if (key === 'height' && req.body[key] !== undefined) {
        plant[key] = parseFloat(req.body[key]);
      } else if (key === 'categories' && req.body[key] !== undefined) {
        plant[key] = req.body[key];
      } else if (req.body[key] !== undefined) {
        plant[key] = req.body[key];
      }
    });

    await plant.save();
    await plant.populate('categories', 'name color');

    res.json({
      success: true,
      data: plant,
      message: 'Plant updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/plants/:id - Delete plant (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }

    res.json({
      success: true,
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/plants/categories/:categoryId - Get plants by category
router.get('/categories/:categoryId', async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [plants, total] = await Promise.all([
      Plant.find({ categories: req.params.categoryId })
        .populate('categories', 'name color')
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Plant.countDocuments({ categories: req.params.categoryId })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: plants,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
