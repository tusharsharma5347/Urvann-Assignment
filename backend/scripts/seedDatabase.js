const mongoose = require('mongoose');
const Plant = require('../models/Plant');
const Category = require('../models/Category');
require('dotenv').config();

// Sample categories data
const categoriesData = [
  {
    name: 'Indoor',
    description: 'Perfect for indoor spaces with low to moderate light',
    icon: '🏠',
    color: '#3B82F6',
    isActive: true
  },
  {
    name: 'Outdoor',
    description: 'Thrives in outdoor gardens and landscapes',
    icon: '🌳',
    color: '#10B981',
    isActive: true
  },
  {
    name: 'Succulent',
    description: 'Low-maintenance plants that store water in their leaves',
    icon: '🌵',
    color: '#F59E0B',
    isActive: true
  },
  {
    name: 'Air Purifying',
    description: 'Plants that help clean indoor air quality',
    icon: '💨',
    color: '#8B5CF6',
    isActive: true
  },
  {
    name: 'Home Decor',
    description: 'Beautiful plants that enhance home aesthetics',
    icon: '🏡',
    color: '#EC4899',
    isActive: true
  },
  {
    name: 'Low Maintenance',
    description: 'Easy-care plants perfect for beginners',
    icon: '🌱',
    color: '#06B6D4',
    isActive: true
  },
  {
    name: 'Pet Friendly',
    description: 'Safe plants for homes with pets',
    icon: '🐾',
    color: '#84CC16',
    isActive: true
  },
  {
    name: 'Tropical',
    description: 'Exotic plants that love humidity and warmth',
    icon: '🌴',
    color: '#F97316',
    isActive: true
  }
];

// Sample plants data with realistic Indian prices (in INR) and high-quality images
const plantsData = [
  {
    name: 'Monstera Deliciosa',
    price: 899,
    description: 'A stunning tropical plant with distinctive split leaves. Perfect for adding a jungle vibe to your home.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 60,
    potSize: '6 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Home Decor']
  },
  {
    name: 'Snake Plant (Sansevieria)',
    price: 599,
    description: 'An incredibly hardy plant that can survive with minimal care. Great for beginners and busy people.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'Low',
    height: 45,
    potSize: '5 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Air Purifying']
  },
  {
    name: 'Money Plant (Pothos)',
    price: 399,
    description: 'A popular trailing plant that brings good luck and prosperity. Easy to care for and grows quickly.',
    imageUrl: 'https://images.unsplash.com/photo-1604762524889-3e4f5c92d0a8?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Low',
    height: 30,
    potSize: '4 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Home Decor', 'Air Purifying']
  },
  {
    name: 'Peace Lily',
    price: 699,
    description: 'Beautiful flowering plant that helps purify indoor air. Produces elegant white flowers.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'High',
    lightNeeds: 'Low',
    height: 50,
    potSize: '6 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Air Purifying', 'Home Decor']
  },
  {
    name: 'Aloe Vera',
    price: 299,
    description: 'Medicinal succulent plant with healing properties. Perfect for kitchen windowsills.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 25,
    potSize: '4 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Succulent', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Spider Plant',
    price: 349,
    description: 'Produces baby plants on long stems. Excellent air purifier and very easy to care for.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 40,
    potSize: '5 inch',
    isPetFriendly: true,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly', 'Air Purifying']
  },
  {
    name: 'ZZ Plant',
    price: 799,
    description: 'Ultra-low maintenance plant that can survive in almost any condition. Perfect for dark corners.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'Low',
    height: 55,
    potSize: '6 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Air Purifying']
  },
  {
    name: 'Fiddle Leaf Fig',
    price: 1299,
    description: 'Large, statement plant with big, glossy leaves. A must-have for modern home decor.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop',
    careLevel: 'Hard',
    waterNeeds: 'Medium',
    lightNeeds: 'High',
    height: 90,
    potSize: '8 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Home Decor', 'Tropical']
  },
  {
    name: 'Jade Plant',
    price: 449,
    description: 'Beautiful succulent that symbolizes good luck and prosperity. Easy to care for and long-lived.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 35,
    potSize: '5 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Succulent', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Chinese Evergreen',
    price: 549,
    description: 'Stunning variegated leaves that add color to any room. Very low maintenance.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'Low',
    height: 40,
    potSize: '5 inch',
    isPetFriendly: true,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly', 'Air Purifying']
  },
  {
    name: 'Ponytail Palm',
    price: 649,
    description: 'Unique plant with a bulbous trunk and long, curly leaves. Very drought-tolerant.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 70,
    potSize: '6 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Calathea Orbifolia',
    price: 899,
    description: 'Stunning plant with large, round leaves featuring beautiful silver stripes.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Hard',
    waterNeeds: 'High',
    lightNeeds: 'Medium',
    height: 50,
    potSize: '6 inch',
    isPetFriendly: true,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Home Decor', 'Pet Friendly']
  },
  {
    name: 'String of Pearls',
    price: 299,
    description: 'Unique trailing succulent with bead-like leaves. Perfect for hanging baskets.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 20,
    potSize: '4 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Succulent', 'Home Decor']
  },
  {
    name: 'Bird of Paradise',
    price: 1499,
    description: 'Tropical plant with large, banana-like leaves. Creates a dramatic focal point.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Medium',
    lightNeeds: 'High',
    height: 120,
    potSize: '10 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Home Decor']
  },
  {
    name: 'Pilea Peperomioides',
    price: 399,
    description: 'Popular "Pancake Plant" with round, coin-like leaves. Easy to propagate.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 25,
    potSize: '4 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Rubber Plant',
    price: 799,
    description: 'Classic houseplant with large, glossy leaves. Very easy to care for.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 80,
    potSize: '8 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Air Purifying']
  },
  {
    name: 'String of Hearts',
    price: 349,
    description: 'Beautiful trailing plant with heart-shaped leaves. Perfect for hanging displays.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 30,
    potSize: '4 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Succulent', 'Home Decor']
  },
  {
    name: 'Philodendron Brasil',
    price: 599,
    description: 'Stunning variegated philodendron with heart-shaped leaves. Easy to care for.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 45,
    potSize: '6 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Air Purifying']
  },
  {
    name: 'Haworthia',
    price: 249,
    description: 'Small, rosette-forming succulent. Perfect for small spaces and beginners.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 15,
    potSize: '3 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Succulent', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Bamboo Palm',
    price: 899,
    description: 'Elegant palm that adds tropical flair. Excellent air purifier.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'High',
    lightNeeds: 'Medium',
    height: 100,
    potSize: '8 inch',
    isPetFriendly: true,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Air Purifying', 'Pet Friendly']
  },
  {
    name: 'Echeveria',
    price: 199,
    description: 'Beautiful rosette succulent with colorful leaves. Perfect for sunny windowsills.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 20,
    potSize: '3 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Succulent', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Pothos Marble Queen',
    price: 449,
    description: 'Variegated pothos with beautiful white and green leaves. Easy to care for.',
    imageUrl: 'https://images.unsplash.com/photo-1604762524889-3e4f5c92d0a8?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Low',
    height: 35,
    potSize: '5 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Home Decor', 'Air Purifying']
  },
  {
    name: 'Cactus Collection',
    price: 399,
    description: 'Set of 3 small cacti in decorative pots. Perfect for beginners.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 25,
    potSize: '3 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Succulent', 'Low Maintenance']
  },
  {
    name: 'Boston Fern',
    price: 549,
    description: 'Classic fern with feathery fronds. Loves humidity and indirect light.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'High',
    lightNeeds: 'Low',
    height: 45,
    potSize: '6 inch',
    isPetFriendly: true,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Air Purifying', 'Pet Friendly']
  },
  {
    name: 'Croton',
    price: 699,
    description: 'Colorful plant with vibrant, variegated leaves. Adds tropical color to any room.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Medium',
    lightNeeds: 'High',
    height: 60,
    potSize: '6 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Home Decor']
  },
  {
    name: 'Dracaena Marginata',
    price: 799,
    description: 'Elegant plant with long, thin leaves. Very low maintenance and air purifying.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'Medium',
    height: 90,
    potSize: '8 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Air Purifying']
  },
  {
    name: 'Peperomia',
    price: 299,
    description: 'Compact plant with thick, waxy leaves. Perfect for small spaces.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'Medium',
    height: 20,
    potSize: '4 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Aglaonema',
    price: 649,
    description: 'Beautiful plant with colorful, variegated leaves. Very low maintenance.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'Low',
    height: 50,
    potSize: '6 inch',
    isPetFriendly: true,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly', 'Air Purifying']
  },
  {
    name: 'Schefflera',
    price: 899,
    description: 'Large, umbrella-like plant with glossy leaves. Makes a great statement piece.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 120,
    potSize: '10 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Home Decor', 'Air Purifying']
  },
  {
    name: 'Kalanchoe',
    price: 349,
    description: 'Beautiful flowering succulent. Produces clusters of colorful flowers.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 30,
    potSize: '4 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Succulent', 'Low Maintenance']
  },
  {
    name: 'Dieffenbachia',
    price: 599,
    description: 'Large plant with beautiful, variegated leaves. Perfect for filling empty corners.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 80,
    potSize: '8 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Air Purifying', 'Home Decor']
  },
  {
    name: 'Bromeliad',
    price: 499,
    description: 'Exotic plant with colorful, long-lasting flowers. Adds tropical flair to any room.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 40,
    potSize: '5 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Home Decor', 'Pet Friendly']
  },
  {
    name: 'Pilea Glauca',
    price: 249,
    description: 'Tiny trailing plant with silver-blue leaves. Perfect for terrariums and small pots.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 15,
    potSize: '3 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Hoya',
    price: 399,
    description: 'Beautiful trailing plant with waxy leaves. Produces clusters of fragrant flowers.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Low',
    lightNeeds: 'Medium',
    height: 35,
    potSize: '5 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Tradescantia',
    price: 299,
    description: 'Fast-growing trailing plant with colorful leaves. Easy to propagate.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 25,
    potSize: '4 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Ficus Lyrata',
    price: 1699,
    description: 'Large, statement plant with big, fiddle-shaped leaves. A must-have for modern homes.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop',
    careLevel: 'Hard',
    waterNeeds: 'Medium',
    lightNeeds: 'High',
    height: 150,
    potSize: '12 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Home Decor', 'Tropical']
  },
  {
    name: 'Senecio Rowleyanus',
    price: 349,
    description: 'Unique trailing succulent with bead-like leaves. Perfect for hanging baskets.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 30,
    potSize: '4 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Succulent', 'Home Decor']
  },
  {
    name: 'Calathea Medallion',
    price: 799,
    description: 'Stunning plant with round, medallion-like leaves featuring beautiful patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Hard',
    waterNeeds: 'High',
    lightNeeds: 'Medium',
    height: 55,
    potSize: '6 inch',
    isPetFriendly: true,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Home Decor', 'Pet Friendly']
  },
  {
    name: 'Pachira Aquatica',
    price: 999,
    description: 'Money tree with braided trunk and glossy leaves. Brings good luck and prosperity.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 100,
    potSize: '8 inch',
    isPetFriendly: true,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Home Decor', 'Pet Friendly']
  },
  {
    name: 'Tillandsia',
    price: 199,
    description: 'Air plant that doesn\'t need soil. Perfect for creative displays and terrariums.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 15,
    potSize: 'No pot needed',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Maranta Leuconeura',
    price: 449,
    description: 'Prayer plant with beautiful, patterned leaves that fold up at night.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Medium',
    waterNeeds: 'High',
    lightNeeds: 'Medium',
    height: 30,
    potSize: '5 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Pet Friendly']
  },
  {
    name: 'Strelitzia Nicolai',
    price: 1899,
    description: 'Giant bird of paradise with massive leaves. Creates a dramatic tropical atmosphere.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop',
    careLevel: 'Hard',
    waterNeeds: 'Medium',
    lightNeeds: 'High',
    height: 200,
    potSize: '14 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Home Decor']
  },
  {
    name: 'Pilea Cadierei',
    price: 299,
    description: 'Aluminum plant with silver-striped leaves. Easy to care for and propagate.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Medium',
    height: 25,
    potSize: '4 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Dracaena Fragrans',
    price: 899,
    description: 'Corn plant with long, arching leaves. Very low maintenance and air purifying.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'Medium',
    height: 120,
    potSize: '10 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Air Purifying']
  },
  {
    name: 'Epipremnum Aureum',
    price: 399,
    description: 'Golden pothos with yellow-variegated leaves. One of the easiest plants to care for.',
    imageUrl: 'https://images.unsplash.com/photo-1604762524889-3e4f5c92d0a8?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Low',
    height: 40,
    potSize: '5 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Air Purifying']
  },
  {
    name: 'Crassula Ovata',
    price: 349,
    description: 'Jade plant with thick, succulent leaves. Symbolizes good luck and prosperity.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'High',
    height: 30,
    potSize: '4 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Succulent', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Philodendron Scandens',
    price: 499,
    description: 'Heartleaf philodendron with trailing vines. Perfect for hanging baskets.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Medium',
    lightNeeds: 'Low',
    height: 50,
    potSize: '6 inch',
    isPetFriendly: false,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Air Purifying']
  },
  {
    name: 'Alocasia Polly',
    price: 799,
    description: 'Dramatic plant with dark, arrow-shaped leaves. Adds bold texture to any room.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Hard',
    waterNeeds: 'High',
    lightNeeds: 'Medium',
    height: 60,
    potSize: '6 inch',
    isPetFriendly: false,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Tropical', 'Home Decor']
  },
  {
    name: 'Peperomia Obtusifolia',
    price: 249,
    description: 'Baby rubber plant with thick, glossy leaves. Very low maintenance.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'Low',
    lightNeeds: 'Medium',
    height: 20,
    potSize: '3 inch',
    isPetFriendly: true,
    isAirPurifying: false,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly']
  },
  {
    name: 'Dracaena Sanderiana',
    price: 199,
    description: 'Lucky bamboo with straight, segmented stems. Brings good fortune and positive energy.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=500&h=500&fit=crop',
    careLevel: 'Easy',
    waterNeeds: 'High',
    lightNeeds: 'Low',
    height: 25,
    potSize: '3 inch',
    isPetFriendly: true,
    isAirPurifying: true,
    availability: true,
    categories: ['Indoor', 'Low Maintenance', 'Pet Friendly', 'Air Purifying']
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/plant-store';
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Plant.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Existing data cleared');

    // Insert categories
    console.log('📝 Inserting categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✅ ${createdCategories.length} categories created`);

    // Create a map of category names to IDs
    const categoryMap = {};
    createdCategories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

    // Insert plants with proper category references
    console.log('🌱 Inserting plants...');
    const plantsWithCategories = plantsData.map(plant => ({
      ...plant,
      categories: plant.categories.map(catName => categoryMap[catName])
    }));

    const createdPlants = await Plant.insertMany(plantsWithCategories);
    console.log(`✅ ${createdPlants.length} plants created`);

    // Display summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Plants: ${createdPlants.length}`);
    
    // Show some sample plants
    console.log('\n🌿 Sample plants added:');
    createdPlants.slice(0, 5).forEach(plant => {
      console.log(`   - ${plant.name}: ₹${plant.price} (${plant.categories.length} categories)`);
    });

    console.log('\n🚀 Your plant store is now ready with sample data!');
    console.log('💡 You can now:');
    console.log('   - Browse plants at /catalog');
    console.log('   - Login as admin to add more plants');
    console.log('   - Test the search functionality');
    console.log('   - Add plants to cart (guest or logged in)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding function
seedDatabase();
